import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_NAME?.trim() || "SwatStay Admin";

async function main() {
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this command.");
  if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  try {
    const passwordHash = await hash(password, 12);
    const user = await prisma.user.upsert({ where: { email }, update: { fullName, passwordHash, role: "ADMIN", isActive: true }, create: { email, fullName, passwordHash, role: "ADMIN", isActive: true } });
    console.log(`Admin account ready: ${user.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
