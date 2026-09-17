import type { TourPackage } from "@/types/package";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type ApiPackage = { id: string; name: string; slug: string; summary?: string | null; durationDays: number; basePrice: number; destination: { name: string; slug: string }; items: { serviceType: string; title: string; description?: string | null }[] };
function serviceName(value: string): TourPackage["services"][number] { return (value === "HIKING_GUIDE" ? "Hiking" : value === "RESTAURANT" ? "Meals" : value.charAt(0) + value.slice(1).toLowerCase()) as TourPackage["services"][number]; }
function mapPackage(item: ApiPackage): TourPackage { const services = item.items.map((entry) => serviceName(entry.serviceType)); return { slug: item.slug, title: item.name, destination: item.destination.name, route: item.destination.name, duration: `${item.durationDays} days`, type: "Private", tier: "Standard", price: item.basePrice, image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85", description: item.summary ?? "A call-confirmed Swat tour package with local service arrangements.", services, serviceDetails: item.items.map((entry) => ({ service: serviceName(entry.serviceType), providerName: "Provider to be confirmed", title: entry.title, description: entry.description ?? "Details confirmed by the GFix team during the booking call.", assignmentStatus: "pending" })), itinerary: [] }; }

export async function getPackage(slug: string) { const response = await fetch(`${API_BASE_URL}/packages/${encodeURIComponent(slug)}`, { cache: "no-store" }); if (!response.ok) return undefined; const body = await response.json() as { data: ApiPackage }; return body.data ? mapPackage(body.data) : undefined; }

export async function createBooking(input: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  const body = await response.json().catch(() => null) as { message?: string; data?: unknown } | null;
  if (!response.ok) throw new Error(Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? "We could not submit your booking request.");
  return body?.data;
}
