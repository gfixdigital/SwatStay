"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function PackageViewTracker({ slug }: { slug: string }) {
  const { addRecentlyViewed } = useRecentlyViewed();
  useEffect(() => { addRecentlyViewed(slug); }, [addRecentlyViewed, slug]);
  return null;
}
