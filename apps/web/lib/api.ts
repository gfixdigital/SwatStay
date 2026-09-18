import type { TourPackage } from "@/types/package";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const ACCESS_TOKEN_KEY = "swatstay.auth.accessToken";

type ApiPackage = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  type?: string;
  tier?: string;
  durationDays: number;
  durationNights?: number;
  startingPrice: number;
  currency?: string;
  imageUrl?: string | null;
  destination?: { name: string; slug: string } | null;
  includedServices?: string[];
  itinerary?: { day: string; title: string; description: string }[];
  items?: { serviceType: string; title: string; description?: string | null }[];
};

function serviceName(value: string): TourPackage["services"][number] {
  const map: Record<string, TourPackage["services"][number]> = {
    HOTEL: "Hotel",
    TRANSPORT: "Transport",
    GUIDE: "Guide",
    HIKING_GUIDE: "Hiking",
    RESTAURANT: "Meals",
    PHOTOGRAPHY: "Guide",
    ACTIVITY: "Guide",
  };
  return map[value] ?? "Guide";
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85";

function mapPackage(item: ApiPackage): TourPackage {
  const services: TourPackage["services"] = (item.includedServices ?? []).map(
    (s) => s as TourPackage["services"][number],
  );
  return {
    slug: item.slug,
    title: item.title,
    destination: item.destination?.name ?? "",
    route: item.destination?.name ?? "",
    duration: `${item.durationDays} days`,
    type: (item.type as TourPackage["type"]) ?? "Private",
    tier: (item.tier as TourPackage["tier"]) ?? "Standard",
    price: item.startingPrice,
    image: item.imageUrl || FALLBACK_IMAGE,
    description: item.description ?? "A call-confirmed Swat tour package with local service arrangements.",
    services: services.length > 0 ? services : (item.items ?? []).map((entry) => serviceName(entry.serviceType)),
    serviceDetails: (item.items ?? []).map((entry) => ({
      service: serviceName(entry.serviceType),
      providerName: "Provider to be confirmed",
      title: entry.title,
      description: entry.description ?? "Details confirmed by the GFix team during the booking call.",
      assignmentStatus: "pending" as const,
    })),
    itinerary: item.itinerary ?? [],
  };
}

export async function getPackage(slug: string) {
  const response = await fetch(`${API_BASE_URL}/packages/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { data: ApiPackage };
  return body.data ? mapPackage(body.data) : undefined;
}

export async function createBooking(input: Record<string, unknown>) {
  const token = typeof window !== "undefined" ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => null)) as { success?: boolean; message?: string | string[]; data?: unknown; errors?: { field: string; message: string }[] } | null;
  if (!response.ok) {
    const errors = body?.errors;
    if (errors && errors.length > 0) {
      const msg = errors.map((e) => `${e.field}: ${e.message}`).join("; ");
      throw new Error(msg);
    }
    throw new Error(Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? "We could not submit your booking request.");
  }
  return body?.data;
}

export async function loginAccount(email: string, password: string) { const response = await fetch(`${API_BASE_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }); const body = (await response.json().catch(() => null)) as { message?: string; accessToken?: string; refreshToken?: string; user?: { fullName?: string; email?: string; role?: string } } | null; if (!response.ok || !body?.accessToken) throw new Error(body?.message ?? "Unable to log in"); return body; }
export async function signupAccount(input: Record<string, unknown>) { const response = await fetch(`${API_BASE_URL}/auth/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }); const body = (await response.json().catch(() => null)) as { message?: string; accessToken?: string; refreshToken?: string; user?: { fullName?: string; email?: string; role?: string } } | null; if (!response.ok || !body?.accessToken) throw new Error(body?.message ?? "Unable to create account"); return body; }
export async function getMyBookings<T = unknown>() { const token = typeof window !== "undefined" ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null; if (!token) return [] as T[]; const response = await fetch(`${API_BASE_URL}/users/me/bookings`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }); const body = (await response.json().catch(() => null)) as { message?: string; data?: T[] } | null; if (!response.ok) throw new Error(body?.message ?? "Unable to load bookings"); return body?.data ?? ([] as T[]); }
export async function submitPaymentProof(bookingId: string, input: { amount: number; method: string; transactionReference: string; file: File; notes?: string }) { const token = typeof window !== "undefined" ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null; if (!token) throw new Error("Please log in before submitting payment proof."); const form = new FormData(); form.append("amount", String(input.amount)); form.append("method", input.method); form.append("transactionReference", input.transactionReference); if (input.notes) form.append("notes", input.notes); form.append("proof", input.file); const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/payment-proof`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form }); const body = (await response.json().catch(() => null)) as { message?: string; data?: unknown } | null; if (!response.ok) throw new Error(body?.message ?? "Unable to submit payment proof"); return body?.data; }
