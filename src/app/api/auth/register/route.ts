import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ fullName: z.string().trim().min(2).max(80), phone: z.string().trim().regex(/^\+?[0-9]{9,15}$/), email: z.string().email().optional().or(z.literal("")), password: z.string().min(10).max(72) });
export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const phone = body.phone.startsWith("+") ? body.phone : "+" + body.phone;
    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await db.user.create({ data: { fullName: body.fullName, phone, email: body.email || null, passwordHash }, select: { id: true, fullName: true, phone: true, role: true } });
    await createSession(user);
    return ok(user, 201);
  } catch (e) { return errorResponse(e); }
}
