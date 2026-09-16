import { useEffect, useState } from "react";
import { bookings as initialBookings } from "../data/adminData";
import type { Booking } from "../types/admin";

const storageKey = "swatstay.admin.bookings.preview";

function readBookings() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) as Booking[] : initialBookings;
  } catch {
    return initialBookings;
  }
}

export function useBookingsPreview() {
  const [bookings, setBookings] = useState<Booking[]>(readBookings);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(bookings));
  }, [bookings]);

  function updateBooking(id: string, update: Partial<Booking> | ((booking: Booking) => Booking)) {
    setBookings((current) => current.map((booking) => {
      if (booking.id !== id) return booking;
      return typeof update === "function" ? update(booking) : { ...booking, ...update };
    }));
  }

  return { bookings, updateBooking };
}
