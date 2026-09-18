import { AlertTriangle, CheckCircle2, FolderKanban, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminTabs } from "../components/AdminTabs";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { ProviderSuggestionCard } from "../components/ProviderSuggestionCard";
import { formatPkr, providerSuggestions, teamMembers } from "../data/adminData";
import { useBookingsPreview } from "../hooks/useBookingsPreview";
import { adminRequest, getAdminToken } from "../lib/adminApi";
import { workflowBlockReason } from "../lib/bookingWorkflow";
import type { ProviderSuggestion, ServiceType } from "../types/admin";

const serviceTypes: ServiceType[] = ["Hotel", "Transport", "Guide", "Restaurant", "Activity"];
const requiredServices: ServiceType[] = ["Hotel", "Transport"];
const apiServiceTypes: Record<ServiceType, string> = { Hotel: "HOTEL", Transport: "TRANSPORT", Guide: "GUIDE", Restaurant: "RESTAURANT", Activity: "ACTIVITY" };
type LiveSuggestionGroup = { serviceType: string; selectedProviderId: string | null; providers: Array<{ id: string; name: string; serviceType: string; location: string; phone: string; commissionRate: number | null; status: string }> };

export function ProviderSuggestionsPage() {
  const { id } = useParams();
  const { bookings, updateBooking } = useBookingsPreview();
  const booking = id ? bookings.find((item) => item.id === id) : undefined;
  const liveMode = Boolean(getAdminToken());
  const [active, setActive] = useState<ServiceType>("Hotel");
  const [selected, setSelected] = useState<Partial<Record<ServiceType, string>>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState<LiveSuggestionGroup[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (!id || !liveMode) return;
    setLoadingSuggestions(true);
    void adminRequest<LiveSuggestionGroup[]>(`/admin/bookings/${id}/provider-suggestions`).then((groups) => {
      setLiveSuggestions(groups);
      setSelected(Object.fromEntries(groups.filter((group) => group.selectedProviderId).map((group) => [serviceLabel(group.serviceType), group.selectedProviderId])) as Partial<Record<ServiceType, string>>);
    }).catch((reason: Error) => setActionMessage(reason.message)).finally(() => setLoadingSuggestions(false));
  }, [id, liveMode]);

  if (!id) return <ProviderAssignmentQueue bookings={bookings}/>;
  if (!booking) return <EmptyState title="Booking not found" text="Open provider suggestions from a booking detail page."/>;

  const currentBooking = booking;
  const blocked = workflowBlockReason(booking, "providers");
  const readyToConfirm = requiredServices.every((type) => Boolean(selected[type]));
  const visible = useMemo(() => {
    if (!liveMode) return providerSuggestions.filter((provider) => provider.serviceType === active);
    return (liveSuggestions.find((group) => serviceLabel(group.serviceType) === active)?.providers ?? []).map((provider): ProviderSuggestion => ({ id: provider.id, name: provider.name, serviceType: active, location: provider.location, capacity: "Provider capacity on file", price: 0, commissionRate: provider.commissionRate ?? 0, availability: "Approved provider, confirm availability", matchScore: 0 }));
  }, [active, liveMode, liveSuggestions]);

  function selectProvider(provider: ProviderSuggestion) {
    setConfirmed(false);
    setActionMessage("");
    setSelected((current) => ({ ...current, [provider.serviceType]: provider.id }));
    if (liveMode) void adminRequest(`/admin/bookings/${currentBooking.id}/provider-assignment`, { method: "PATCH", body: JSON.stringify({ serviceType: apiServiceTypes[provider.serviceType], providerId: provider.id }) }).then(() => setActionMessage(`${provider.serviceType} assignment saved.`)).catch((reason: Error) => setActionMessage(reason.message));
  }

  function confirmAssignment() {
    if (!readyToConfirm) return;
    if (liveMode) {
      void adminRequest(`/admin/bookings/${currentBooking.id}/provider-assignment/confirm`, { method: "POST" }).then(() => { setConfirmed(true); setActionMessage("Provider assignment confirmed. The booking is now waiting for provider confirmation."); }).catch((reason: Error) => setActionMessage(reason.message));
      return;
    }
    const selectedProviders = serviceTypes.map((type) => providerSuggestions.find((provider) => provider.id === selected[type])).filter((provider): provider is typeof providerSuggestions[number] => Boolean(provider));
    setConfirmed(true);
    updateBooking(currentBooking.id, { status: "Active", lastContactAttempt: "Provider assignment confirmed just now", providerArrangements: selectedProviders.map((provider) => ({ serviceType: provider.serviceType, providerId: provider.id, providerName: provider.name, status: "Selected", coordinatorNote: "Provider confirmation still required in the live system." })) });
  }

  return <>
    <PageHeader eyebrow={`${booking.reference} · PROVIDER MATCHING`} title="Provider suggestions" description={`Select providers for ${booking.touristName}'s ${booking.destination} trip after Finance has verified payment.`} actions={<Link to={`/bookings/${booking.id}`} className="button-secondary">Back to booking</Link>}/>
    {actionMessage && <div className="mb-4 rounded-md border border-[#c4d7cb] bg-[#e8f1ec] px-4 py-3 text-sm font-semibold text-pine">{actionMessage}</div>}
    {blocked ? <section className="rounded-lg border border-[#ecd3ad] bg-[#fbf3e6] p-4"><div className="flex gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-[#925d19]" size={18}/><div><h2 className="font-bold text-charcoal">Provider assignment is locked</h2><p className="mt-1 text-sm leading-6 text-stone">{blocked}</p><Link to={`/bookings/${booking.id}`} className="text-link mt-3">Return to booking workflow</Link></div></div></section> : <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="panel"><div className="px-3 pt-2"><AdminTabs value={active} onChange={setActive} tabs={serviceTypes.map((type) => ({ value: type, label: type, count: liveMode ? (liveSuggestions.find((group) => serviceLabel(group.serviceType) === type)?.providers.length ?? 0) : providerSuggestions.filter((item) => item.serviceType === type).length }))}/></div>{loadingSuggestions ? <div className="p-8 text-center text-sm text-stone">Loading approved providers...</div> : <div className="grid gap-3 p-4 lg:grid-cols-2">{visible.length ? visible.map((provider) => <ProviderSuggestionCard key={provider.id} provider={provider} selected={selected[provider.serviceType] === provider.id} onSelect={() => selectProvider(provider)}/>) : <div className="lg:col-span-2"><EmptyState title="No approved providers" text={`There are no approved ${active.toLowerCase()} providers available for this trip yet.`}/></div>}</div>}</section>
      <aside className="panel h-fit xl:sticky xl:top-20"><div className="panel-header"><div><h2 className="panel-title">Provider arrangements</h2><p className="panel-subtitle">Hotel and transport are required. Other services are selected when included in the trip.</p></div></div><div className="divide-y divide-border">{serviceTypes.map((type) => { const selectedId = selected[type]; const provider = liveMode ? liveSuggestions.find((group) => serviceLabel(group.serviceType) === type)?.providers.find((item) => item.id === selectedId) : providerSuggestions.find((item) => item.id === selectedId); return <div key={type} className="p-3"><span className="text-xs font-semibold text-river">{type}{requiredServices.includes(type) ? " · Required" : " · Optional"}</span>{provider ? <><strong className="mt-1 block text-sm text-charcoal">{provider.name}</strong><span className="mt-1 block text-xs text-stone">{liveMode ? "Approved provider · commission set in provider record" : `${formatPkr((provider as ProviderSuggestion).price)} · ${(provider as ProviderSuggestion).commissionRate}% commission`}</span></> : <span className="mt-1 block text-sm text-stone">No provider selected</span>}</div>; })}</div><div className="border-t border-border p-3">{confirmed && <div className="mb-3 flex items-center gap-2 rounded-md bg-[#e8f1ec] p-3 text-sm font-semibold text-pine"><CheckCircle2 size={16}/> Provider assignments are saved. The next step is provider confirmation.</div>}<button type="button" className="button-primary w-full" disabled={!readyToConfirm} onClick={confirmAssignment}>Confirm arrangements</button>{!readyToConfirm && <p className="mt-2 text-center text-xs text-[#925d19]">Select hotel and transport before continuing.</p>}<p className="mt-2 text-center text-xs text-stone">{liveMode ? "Saved to the booking workflow. Providers are not notified until the provider workflow is connected." : "Frontend preview only. Providers are not notified yet."}</p></div></aside>
    </div>}
  </>;
}

