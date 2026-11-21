import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const COOKIE = "sama_session";
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
  return new TextEncoder().encode(value);
}
export type SessionUser = { id: string; role: "PASSENGER" | "DRIVER" | "ADMIN"; fullName: string; phone: string };
export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt()
    .setExpirationTime("7d").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.id !== "string" || !["PASSENGER", "DRIVER", "ADMIN"].includes(String(payload.role))) return null;
    const user = await db.user.findUnique({ where: { id: payload.id }, select: { id: true, role: true, fullName: true, phone: true, isActive: true } });
    if (!user || !user.isActive) return null;
    return { id: user.id, role: user.role, fullName: user.fullName, phone: user.phone };
  } catch { return null; }
}
export async function requireUser(roles?: SessionUser["role"][]) {
  const user = await getSession();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (roles && !roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}
export async function destroySession() { (await cookies()).delete(COOKIE); }
