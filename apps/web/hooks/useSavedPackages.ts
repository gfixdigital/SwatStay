"use client";

import { useCallback, useEffect, useState } from "react";

export const SAVED_PACKAGES_KEY = "swatstay-saved-packages";
const SAVED_PACKAGES_EVENT = "swatstay:saved-packages";

function readSavedPackages() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(SAVED_PACKAGES_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((slug): slug is string => typeof slug === "string") : [];
  } catch {
    return [];
  }
}

export function useSavedPackages() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => { setSavedSlugs(readSavedPackages()); setLoaded(true); };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(SAVED_PACKAGES_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SAVED_PACKAGES_EVENT, sync);
    };
  }, []);

  const toggleSaved = useCallback((slug: string) => {
    const current = readSavedPackages();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current];
    window.localStorage.setItem(SAVED_PACKAGES_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(SAVED_PACKAGES_EVENT));
  }, []);

  return { savedSlugs, loaded, isSaved: (slug: string) => savedSlugs.includes(slug), toggleSaved };
}
