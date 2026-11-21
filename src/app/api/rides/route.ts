import { NextRequest } from "next/server";
import { z } from "zod";
import { VehicleType } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { estimateFare } from "@/lib/fare";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ pickupAddress: z.string().trim().min(3).max(180), destinationAddress: z.string().trim().min(3).max(180), pickupLat: z.number().min(-90).max(90), pickupLng: z.number().min(-180).max(180), destinationLat: z.number().min(-90).max(90), destinationLng: z.number().min(-180).max(180), distanceKm: z.number().positive().max(500), estimatedMinutes: z.number().int().positive().max(1000), vehicleType: z.nativeEnum(VehicleType), passengerNote: z.string().max(300).optional() });
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(["PASSENGER"]);
    const v = schema.parse(await req.json());
    const fareKes = estimateFare(v.distanceKm, v.estimatedMinutes, v.vehicleType);
    const ride = await db.ride.create({ data: { ...v, passengerId: user.id, fareKes }, select: { id: true, pickupAddress: true, destinationAddress: true, fareKes: true, status: true, createdAt: true } });
    await db.auditEvent.create({ data: { actorId: user.id, action: "RIDE_REQUESTED", entityType: "Ride", entityId: ride.id } });
    return ok(ride, 201);
  } catch (e) { return errorResponse(e); }
}
export async function GET() {
  try {
    const user = await requireUser();
    const where = user.role === "ADMIN" ? {} : user.role === "DRIVER" ? { driverId: user.id } : { passengerId: user.id };
    const rides = await db.ride.findMany({ where, orderBy: { createdAt: "desc" }, take: 50, include: { passenger: { select: { id: true, fullName: true, phone: true } }, driver: { select: { id: true, fullName: true, phone: true } } } });
    return ok(rides);
  } catch (e) { return errorResponse(e); }
}
