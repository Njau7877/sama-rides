import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const fullName = process.env.ADMIN_NAME?.trim();
  const rawPhone = process.env.ADMIN_PHONE?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!fullName || !rawPhone || !password || password.length < 12) {
    throw new Error("Set ADMIN_NAME, ADMIN_PHONE and ADMIN_PASSWORD (at least 12 characters) before running the seed.");
  }

  const phone = rawPhone.startsWith("+") ? rawPhone : "+" + rawPhone;
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await db.user.upsert({
    where: { phone },
    update: { fullName, email: email || null, passwordHash, role: "ADMIN", isActive: true },
    create: { fullName, phone, email: email || null, passwordHash, role: "ADMIN" }
  });
  console.log("Administrator account ready:", admin.id);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await db.$disconnect();
});
