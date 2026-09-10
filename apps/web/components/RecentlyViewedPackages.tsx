"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { packages } from "@/data/packages";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { PackageCard } from "./PackageCard";

export function RecentlyViewedPackages() {
  const { recentSlugs, loaded } = useRecentlyViewed();
  const recentPackages = recentSlugs.map((slug) => packages.find((item) => item.slug === slug)).filter((item): item is (typeof packages)[number] => Boolean(item)).slice(0, 4);
  if (!loaded || recentPackages.length === 0) return null;
  return <section className="section border-t border-border bg-mist"><div className="container"><div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="eyebrow flex items-center gap-2"><Clock3 size={14}/> RECENTLY VIEWED</div><h2 className="font-display text-3xl font-bold text-pine">Continue comparing packages</h2></div><Link href="/packages" className="text-sm font-semibold text-river">View all packages</Link></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recentPackages.map((item) => <PackageCard key={item.slug} item={item}/>)}</div></div></section>;
}
