const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function createBooking(input: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  const body = await response.json().catch(() => null) as { message?: string; data?: unknown } | null;
  if (!response.ok) throw new Error(Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? "We could not submit your booking request.");
  return body?.data;
}
