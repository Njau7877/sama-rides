import { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { haversineKm } from "@/lib/fare";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ rideId: z.string().min(1) });
export async function POST(req: NextRequest) {
  try {
    const admin = await requireUser(["ADMIN"]); const { rideId } = schema.parse(await req.json());
    const ride = await db.ride.findUnique({ where: { id: rideId } }); if (!ride || ride.status !== "REQUESTED") return Response.json({ error: "Ride is not available for matching." }, { status: 409 });
    const drivers = await db.driver.findMany({ where: { available: true, verified: true, vehicleType: ride.vehicleType, latitude: { not: null }, longitude: { not: null }, user: { isActive: true } }, include: { user: { select: { id: true } } } });
    const ranked = drivers.map(d => ({ d, distance: haversineKm(ride.pickupLat, ride.pickupLng, d.latitude!, d.longitude!) })).filter(x => x.distance <= 15).sort((a,b) => a.distance - b.distance || b.d.rating - a.d.rating);
    if (!ranked.length) return ok({ matched: false, reason: "No verified nearby driver is available." });
    const chosen = ranked[0].d;
    const result = await db.$transaction([
      db.ride.update({ where: { id: ride.id, status: "REQUESTED" }, data: { driverId: chosen.userId, status: "MATCHED" } }),
      db.driver.update({ where: { id: chosen.id }, data: { available: false } }),
      db.auditEvent.create({ data: { actorId: admin.id, action: "DRIVER_MATCHED", entityType: "Ride", entityId: ride.id, metadata: { driverId: chosen.userId, distanceKm: ranked[0].distance } } })
    ]);
    return ok({ matched: true, ride: result[0], driverId: chosen.userId, pickupDistanceKm: Number(ranked[0].distance.toFixed(2)) });
  } catch (e) { return errorResponse(e); }
}
