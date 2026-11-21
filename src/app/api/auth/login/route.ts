import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ phone: z.string().trim().min(9).max(16), password: z.string().min(1).max(72) });
export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const phone = body.phone.startsWith("+") ? body.phone : "+" + body.phone;
    const user = await db.user.findUnique({ where: { phone } });
    if (!user || !user.isActive || !(await bcrypt.compare(body.password, user.passwordHash))) return Response.json({ error: "Invalid phone number or password." }, { status: 401 });
    await createSession({ id: user.id, fullName: user.fullName, phone: user.phone, role: user.role });
    return ok({ id: user.id, fullName: user.fullName, phone: user.phone, role: user.role });
  } catch (e) { return errorResponse(e); }
}
