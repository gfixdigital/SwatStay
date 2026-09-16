"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CustomSelect } from "./CustomSelect";
import { PackageCard } from "./PackageCard";
import type { TourPackage } from "@/types/package";

export function PackageFilters({ items }: { items: TourPackage[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [destination, setDestination] = useState("all");
  const [type, setType] = useState("all");
  const requestedDate = searchParams.get("travelDate");
  const requestedTravelers = searchParams.get("travelers");

  useEffect(() => {
    const requestedDestination = searchParams.get("destination") ?? "all";
    const requestedType = searchParams.get("type") ?? "all";
    setDestination(["all", "Kalam", "Malam Jabba", "Bahrain", "Madyan", "Swat"].includes(requestedDestination) ? requestedDestination : "all");
    setType(["all", "Couple", "Family", "Private"].includes(requestedType) ? requestedType : "all");
  }, [searchParams]);

  const filtered = useMemo(() => items.filter((item) => (destination === "all" || item.destination === destination || item.route.includes(destination)) && (type === "all" || item.type === type)), [items, destination, type]);
  const suggestions = useMemo(() => {
    const sameStyle = type === "all" ? [] : items.filter((item) => item.type === type);
    return (sameStyle.length ? sameStyle : items).slice(0, 3);
  }, [items, type]);
  const hasRequest = destination !== "all" || type !== "all" || requestedDate || requestedTravelers;

  return <>
    {hasRequest && <div className="mb-4 flex flex-wrap items-center gap-2 rounded-brand border border-[#bed7df] bg-[#eaf3f6] px-4 py-3 text-sm text-charcoal"><strong>Search request:</strong>{destination !== "all" && <span>{destination}</span>}{type !== "all" && <span>· {type}</span>}{requestedDate && <span>· {new Date(`${requestedDate}T00:00:00`).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span>}{requestedTravelers && <span>· {requestedTravelers} traveler{requestedTravelers === "1" ? "" : "s"}</span>}</div>}
    <div className="mb-8 grid gap-4 rounded-brand border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"><CustomSelect label="Destination" value={destination} onChange={setDestination} options={[{label:"All destinations",value:"all"},{label:"Kalam",value:"Kalam"},{label:"Malam Jabba",value:"Malam Jabba"},{label:"Bahrain",value:"Bahrain"},{label:"Madyan",value:"Madyan"},{label:"Swat",value:"Swat"}]}/><CustomSelect label="Travel style" value={type} onChange={setType} options={[{label:"All travel styles",value:"all"},{label:"Couple",value:"Couple"},{label:"Family",value:"Family"},{label:"Private",value:"Private"}]}/><button type="button" className="mt-auto min-h-11 text-left text-sm font-semibold text-river" onClick={() => { setDestination("all"); setType("all"); router.replace("/packages"); }}>Clear filters</button></div>
    {filtered.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <PackageCard key={item.slug} item={item}/>)}</div> : <section className="rounded-brand border border-dashed border-border bg-white p-5 sm:p-7"><div className="max-w-xl"><h2 className="font-display text-2xl font-bold">No exact package match</h2><p className="mt-2 text-sm leading-6 text-stone">We do not currently have a listed package for that combination. These available options are the closest fit for your travel style.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" className="button border-border bg-white text-pine hover:bg-mist" onClick={() => { setDestination("all"); setType("all"); router.replace("/packages"); }}>Show all packages</button><Link href="/custom-trip" className="button bg-pine text-white hover:bg-[#0e2c22]">Plan a custom trip</Link></div></div><div className="mt-7 grid gap-5 border-t border-border pt-6 md:grid-cols-2 lg:grid-cols-3">{suggestions.map((item) => <PackageCard key={item.slug} item={item}/>)}</div></section>}
  </>;
}
