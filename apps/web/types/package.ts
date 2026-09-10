export type PackageType = "Solo" | "Couple" | "Family" | "Group" | "Private" | "Sharing";
export type PackageTier = "Basic" | "Standard" | "Premium" | "Luxury";
export type Service = "Hotel" | "Transport" | "Meals" | "Guide" | "Hiking";
export type TourPackage = { slug: string; title: string; destination: string; route: string; duration: string; type: PackageType; tier: PackageTier; price: number; image: string; description: string; services: Service[]; itinerary: { day: string; title: string; description: string }[]; };
