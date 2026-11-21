import { NextRequest } from "next/server";
import { z } from "zod";
import { VehicleType } from "@prisma/client";
import { estimateFare } from "@/lib/fare";
import { errorResponse, ok } from "@/lib/http";
const schema = z.object({ distanceKm: z.number().positive().max(500), estimatedMinutes: z.number().int().positive().max(1000), vehicleType: z.nativeEnum(VehicleType) });
export async function POST(req: NextRequest) { try { const v = schema.parse(await req.json()); return ok({ currency: "KES", estimatedFare: estimateFare(v.distanceKm, v.estimatedMinutes, v.vehicleType) }); } catch (e) { return errorResponse(e); } }
