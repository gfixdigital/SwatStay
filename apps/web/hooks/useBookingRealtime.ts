"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";

let client: SupabaseClient | null = null;
function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key);
  return client;
}

export function useBookingRealtime(bookingId: string | undefined, onChange: () => void) {
  useEffect(() => {
    const supabase = getClient();
    if (!supabase || !bookingId) return;
    const channel = supabase.channel(`traveler-booking-${bookingId}`);
    const tables = ["Booking", "Payment", "BookingEvent", "ServiceVoucher", "TripChangeRequest"];
    for (const table of tables) channel.on("postgres_changes", { event: "*", schema: "public", table, filter: `${table === "Booking" ? "id" : "bookingId"}=eq.${bookingId}` }, onChange);
    channel.subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [bookingId, onChange]);
}
