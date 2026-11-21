import { NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ fullName: z.string().min(2), phone: z.string().regex(/^\+?[0-9]{9,15}$/), password: z.string().min(10).max(72), vehicleMake: z.string().min(1), vehicleModel: z.string().min(1), vehicleColor: z.string().min(1), registration: z.string().min(3), vehicleType: z.enum(["ECONOMY","COMFORT","XL","MOTORBIKE"]) });
export async function GET() { try { await requireUser(["ADMIN"]); return ok(await db.driver.findMany({ include: { user: { select: { id: true, fullName: true, phone: true, isActive: true } } }, orderBy: { createdAt: "desc" } })); } catch (e) { return errorResponse(e); } }
export async function POST(req: NextRequest) {
  try { await requireUser(["ADMIN"]); const v = schema.parse(await req.json()); const bcrypt = await import("bcryptjs"); const phone = v.phone.startsWith("+") ? v.phone : "+" + v.phone; const hash = await bcrypt.hash(v.password, 12); const driver = await db.user.create({ data: { fullName: v.fullName, phone, passwordHash: hash, role: "DRIVER", driver: { create: { vehicleMake: v.vehicleMake, vehicleModel: v.vehicleModel, vehicleColor: v.vehicleColor, registration: v.registration.toUpperCase(), vehicleType: v.vehicleType } } }, include: { driver: true }, select: { id: true, fullName: true, phone: true, driver: true } }); return ok(driver, 201); } catch (e) { return errorResponse(e); }
}
