"use client";

import { useEffect, useState } from "react";

export type PreviewTraveler = { name: string; email: string; hasDemoTrip: boolean };
const AUTH_KEY = "swatstay.auth.preview";
const AUTH_EVENT = "swatstay-auth-change";

function readTraveler(): PreviewTraveler | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(AUTH_KEY);
    return value ? JSON.parse(value) as PreviewTraveler : null;
  } catch {
    return null;
  }
}

export function useDemoAuth() {
  const [traveler, setTravelerState] = useState<PreviewTraveler | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => { setTravelerState(readTraveler()); setReady(true); };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_EVENT, sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(AUTH_EVENT, sync); };
  }, []);

  function setTraveler(next: PreviewTraveler) {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(AUTH_EVENT));
  }

  function signOut() {
    window.localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }

  return { traveler, ready, setTraveler, signOut };
}
