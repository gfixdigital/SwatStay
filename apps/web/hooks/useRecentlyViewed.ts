"use client";

import { useCallback, useEffect, useState } from "react";

export const RECENTLY_VIEWED_KEY = "swatstay-recently-viewed";
const RECENTLY_VIEWED_EVENT = "swatstay:recently-viewed";
const RECENTLY_VIEWED_LIMIT = 6;

function readRecentlyViewed() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((slug): slug is string => typeof slug === "string").slice(0, RECENTLY_VIEWED_LIMIT) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => { setRecentSlugs(readRecentlyViewed()); setLoaded(true); };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(RECENTLY_VIEWED_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(RECENTLY_VIEWED_EVENT, sync);
    };
  }, []);

  const addRecentlyViewed = useCallback((slug: string) => {
    const next = [slug, ...readRecentlyViewed().filter((item) => item !== slug)].slice(0, RECENTLY_VIEWED_LIMIT);
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(RECENTLY_VIEWED_EVENT));
  }, []);

  return { recentSlugs, loaded, addRecentlyViewed };
}
