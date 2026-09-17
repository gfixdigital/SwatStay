import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ServiceType, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const admin = await prisma.user.upsert({ where: { email: "admin@swatstay.local" }, update: {}, create: { fullName: "SwatStay Admin", email: "admin@swatstay.local", passwordHash: await hash("ChangeMe123!", 12), role: UserRole.ADMIN } });
  const destination = await prisma.destination.upsert({ where: { slug: "kalam" }, update: {}, create: { name: "Kalam", slug: "kalam", description: "A development destination record." } });
  const pkg = await prisma.package.upsert({ where: { slug: "kalam-valley-escape" }, update: {}, create: { name: "Kalam Valley Escape", slug: "kalam-valley-escape", summary: "Seed package for local development.", durationDays: 3, basePrice: 45000, destinationId: destination.id, items: { create: [{ serviceType: ServiceType.HOTEL, title: "Hotel arrangement" }, { serviceType: ServiceType.TRANSPORT, title: "Local transport option" }] } } });
  console.log(`Seeded admin ${admin.email} and package ${pkg.slug}`);
}

main().finally(() => prisma.$disconnect());
