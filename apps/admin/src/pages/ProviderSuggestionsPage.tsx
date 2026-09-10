import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminTabs } from "../components/AdminTabs";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { ProviderSuggestionCard } from "../components/ProviderSuggestionCard";
import { bookings, formatPkr, providerSuggestions } from "../data/adminData";
import type { ServiceType } from "../types/admin";

export function ProviderSuggestionsPage() {
  const { id } = useParams();
  const booking = bookings.find((item) => item.id === id);
  const serviceTypes: ServiceType[] = ["Hotel", "Transport", "Guide", "Restaurant", "Activity"];
  const [active, setActive] = useState<ServiceType>("Hotel");
  const [selected, setSelected] = useState<Partial<Record<ServiceType, string>>>({});
  const [confirmed, setConfirmed] = useState(false);
  const visible = useMemo(() => providerSuggestions.filter((provider) => provider.serviceType === active), [active]);
  if (!booking) return <EmptyState title="Booking not found" text="Open provider suggestions from a booking detail page."/>;
  const selectedProviders = serviceTypes.map((type) => providerSuggestions.find((provider) => provider.id === selected[type])).filter(Boolean);
  return <><PageHeader eyebrow={`${booking.reference} · PROVIDER MATCHING`} title="Provider suggestions" description={`Select one provider per service type for ${booking.touristName}'s ${booking.destination} trip.`} actions={<Link to={`/bookings/${booking.id}`} className="button-secondary">Back to booking</Link>}/><div className="grid gap-5 xl:grid-cols-[1fr_340px]"><section className="panel"><div className="px-3 pt-2"><AdminTabs value={active} onChange={setActive} tabs={serviceTypes.map((type) => ({ value: type, label: type, count: providerSuggestions.filter((item) => item.serviceType === type).length }))}/></div><div className="grid gap-3 p-4 lg:grid-cols-2">{visible.map((provider) => <ProviderSuggestionCard key={provider.id} provider={provider} selected={selected[provider.serviceType] === provider.id} onSelect={() => { setConfirmed(false); setSelected((current) => ({ ...current, [provider.serviceType]: provider.id })); }}/>)}</div></section><aside className="panel h-fit xl:sticky xl:top-20"><div className="panel-header"><div><h2 className="panel-title">Final assignment</h2><p className="panel-subtitle">One provider per selected service</p></div></div><div className="divide-y divide-border">{serviceTypes.map((type) => { const provider = providerSuggestions.find((item) => item.id === selected[type]); return <div key={type} className="p-3"><span className="text-xs font-semibold text-river">{type}</span>{provider ? <><strong className="mt-1 block text-sm text-charcoal">{provider.name}</strong><span className="mt-1 block text-xs text-stone">{formatPkr(provider.price)} · {provider.commissionRate}% commission</span></> : <span className="mt-1 block text-sm text-stone">No provider selected</span>}</div>; })}</div><div className="border-t border-border p-3">{confirmed && <div className="mb-3 flex items-center gap-2 rounded-md bg-[#e8f1ec] p-3 text-sm font-semibold text-pine"><CheckCircle2 size={16}/> Assignment confirmed in frontend state</div>}<button type="button" className="button-primary w-full" disabled={!selectedProviders.length} onClick={() => setConfirmed(true)}>Confirm assignment</button><p className="mt-2 text-center text-xs text-stone">No provider is notified in this static preview.</p></div></aside></div></>;
}