function serviceLabel(value: string): ServiceType {
  const labels: Record<string, ServiceType> = { HOTEL: "Hotel", TRANSPORT: "Transport", GUIDE: "Guide", HIKING_GUIDE: "Guide", RESTAURANT: "Restaurant", PHOTOGRAPHY: "Activity", ACTIVITY: "Activity" };
  return labels[value] ?? value as ServiceType;
}

function ProviderAssignmentQueue({ bookings }: { bookings: import("../types/admin").Booking[] }) {
  const [owner, setOwner] = useState("All assigned members");
  const queued = bookings.filter((booking) => booking.status !== "Cancelled" && booking.status !== "Completed" && (owner === "All assigned members" || booking.assignedSupportMember === owner));
  return <><PageHeader eyebrow="STEP 4 · PROVIDER ASSIGNMENT" title="Trip assignment queue" description="Every open trip is listed here. The assigned Operations owner handles provider selection only after the earlier workflow steps are complete."/>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-white p-3"><span className="text-sm text-stone">{queued.length} trip{queued.length === 1 ? "" : "s"} in this assignment queue</span><label className="text-xs font-semibold text-stone">Assigned owner<select value={owner} onChange={(event) => setOwner(event.target.value)} className="field ml-2 w-48 text-sm"><option>All assigned members</option>{teamMembers.map((member) => <option key={member.id}>{member.name}</option>)}</select></label></div><section className="overflow-hidden rounded-lg border border-border bg-white"><div className="grid grid-cols-[1fr_auto] border-b border-border bg-mist px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone"><span>Trip and owner</span><span>Assignment action</span></div><div className="divide-y divide-border">{queued.map((booking) => { const locked = workflowBlockReason(booking, "providers"); const assigned = booking.providerArrangements?.length; return <article key={booking.id} className="grid gap-3 p-4 md:grid-cols-[1fr_190px] md:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-river">{booking.reference}</span><span className="text-xs text-stone">{booking.destination} · {booking.travelStartDate}</span></div><h2 className="mt-1 text-sm font-bold text-charcoal">{booking.touristName} · {booking.packageName}</h2><p className="mt-1 text-xs text-stone">Operations owner: <strong className="text-charcoal">{booking.assignedSupportMember}</strong>{assigned ? ` · ${booking.providerArrangements?.length} arrangement${booking.providerArrangements?.length === 1 ? "" : "s"} saved` : " · No arrangements saved"}</p>{locked && <p className="mt-2 flex items-center gap-1.5 text-xs text-[#925d19]"><LockKeyhole size={13}/>{locked}</p>}</div><div className="flex justify-start md:justify-end">{locked ? <Link to={`/bookings/${booking.id}`} className="button-secondary"><FolderKanban size={15}/> Open workflow</Link> : <Link to={`/bookings/${booking.id}/provider-suggestions`} className="button-primary"><FolderKanban size={15}/>{assigned ? "Review assignment" : "Assign providers"}</Link>}</div></article>; })}</div></section></>;
}
