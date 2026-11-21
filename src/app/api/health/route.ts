import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET() {
  try { await db.$queryRaw`SELECT 1`; return NextResponse.json({ status: "ok", service: "sama-rides-api", database: "connected", timestamp: new Date().toISOString() }); }
  catch { return NextResponse.json({ status: "degraded", service: "sama-rides-api", database: "unavailable" }, { status: 503 }); }
}
