import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const destinations = [
  {
    name: "Kalam",
    slug: "kalam",
    shortDescription: "Cool forests and river walks",
    description: "A mountain valley destination in upper Swat, known for lush forests, the Swat River, and hiking trails toward Ushu and Mahodand.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
    bestFor: ["Families", "Couples", "Hiking"],
  },
  {
    name: "Malam Jabba",
    slug: "malam-jabba",
    shortDescription: "Snow, lifts, and alpine views",
    description: "A hill station in the Hindu Kush range featuring skiing, a ski lift, and panoramic alpine views.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    bestFor: ["Winter trips", "Couples", "Adventure"],
  },
  {
    name: "Bahrain",
    slug: "bahrain",
    shortDescription: "Riverside food and local life",
    description: "A riverside town known for trout restaurants, local bazaars, and relaxed stays along the Swat River.",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=85",
    bestFor: ["Families", "Food", "Relaxed stays"],
  },
  {
    name: "Madyan",
    slug: "madyan",
    shortDescription: "Valley views and village walks",
    description: "A quiet village on the way to Bahrain, known for valley views, handicraft shops, and easy walks.",
    imageUrl: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=900&q=85",
    bestFor: ["Families", "Village life", "Photography"],
  },
];

const packages = [
  {
    destinationSlug: "kalam",
    name: "Couple Standard - Kalam",
    slug: "couple-standard-kalam",
    type: "COUPLE" as const,
    tier: "STANDARD" as const,
    description: "A balanced valley escape with a comfortable stay, scenic drives, and time beside the Swat River.",
    route: "Mingora · Kalam · Ushu Forest",
    summary: "3-day couple package with hotel, transport, and meals",
    durationDays: 3,
    durationNights: 2,
    basePrice: 48000,
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85",
    items: [
      { serviceType: "HOTEL" as const, title: "Standard valley hotel", description: "Double room with breakfast, subject to availability." },
      { serviceType: "TRANSPORT" as const, title: "Private car with local driver", description: "Mingora to Kalam route coverage and return transfer." },
      { serviceType: "RESTAURANT" as const, title: "Breakfast and dinner", description: "Meal plan can be adjusted during the confirmation call." },
    ],
    serviceAssignments: [
      { serviceType: "HOTEL" as const, providerName: "Sample Kalam Stay", displayTitle: "Standard valley hotel", displayDescription: "Double room with breakfast, subject to availability.", displayLocation: "Kalam", assignmentStatus: "sample", sortOrder: 0 },
      { serviceType: "TRANSPORT" as const, providerName: "Sample Valley Transport", displayTitle: "Private car with local driver", displayDescription: "Mingora to Kalam route coverage and return transfer.", assignmentStatus: "sample", sortOrder: 1 },
      { serviceType: "RESTAURANT" as const, providerName: "Sample Kalam Kitchen", displayTitle: "Breakfast and dinner", displayDescription: "Meal plan can be adjusted during the confirmation call.", displayLocation: "Kalam", assignmentStatus: "sample", sortOrder: 2 },
    ],
  },
  {
    destinationSlug: "kalam",
    name: "Family Basic - Swat",
    slug: "family-basic-swat",
    type: "FAMILY" as const,
    tier: "BASIC" as const,
    description: "An easy-paced introduction to Swat for families who want a short, practical getaway.",
    route: "Mingora · Fizagat · Madyan",
    summary: "2-day family package with hotel and transport",
    durationDays: 2,
    durationNights: 1,
    basePrice: 32000,
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85",
    items: [
      { serviceType: "HOTEL" as const, title: "Family room", description: "Clean family accommodation near the Mingora and Fizagat route." },
      { serviceType: "TRANSPORT" as const, title: "Shared or local transport option", description: "Route transport arranged after traveler count and pickup are confirmed." },
      { serviceType: "RESTAURANT" as const, title: "Breakfast", description: "Breakfast included; additional meals can be discussed on the call." },
    ],
    serviceAssignments: [
      { serviceType: "HOTEL" as const, providerName: "Sample Fizagat Hotel", displayTitle: "Family room", displayDescription: "Clean family accommodation near the Mingora and Fizagat route.", displayLocation: "Fizagat", assignmentStatus: "sample", sortOrder: 0 },
      { serviceType: "TRANSPORT" as const, providerName: "Sample Swat Transport", displayTitle: "Shared or local transport option", displayDescription: "Route transport arranged after traveler count and pickup are confirmed.", assignmentStatus: "sample", sortOrder: 1 },
      { serviceType: "RESTAURANT" as const, providerName: "Sample Local Restaurant", displayTitle: "Breakfast", displayDescription: "Breakfast included; additional meals can be discussed on the call.", displayLocation: "Mingora", assignmentStatus: "sample", sortOrder: 2 },
    ],
  },
  {
    destinationSlug: "malam-jabba",
    name: "Private Premium - Malam Jabba",
    slug: "private-premium-malam-jabba",
    type: "PRIVATE" as const,
    tier: "PREMIUM" as const,
    description: "A private alpine itinerary pairing Malam Jabba's mountain views with a riverside stay in Bahrain.",
    route: "Mingora · Malam Jabba · Bahrain",
    summary: "3-day private package with premium hotel, transport, and guide",
    durationDays: 3,
    durationNights: 2,
    basePrice: 74000,
    image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1400&q=85",
    items: [
      { serviceType: "HOTEL" as const, title: "Premium mountain stay", description: "Higher hotel level with a mountain-facing room request, subject to availability." },
      { serviceType: "TRANSPORT" as const, title: "Private vehicle", description: "Private vehicle for the full route with local road support." },
      { serviceType: "GUIDE" as const, title: "Valley guide support", description: "Local guide support for agreed viewpoints and activities." },
    ],
    serviceAssignments: [
      { serviceType: "HOTEL" as const, providerName: "Sample Malam Jabba Resort", displayTitle: "Premium mountain stay", displayDescription: "Higher hotel level with a mountain-facing room request, subject to availability.", displayLocation: "Malam Jabba", assignmentStatus: "sample", sortOrder: 0 },
      { serviceType: "TRANSPORT" as const, providerName: "Sample Private Driver", displayTitle: "Private vehicle", displayDescription: "Private vehicle for the full route with local road support.", assignmentStatus: "sample", sortOrder: 1 },
      { serviceType: "GUIDE" as const, providerName: "Sample Local Guide", displayTitle: "Valley guide support", displayDescription: "Local guide support for agreed viewpoints and activities.", assignmentStatus: "sample", sortOrder: 2 },
    ],
  },
];

