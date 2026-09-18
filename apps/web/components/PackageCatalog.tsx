"use client";

import { useEffect, useState } from "react";
import { PackageFilters } from "./PackageFilters";
import type { TourPackage } from "@/types/package";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

type ApiPackage = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  type?: string;
  tier?: string;
  durationDays: number;
  startingPrice: number;
  imageUrl?: string | null;
  destination?: { name: string; slug: string } | null;
  includedServices?: string[];
  items?: { serviceType: string; title: string; description?: string | null }[];
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85";

function serviceName(value: string): TourPackage["services"][number] {
  const map: Record<string, TourPackage["services"][number]> = {
    HOTEL: "Hotel",
    TRANSPORT: "Transport",
    GUIDE: "Guide",
    HIKING_GUIDE: "Hiking",
    RESTAURANT: "Meals",
  };
  return map[value] ?? "Guide";
}

function mapPackage(item: ApiPackage): TourPackage {
  const services: TourPackage["services"] = (item.includedServices ?? []).map(
    (s) => s as TourPackage["services"][number],
  );
  return {
    slug: item.slug,
    title: item.title,
    destination: item.destination?.name ?? "",
    route: item.destination?.name ?? "",
    duration: `${item.durationDays} days`,
    type: (item.type as TourPackage["type"]) ?? "Private",
    tier: (item.tier as TourPackage["tier"]) ?? "Standard",
    price: item.startingPrice,
    image: item.imageUrl || FALLBACK_IMAGE,
    description: item.description ?? "A call-confirmed Swat tour package with local service arrangements.",
    services: services.length > 0 ? services : (item.items ?? []).map((entry) => serviceName(entry.serviceType)),
    serviceDetails: (item.items ?? []).map((entry) => ({
      service: serviceName(entry.serviceType),
      providerName: "Provider to be confirmed",
      title: entry.title,
      description: entry.description ?? "Details confirmed by the GFix team during the booking call.",
      assignmentStatus: "pending" as const,
    })),
    itinerary: [],
  };
}

export function PackageCatalog() {
  const [items, setItems] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/packages`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Package catalog is unavailable right now.");
        return response.json();
      })
      .then((body: { data: ApiPackage[] }) => setItems(body.data.map(mapPackage)))
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : "Package catalog is unavailable right now."),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="rounded-brand border border-border bg-white p-6 text-sm text-stone">Loading current packages...</div>;
  if (error)
    return <div role="alert" className="rounded-brand border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  return <PackageFilters items={items} />;
}
