import type { TourPackage, PackageServiceDetail, Service } from "@/types/package";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

type ApiPackage = {
  id: string;
  slug: string;
  name: string;
  type: string;
  tier: string;
  description: string;
  route: string;
  summary: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  currency: string;
  image: string | null;
  coverImageUrl: string | null;
  destination: { id: string; name: string; slug: string };
  items: { serviceType: string; title: string; description: string }[];
  serviceAssignments: {
    serviceType: string;
    providerName: string;
    displayTitle: string;
    displayDescription: string;
    displayLocation: string | null;
    assignmentStatus: string;
  }[];
};

const SERVICE_MAP: Record<string, Service> = {
  HOTEL: "Hotel",
  TRANSPORT: "Transport",
  RESTAURANT: "Meals",
  GUIDE: "Guide",
  HIKING: "Hiking",
};

function mapServiceType(t: string): Service {
  return SERVICE_MAP[t] || "Hotel";
}

function durationLabel(days: number, nights: number): string {
  return `${days} day${days !== 1 ? "s" : ""}`;
}

function buildServiceDetails(pkg: ApiPackage): PackageServiceDetail[] {
  return pkg.serviceAssignments.map((sa) => ({
    service: mapServiceType(sa.serviceType),
    providerName: sa.providerName,
    title: sa.displayTitle,
    description: sa.displayDescription,
    location: sa.displayLocation || undefined,
    assignmentStatus: sa.assignmentStatus === "sample" ? "sample" : "pending",
  }));
}

function buildServices(pkg: ApiPackage): Service[] {
  const seen = new Set<Service>();
  for (const sa of pkg.serviceAssignments) {
    seen.add(mapServiceType(sa.serviceType));
  }
  return [...seen];
}

function transformPackage(pkg: ApiPackage): TourPackage {
  return {
    slug: pkg.slug,
    title: pkg.name,
    destination: pkg.destination.name,
    route: pkg.route,
    duration: durationLabel(pkg.durationDays, pkg.durationNights),
    type: pkg.type as TourPackage["type"],
    tier: pkg.tier as TourPackage["tier"],
    price: pkg.basePrice,
    image: pkg.image || pkg.coverImageUrl || "",
    description: pkg.description,
    services: buildServices(pkg),
    serviceDetails: buildServiceDetails(pkg),
    itinerary: [],
  };
}

export async function fetchPackages(): Promise<TourPackage[]> {
  try {
    const res = await fetch(`${API_URL}/packages`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data.map(transformPackage);
  } catch {
    return [];
  }
}

export async function fetchPackageBySlug(
  slug: string,
): Promise<TourPackage | null> {
  try {
    const res = await fetch(`${API_URL}/packages/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;
    return transformPackage(json.data);
  } catch {
    return null;
  }
}

export async function fetchDestinations(): Promise<
  { name: string; slug: string }[]
> {
  try {
    const res = await fetch(`${API_URL}/destinations`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data.map((d: { name: string; slug: string }) => ({
      name: d.name,
      slug: d.slug,
    }));
  } catch {
    return [];
  }
}

export type BookingPayload = {
  fullName: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  destination?: string;
  travelStart?: string;
  travelEnd?: string;
  travelersCount?: number;
  travelerType?: string;
  tier?: string;
  pickupCity?: string;
  specialRequests?: string;
  preferredPaymentMethod?: string;
  preferredLanguage?: string;
  packageSlug?: string;
  packageTitle?: string;
  consentAccepted: boolean;
};

export async function submitBookingRequest(
  payload: BookingPayload,
): Promise<{ success: boolean; reference?: string; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/bookings/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Something went wrong",
      };
    }
    return {
      success: true,
      reference: json.data?.reference,
    };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
