import { VehicleType } from "@prisma/client";
const rates: Record<VehicleType, { base: number; perKm: number; perMinute: number; minimum: number }> = {
  ECONOMY: { base: 100, perKm: 35, perMinute: 3, minimum: 180 },
  COMFORT: { base: 160, perKm: 48, perMinute: 4, minimum: 250 },
  XL: { base: 220, perKm: 60, perMinute: 5, minimum: 350 },
  MOTORBIKE: { base: 50, perKm: 22, perMinute: 2, minimum: 100 }
};
export function estimateFare(distanceKm: number, minutes: number, type: VehicleType) {
  if (!Number.isFinite(distanceKm) || !Number.isFinite(minutes) || distanceKm <= 0 || minutes <= 0) throw new Error("Distance and duration must be positive numbers.");
  const r = rates[type];
  return Math.max(r.minimum, Math.round(r.base + distanceKm * r.perKm + minutes * r.perMinute));
}
export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const rad = (n: number) => n * Math.PI / 180;
  const dLat = rad(bLat - aLat), dLng = rad(bLng - aLng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
