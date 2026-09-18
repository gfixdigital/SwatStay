import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const destinations = [
  {
    name: "Kalam",
    slug: "kalam",
    shortDescription: "Mountain valley destination in the upper Swat Valley",
    description:
      "Kalam is a picturesque valley in the upper Swat region known for its pine forests, alpine meadows, and the Swat River.",
    bestFor: ["Families", "Couples", "Hiking"],
    isActive: true,
  },
  {
    name: "Malam Jabba",
    slug: "malam-jabba",
    shortDescription: "Alpine hill station with mountain views and seasonal activities",
    description:
      "Malam Jabba is a hill station in the Hindu Kush range offering skiing, hiking, and panoramic mountain scenery.",
    bestFor: ["Couples", "Adventure", "Winter sports"],
    isActive: true,
  },
  {
    name: "Swat",
    slug: "swat",
    shortDescription: "TheSwat Valley region covering Mingora, Fizagat, and surrounding areas",
    description:
      "Swat Valley is a broad region in Khyber Pakhtunkhwa known for its rivers, lakes, and cultural heritage.",
    bestFor: ["Families", "Budget", "Short trips"],
    isActive: true,
  },
];

const packages = [
  {
    name: "Couple Standard - Kalam 3 Days",
    slug: "couple-standard-kalam-3-days",
    summary:
      "A balanced valley escape with a comfortable stay, scenic drives, and time beside the Swat River.",
    packageType: "Couple",
    tier: "Standard",
    route: "Mingora · Kalam · Ushu Forest",
    durationDays: 3,
    basePrice: 48000,
    currency: "PKR",
    imageUrl:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      {
        day: "Day 1",
        title: "Mingora to Kalam",
        description:
          "Meet your driver, travel through the upper valley, and settle into your Kalam stay.",
      },
      {
        day: "Day 2",
        title: "Ushu Forest and river views",
        description:
          "Explore Ushu Forest with a local guide and enjoy an unhurried riverside evening.",
      },
      {
        day: "Day 3",
        title: "Kalam morning, return drive",
        description:
          "Have breakfast with a valley view before returning to Mingora.",
      },
    ],
    cancellationSummary:
      "Advance payment is refundable according to provider policy. Weather and road changes may require rescheduling.",
    destinationSlug: "kalam",
    items: [
      {
        serviceType: "HOTEL",
        title: "Standard valley hotel",
        description: "Double room with breakfast, subject to availability.",
      },
      {
        serviceType: "TRANSPORT",
        title: "Private car with local driver",
        description: "Mingora to Kalam route coverage and return transfer.",
      },
      {
        serviceType: "RESTAURANT",
        title: "Breakfast and dinner",
        description:
          "Meal plan can be adjusted during the confirmation call.",
      },
    ],
  },
  {
    name: "Family Basic - Swat 2 Days",
    slug: "family-basic-swat-2-days",
    summary:
      "An easy-paced introduction to Swat for families who want a short, practical getaway.",
    packageType: "Family",
    tier: "Basic",
    route: "Mingora · Fizagat · Madyan",
    durationDays: 2,
    basePrice: 32000,
    currency: "PKR",
    imageUrl:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      {
        day: "Day 1",
        title: "Mingora and Fizagat",
        description:
          "Arrive, check in, and spend the afternoon around Fizagat Park and the river.",
      },
      {
        day: "Day 2",
        title: "Madyan valley drive",
        description:
          "Travel north for valley views and local food before returning in the evening.",
      },
    ],
    cancellationSummary:
      "Advance payment is refundable according to provider policy.",
    destinationSlug: "swat",
    items: [
      {
        serviceType: "HOTEL",
        title: "Family room",
        description:
          "Clean family accommodation near the Mingora and Fizagat route.",
      },
      {
        serviceType: "TRANSPORT",
        title: "Shared or local transport option",
        description:
          "Route transport arranged after traveler count and pickup are confirmed.",
      },
      {
        serviceType: "RESTAURANT",
        title: "Breakfast",
        description:
          "Breakfast included; additional meals can be discussed on the call.",
      },
    ],
  },
  {
    name: "Private Premium - Malam Jabba 3 Days",
    slug: "private-premium-malam-jabba-3-days",
    summary:
      "A private alpine itinerary pairing Malam Jabba mountain views with a riverside stay in Bahrain.",
    packageType: "Private",
    tier: "Premium",
    route: "Mingora · Malam Jabba · Bahrain",
    durationDays: 3,
    basePrice: 74000,
    currency: "PKR",
    imageUrl:
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1400&q=85",
    itinerary: [
      {
        day: "Day 1",
        title: "Mingora to Malam Jabba",
        description: "Drive into the hills, settle in, and take in the resort views.",
      },
      {
        day: "Day 2",
        title: "Mountain day",
        description:
          "Choose a relaxed viewpoint walk or seasonal activities with local support.",
      },
      {
        day: "Day 3",
        title: "Bahrain and return",
        description:
          "Stop in Bahrain for riverside food before the drive back to Mingora.",
      },
    ],
    cancellationSummary:
      "Advance payment is refundable according to provider policy. Weather and road changes may require rescheduling.",
    destinationSlug: "malam-jabba",
    items: [
      {
        serviceType: "HOTEL",
        title: "Premium mountain stay",
        description:
          "Higher hotel level with a mountain-facing room request, subject to availability.",
      },
      {
        serviceType: "TRANSPORT",
        title: "Private vehicle",
        description: "Private vehicle for the full route with local road support.",
      },
      {
        serviceType: "GUIDE",
        title: "Valley guide support",
        description:
          "Local guide support for agreed viewpoints and activities.",
      },
    ],
  },
];

async function main() {
  console.log("Seeding destinations...");
  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: dest,
    });
  }

  console.log("Seeding packages...");
  for (const pkg of packages) {
    const destination = await prisma.destination.findUnique({
      where: { slug: pkg.destinationSlug },
    });
    if (!destination) {
      console.error(`Destination ${pkg.destinationSlug} not found, skipping package ${pkg.name}`);
      continue;
    }
    const { destinationSlug, items, ...pkgData } = pkg;
    const existing = await prisma.package.findUnique({ where: { slug: pkg.slug } });
    if (existing) {
      await prisma.package.update({ where: { slug: pkg.slug }, data: pkgData });
      await prisma.packageItem.deleteMany({ where: { packageId: existing.id } });
      await prisma.packageItem.createMany({
        data: items.map((item) => ({ packageId: existing.id, ...item })),
      });
    } else {
      await prisma.package.create({
        data: {
          ...pkgData,
          destinationId: destination.id,
          items: { create: items },
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
