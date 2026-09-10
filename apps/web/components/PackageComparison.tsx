import { Check } from "lucide-react";

const tiers = [
  { name: "Basic", detail: "A practical starting point", items: ["Hotel", "Breakfast", "Shared or local transport option", "Booking support"] },
  { name: "Standard", detail: "More arranged for the route", items: ["Hotel", "Breakfast and dinner", "Transport", "Guide support", "Better itinerary"] },
  { name: "Premium", detail: "More privacy and planning", items: ["Better hotel level", "Meals", "Private transport", "Guide", "Hiking or activity planning", "Priority support"] },
];

export function PackageComparison() { return <section className="mt-14 border-t border-border pt-10"><div className="max-w-2xl"><div className="eyebrow">COMPARE SERVICE LEVELS</div><h2 className="font-display text-3xl font-bold text-pine md:text-4xl">Choose the level that fits your trip.</h2><p className="mt-3 text-sm leading-6 text-stone">Exact availability and pricing depend on destination, travel dates, and provider confirmation.</p></div><div className="mt-6 grid gap-4 lg:grid-cols-3">{tiers.map((tier) => <article key={tier.name} className="rounded-brand border border-border bg-white p-5"><h3 className="font-display text-xl font-bold text-charcoal">{tier.name}</h3><p className="mt-1 text-xs text-stone">{tier.detail}</p><ul className="mt-5 space-y-3 border-t border-border pt-4">{tier.items.map((item) => <li key={item} className="flex gap-2 text-sm text-stone"><Check size={16} className="mt-0.5 shrink-0 text-river"/>{item}</li>)}</ul></article>)}</div></section>; }
