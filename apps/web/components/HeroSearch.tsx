"use client";

import { FormEvent } from "react";
import { Search } from "lucide-react";
import { CustomSelect } from "./CustomSelect";
import { DatePicker } from "./DatePicker";

export function HeroSearch({ onSearch }: { onSearch: (destination: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSearch(new FormData(event.currentTarget).get("destination")?.toString() || "all"); document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" }); }
  return <form onSubmit={submit} className="relative z-50 grid gap-3 rounded-brand border border-white/60 bg-white p-3 text-charcoal shadow-editorial transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(18,55,42,.18)] sm:grid-cols-2 lg:grid-cols-5 lg:p-4">
    <CustomSelect label="Where to?" name="destination" placeholder="Any destination" options={[{ label: "Any destination", value: "all" }, { label: "Kalam", value: "Kalam" }, { label: "Malam Jabba", value: "Malam Jabba" }, { label: "Bahrain", value: "Bahrain" }, { label: "Madyan", value: "Madyan" }]} />
    <DatePicker />
    <CustomSelect label="Travelers" value="2" options={[{ label: "1 traveler", value: "1" }, { label: "2 travelers", value: "2" }, { label: "3 travelers", value: "3" }, { label: "4+ travelers", value: "4+" }]} />
    <CustomSelect label="Package type" placeholder="Any type" options={[{ label: "Any type", value: "any" }, { label: "Couple", value: "couple" }, { label: "Family", value: "family" }, { label: "Private", value: "private" }]} />
    <button className="button min-h-12 bg-river text-white hover:bg-[#12566d] lg:mt-5"><Search size={17}/> Search packages</button>
  </form>;
}
