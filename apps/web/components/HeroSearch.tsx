"use client";

import { FormEvent } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "./CustomSelect";
import { DatePicker } from "./DatePicker";

export function HeroSearch() {
  const router = useRouter();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const destination = form.get("destination")?.toString() ?? "all";
    const travelDate = form.get("travelDate")?.toString();
    const travelers = form.get("travelers")?.toString() ?? "2";
    const packageType = form.get("packageType")?.toString() ?? "all";
    if (destination !== "all") params.set("destination", destination);
    if (travelDate) params.set("travelDate", travelDate.slice(0, 10));
    if (travelers) params.set("travelers", travelers);
    if (packageType !== "all") params.set("type", packageType);
    router.push(`/packages${params.size ? `?${params.toString()}` : ""}`);
  }
  return <form onSubmit={submit} className="relative z-50 grid gap-3 rounded-brand border border-white/60 bg-white p-3 text-charcoal shadow-editorial transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(18,55,42,.18)] sm:grid-cols-2 lg:grid-cols-5 lg:p-4">
    <CustomSelect label="Where to?" name="destination" placeholder="Any destination" options={[{ label: "Any destination", value: "all" }, { label: "Kalam", value: "Kalam" }, { label: "Malam Jabba", value: "Malam Jabba" }, { label: "Bahrain", value: "Bahrain" }, { label: "Madyan", value: "Madyan" }]} />
    <DatePicker />
    <CustomSelect label="Travelers" name="travelers" value="2" options={[{ label: "1 traveler", value: "1" }, { label: "2 travelers", value: "2" }, { label: "3 travelers", value: "3" }, { label: "4+ travelers", value: "4+" }]} />
    <CustomSelect label="Package type" name="packageType" value="all" options={[{ label: "Any type", value: "all" }, { label: "Couple", value: "Couple" }, { label: "Family", value: "Family" }, { label: "Private", value: "Private" }]} />
    <button className="button min-h-12 bg-river text-white hover:bg-[#12566d] lg:mt-5"><Search size={17}/> Search packages</button>
  </form>;
}
