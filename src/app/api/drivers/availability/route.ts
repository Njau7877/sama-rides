import { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ available: z.boolean(), latitude: z.number().min(-90).max(90).optional(), longitude: z.number().min(-180).max(180).optional() });
export async function PATCH(req: NextRequest) {
  try { const user = await requireUser(["DRIVER"]); const v = schema.parse(await req.json()); const driver = await db.driver.findUnique({ where: { userId: user.id } }); if (!driver || !driver.verified) return Response.json({ error: "Driver profile must be verified before going online." }, { status: 403 }); const updated = await db.driver.update({ where: { userId: user.id }, data: { available: v.available, latitude: v.latitude, longitude: v.longitude } }); return ok({ available: updated.available }); } catch (e) { return errorResponse(e); }
}