async function seed() {
  console.log("Seeding destinations...");

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {
        name: dest.name,
        shortDescription: dest.shortDescription,
        description: dest.description,
        imageUrl: dest.imageUrl,
        bestFor: dest.bestFor,
      },
      create: {
        name: dest.name,
        slug: dest.slug,
        shortDescription: dest.shortDescription,
        description: dest.description,
        imageUrl: dest.imageUrl,
        bestFor: dest.bestFor,
      },
    });
  }

  console.log(`Seeded ${destinations.length} destinations`);

  console.log("Seeding packages...");

  for (const pkg of packages) {
    const dest = await prisma.destination.findUnique({ where: { slug: pkg.destinationSlug } });
    if (!dest) {
      console.error(`Destination ${pkg.destinationSlug} not found, skipping package ${pkg.slug}`);
      continue;
    }

    const existing = await prisma.package.findUnique({ where: { slug: pkg.slug } });
    if (existing) {
      await prisma.package.update({
        where: { slug: pkg.slug },
        data: {
          name: pkg.name,
          type: pkg.type,
          tier: pkg.tier,
          description: pkg.description,
          route: pkg.route,
          summary: pkg.summary,
          durationDays: pkg.durationDays,
          durationNights: pkg.durationNights,
          basePrice: pkg.basePrice,
          image: pkg.image,
          destinationId: dest.id,
        },
      });
      console.log(`Updated package: ${pkg.slug}`);
    } else {
      await prisma.package.create({
        data: {
          name: pkg.name,
          slug: pkg.slug,
          type: pkg.type,
          tier: pkg.tier,
          description: pkg.description,
          route: pkg.route,
          summary: pkg.summary,
          durationDays: pkg.durationDays,
          durationNights: pkg.durationNights,
          basePrice: pkg.basePrice,
          image: pkg.image,
          destinationId: dest.id,
          items: { create: pkg.items },
          serviceAssignments: { create: pkg.serviceAssignments },
        },
      });
      console.log(`Created package: ${pkg.slug}`);
    }
  }

  console.log(`Seeded ${packages.length} packages`);
  console.log("Seed complete!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
