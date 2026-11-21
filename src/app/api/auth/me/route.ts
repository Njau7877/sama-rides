import { getSession } from "@/lib/auth";
import { ok } from "@/lib/http";
export async function GET() { const user = await getSession(); return user ? ok(user) : Response.json({ error: "Unauthenticated" }, { status: 401 }); }
