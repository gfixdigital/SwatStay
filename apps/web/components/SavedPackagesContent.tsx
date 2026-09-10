"use client";

import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { packages } from "@/data/packages";
import { useSavedPackages } from "@/hooks/useSavedPackages";
import { PackageCard } from "./PackageCard";
import { Skeleton } from "./Skeleton";

export function SavedPackagesContent() {
  const { savedSlugs, loaded } = useSavedPackages();
  const savedPackages = savedSlugs.map((slug) => packages.find((item) => item.slug === slug)).filter((item): item is (typeof packages)[number] => Boolean(item));
  return <div className="container"><div className="max-w-2xl"><div className="eyebrow">SAVED ON THIS DEVICE</div><h1 className="font-display text-4xl font-bold text-pine md:text-5xl">Saved packages</h1><p className="mt-4 text-sm leading-6 text-stone">Keep a short list while you compare routes. Saved packages remain in this browser and do not require an account.</p></div>{!loaded ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map((item) => <Skeleton key={item} className="h-96"/>)}</div> : savedPackages.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{savedPackages.map((item) => <PackageCard key={item.slug} item={item}/>)}</div> : <div className="mt-10 flex min-h-64 flex-col items-center justify-center rounded-brand border border-dashed border-border bg-white p-8 text-center"><span className="grid h-12 w-12 place-items-center rounded-brand bg-mist text-river"><Bookmark size={23}/></span><h2 className="mt-4 font-display text-2xl font-bold text-pine">No saved packages yet</h2><p className="mt-2 max-w-md text-sm leading-6 text-stone">Use the save button on a package card or package detail page to keep it here.</p><Link href="/packages" className="button mt-5 bg-pine text-white hover:bg-[#0e2c22]"><Search size={16}/>Browse packages</Link></div>}</div>;
}
