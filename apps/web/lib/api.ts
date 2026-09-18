import type { TourPackage, PackageServiceDetail, Service } from "@/types/package";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const ACCESS_TOKEN_KEY = "swatstay.auth.accessToken";

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
  HIKING_GUIDE: "Hiking",
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
    const res = await fetch(`${API_BASE_URL}/packages`, {
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

export async function fetchPackageBySlug(slug: string): Promise<TourPackage | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/packages/${slug}`, {
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

export async function fetchDestinations(): Promise<{ name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations`, {
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
  email: string;
  phone: string;
  destination: string;
  travelStart: string;
  travelEnd: string;
  travelersCount: number;
  pickupCity: string;
  packageSlug?: string;
  consent: boolean;
  preferredLanguage?: string;
  specialRequests?: string;
};

export async function submitBookingRequest(
  payload: BookingPayload,
): Promise<{ success: boolean; reference?: string; error?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: Array.isArray(json.message) ? json.message.join(" ") : (json.message || "Something went wrong"),
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

export async function createBooking(input: Record<string, unknown>) {
  const token = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(input),
  });
  const body = await response.json().catch(() => null) as { message?: string; data?: unknown } | null;
  if (!response.ok) throw new Error(Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? "We could not submit your booking request.");
  return body?.data;
}

export async function loginAccount(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null) as { message?: string; accessToken?: string; refreshToken?: string; user?: { fullName?: string; email?: string; role?: string } } | null;
  if (!response.ok || !body?.accessToken) throw new Error(body?.message ?? "Unable to log in");
  return body;
}

export async function signupAccount(input: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await response.json().catch(() => null) as { message?: string; accessToken?: string; refreshToken?: string; user?: { fullName?: string; email?: string; role?: string } } | null;
  if (!response.ok || !body?.accessToken) throw new Error(body?.message ?? "Unable to create account");
  return body;
}

export async function getMyBookings<T = unknown>() {
  const token = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  if (!token) return [] as T[];
  const response = await fetch(`${API_BASE_URL}/users/me/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const body = await response.json().catch(() => null) as { message?: string; data?: T[] } | null;
  if (!response.ok) throw new Error(body?.message ?? "Unable to load bookings");
  return body?.data ?? [] as T[];
}

export async function submitPaymentProof(bookingId: string, input: { amount: number; method: string; transactionReference: string; file: File; notes?: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  if (!token) throw new Error("Please log in before submitting payment proof.");
  const form = new FormData();
  form.append("amount", String(input.amount));
  form.append("method", input.method);
  form.append("transactionReference", input.transactionReference);
  if (input.notes) form.append("notes", input.notes);
  form.append("proof", input.file);
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/payment-proof`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const body = await response.json().catch(() => null) as { message?: string; data?: unknown } | null;
  if (!response.ok) throw new Error(body?.message ?? "Unable to submit payment proof");
  return body?.data;
}
