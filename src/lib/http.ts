import { NextResponse } from "next/server";
export function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  const status = message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 400;
  return NextResponse.json({ error: status === 400 && message.length > 180 ? "Request failed" : message }, { status });
}
export function ok(data: unknown, status = 200) { return NextResponse.json({ data }, { status }); }
