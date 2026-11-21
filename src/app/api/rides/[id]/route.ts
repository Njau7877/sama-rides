import { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ status: z.enum(["ACCEPTED", "ARRIVING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]) });
const transitions: Record<string, string[]> = { REQUESTED: ["CANCELLED"], MATCHED: ["ACCEPTED", "CANCELLED"], ACCEPTED: ["ARRIVING", "CANCELLED"], ARRIVING: ["IN_PROGRESS", "CANCELLED"], IN_PROGRESS: ["COMPLETED"] };
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); const { id } = await ctx.params; const ride = await db.ride.findUnique({ where: { id }, include: { passenger: { select: { id: true, fullName: true, phone: true } }, driver: { select: { id: true, fullName: true, phone: true } } } }); if (!ride) return Response.json({ error: "Ride not found" }, { status: 404 }); if (user.role !== "ADMIN" && ride.passengerId !== user.id && ride.driverId !== user.id) return Response.json({ error: "Forbidden" }, { status: 403 }); return ok(ride); } catch (e) { return errorResponse(e); }
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await ctx.params; const { status } = schema.parse(await req.json());
    const ride = await db.ride.findUnique({ where: { id } }); if (!ride) return Response.json({ error: "Ride not found" }, { status: 404 });
    const isPassengerCancel = status === "CANCELLED" && ride.passengerId === user.id && ["REQUESTED", "MATCHED", "ACCEPTED", "ARRIVING"].includes(ride.status);
    const isDriverAction = user.role === "DRIVER" && ride.driverId === user.id && transitions[ride.status].includes(status);
    const isAdmin = user.role === "ADMIN" && transitions[ride.status].includes(status);
    if (!isPassengerCancel && !isDriverAction && !isAdmin) return Response.json({ error: "This account cannot perform that ride transition." }, { status: 403 });
    const updated = await db.ride.update({ where: { id }, data: { status, ...(status === "ACCEPTED" ? { acceptedAt: new Date() } : {}), ...(status === "IN_PROGRESS" ? { startedAt: new Date() } : {}), ...(status === "COMPLETED" ? { completedAt: new Date() } : {}), ...(status === "CANCELLED" ? { cancelledAt: new Date() } : {}) } });
    await db.auditEvent.create({ data: { actorId: user.id, action: "RIDE_" + status, entityType: "Ride", entityId: id } });
    return ok(updated);
  } catch (e) { return errorResponse(e); }
}
