import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Ban,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  FileClock,
  KeyRound,
  QrCode,
  RefreshCcw,
  ScanLine,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { AdminModal } from "../components/AdminModal";
import { AdminToast } from "../components/AdminToast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { initialVouchers, voucherStorageKey } from "../data/vouchers";
import { useBookingsPreview } from "../hooks/useBookingsPreview";
import { workflowBlockReason } from "../lib/bookingWorkflow";
import type { ServiceType, ServiceVoucher, VoucherEvent, VoucherService } from "../types/admin";

type ModalMode = "none" | "detail" | "qr" | "provider" | "scan" | "generate";

const providerOptions = [
  { id: "p-101", name: "Pine View Hotel Kalam", type: "Hotel" as ServiceType, location: "Kalam" },
  { id: "p-102", name: "Swat River Transport", type: "Transport" as ServiceType, location: "Mingora" },
  { id: "p-guide-1", name: "Ushu Valley Hiking Support", type: "Guide" as ServiceType, location: "Kalam" },
  { id: "p-meal-1", name: "Kalam Family Kitchen", type: "Restaurant" as ServiceType, location: "Kalam" },
  { id: "p-wrong", name: "Bahrain Family Restaurant", type: "Restaurant" as ServiceType, location: "Bahrain" },
];

function nowLabel() {
  return new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date());
}

function createEvent(type: VoucherEvent["type"], actor: string, detail: string): VoucherEvent {
  return { id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, actor, detail, occurredAt: nowLabel() };
}

function readStoredVouchers(): ServiceVoucher[] {
  try {
    const stored = window.localStorage.getItem(voucherStorageKey);
    return stored ? JSON.parse(stored) as ServiceVoucher[] : initialVouchers;
  } catch {
    return initialVouchers;
  }
}

function qrCells(value: string) {
  let seed = [...value].reduce((total, character) => total + character.charCodeAt(0), 0);
  return Array.from({ length: 21 * 21 }, (_, index) => {
    const x = index % 21;
    const y = Math.floor(index / 21);
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    const finderEdge = finder && (x % 14 === 0 || x % 14 === 6 || y % 14 === 0 || y % 14 === 6);
    const finderCore = finder && x % 14 >= 2 && x % 14 <= 4 && y % 14 >= 2 && y % 14 <= 4;
    seed = (seed * 9301 + 49297 + index) % 233280;
    return finderEdge || finderCore || (!finder && seed / 233280 > 0.54);
  });
}

export function VouchersPage() {
  const { id: bookingId } = useParams<{ id?: string }>();
  const { bookings } = useBookingsPreview();
  const [vouchers, setVouchers] = useState<ServiceVoucher[]>(readStoredVouchers);
  const [selectedId, setSelectedId] = useState(initialVouchers[0]?.id ?? "");
  const [modal, setModal] = useState<ModalMode>("none");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [toast, setToast] = useState("");
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const routeBooking = bookingId ? bookings.find((booking) => booking.id === bookingId) : undefined;
  const voucherGate = routeBooking ? workflowBlockReason(routeBooking, "voucher") : null;

  useEffect(() => {
    window.localStorage.setItem(voucherStorageKey, JSON.stringify(vouchers));
  }, [vouchers]);

  const selected = vouchers.find((voucher) => voucher.id === selectedId);
  const visible = useMemo(() => vouchers.filter((voucher) => {
    if (bookingId && voucher.bookingId !== bookingId) return false;
    if (status !== "All statuses" && voucher.status !== status) return false;
    const term = search.trim().toLowerCase();
    return !term || [voucher.code, voucher.bookingReference, voucher.touristName, voucher.packageName].some((value) => value.toLowerCase().includes(term));
  }), [bookingId, search, status, vouchers]);

  function updateVoucher(voucherId: string, update: (voucher: ServiceVoucher) => ServiceVoucher) {
    setVouchers((current) => current.map((voucher) => voucher.id === voucherId ? update(voucher) : voucher));
  }

  function open(voucher: ServiceVoucher, mode: ModalMode) {
    setSelectedId(voucher.id);
    setModal(mode);
  }

  function activate(voucher: ServiceVoucher) {
    updateVoucher(voucher.id, (current) => ({
      ...current,
      status: "Active",
      deliveries: current.deliveries.map((delivery) => ({ ...delivery, status: "Preview prepared", preparedAt: nowLabel() })),
      events: [...current.events, createEvent("Activated", "Asim Khan", "Voucher activated for the travel window."), createEvent("Delivery prepared", "System preview", "Traveler and assigned provider delivery previews prepared.")],
    }));
    setToast("Voucher activated. Dashboard and provider delivery states were prepared in this browser preview.");
  }

  function revoke() {
    if (!selected) return;
    updateVoucher(selected.id, (current) => ({ ...current, status: "Revoked", events: [...current.events, createEvent("Revoked", "Asim Khan", "Voucher revoked from the admin preview.")] }));
    setToast("Voucher revoked in frontend state. Providers can no longer complete simulated scans.");
  }

  const activeCount = vouchers.filter((voucher) => voucher.status === "Active" || voucher.status === "Partially used").length;
  const completedServices = vouchers.flatMap((voucher) => voucher.services).filter((service) => service.status === "Completed").length;
  const preparedDeliveries = vouchers.flatMap((voucher) => voucher.deliveries).filter((delivery) => delivery.status !== "Not prepared").length;

  return <>
    <PageHeader
      eyebrow="SERVICE HANDOFF CONTROL"
      title={bookingId ? `Voucher for ${routeBooking?.reference ?? bookingId}` : "Service vouchers"}
      description="Create, deliver, inspect, and simulate provider scans without a backend. Every action stays in this browser."
      actions={<>{!voucherGate && <button type="button" className="button-primary" onClick={() => setModal("generate")}><QrCode size={16}/>Generate voucher</button>}{bookingId && <Link to={`/bookings/${bookingId}`} className="button-secondary">Back to booking</Link>}</>}
    />

    {voucherGate && <section className="mb-5 rounded-lg border border-[#ecd3ad] bg-[#fbf3e6] p-4 text-sm"><strong className="text-charcoal">Voucher creation is locked.</strong><p className="mt-1 text-stone">{voucherGate}</p><Link to={`/bookings/${bookingId}/provider-suggestions`} className="text-link mt-3">Open provider assignment</Link></section>}

    <section className="mb-5 flex items-start gap-3 rounded-lg border border-[#bed7df] bg-[#eaf3f6] p-4 text-sm text-charcoal">
      <ShieldCheck size={19} className="mt-0.5 shrink-0 text-river"/>
      <div><strong className="block">Frontend workflow preview</strong><p className="mt-1 leading-5 text-stone">No real QR validation, messages, provider access, or database writes happen yet. This screen demonstrates the exact operational flow and stores changes locally.</p></div>
    </section>

    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Summary label="Total vouchers" value={String(vouchers.length)} icon={<QrCode size={18}/>}/>
      <Summary label="Usable now" value={String(activeCount)} icon={<KeyRound size={18}/>}/>
      <Summary label="Completed services" value={String(completedServices)} icon={<CheckCircle2 size={18}/>}/>
      <Summary label="Prepared deliveries" value={String(preparedDeliveries)} icon={<Send size={18}/>}/>
    </div>

    <section className="panel">
      <div className="flex flex-col gap-3 border-b border-border p-3 md:flex-row md:items-center">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-md border border-border bg-snow px-3"><Search size={16} className="text-stone"/><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search voucher, booking, or traveler"/></label>
        <select className="field md:w-48" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{["Draft", "Active", "Partially used", "Completed", "Expired", "Revoked"].map((value) => <option key={value}>{value}</option>)}</select>
      </div>

      {visible.length === 0 ? <div className="p-8 text-center"><QrCode size={28} className="mx-auto text-stone"/><h2 className="mt-3 font-bold text-charcoal">No voucher found</h2><p className="mt-1 text-sm text-stone">Generate a voucher after confirming the booking and assigned services.</p></div> : <div className="divide-y divide-border">{visible.map((voucher) => {
        const done = voucher.services.filter((service) => service.status === "Completed").length;
        return <article key={voucher.id} className="grid gap-3 p-4 lg:grid-cols-[1.1fr_1fr_1fr_auto] lg:items-center">
          <div><div className="flex flex-wrap items-center gap-2"><strong className="font-mono text-sm text-river">{voucher.code}</strong><StatusBadge status={voucher.status}/></div><Link to={`/bookings/${voucher.bookingId}`} className="mt-1 block text-sm font-bold text-charcoal hover:text-river">{voucher.bookingReference} · {voucher.touristName}</Link><p className="mt-1 text-xs text-stone">{voucher.packageName}</p></div>
          <div><span className="text-xs text-stone">Travel window</span><strong className="mt-1 block text-sm text-charcoal">{voucher.travelStartDate} to {voucher.travelEndDate}</strong><span className="mt-1 block text-xs text-stone">Expires {voucher.expiresAt}</span></div>
          <div><span className="text-xs text-stone">Service progress</span><strong className="mt-1 block text-sm text-charcoal">{done} of {voucher.services.length} completed</strong><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full bg-pine" style={{ width: `${voucher.services.length ? done / voucher.services.length * 100 : 0}%` }}/></div></div>
          <div className="flex flex-wrap gap-2 lg:justify-end"><button type="button" className="button-secondary" onClick={() => open(voucher, "qr")}><Eye size={15}/>View QR</button><button type="button" className="button-primary" onClick={() => open(voucher, "detail")}>Manage</button></div>
        </article>;
      })}</div>}
    </section>

    <AdminModal open={modal === "detail" && Boolean(selected)} onClose={() => setModal("none")} title={`${selected?.bookingReference ?? ""} voucher`} description="Manage the frontend voucher lifecycle and inspect every handoff." width="max-w-4xl">
      {selected && <VoucherDetail voucher={selected} onQr={() => setModal("qr")} onProvider={() => setModal("provider")} onScan={() => setModal("scan")} onActivate={() => activate(selected)} onRevoke={() => setConfirmRevoke(true)}/>} 
    </AdminModal>

    <AdminModal open={modal === "qr" && Boolean(selected)} onClose={() => setModal("none")} title="Traveler QR voucher" description="This is the QR preview visible in the traveler dashboard." width="max-w-md">
      {selected && <QrPreview voucher={selected} onViewed={() => updateVoucher(selected.id, (current) => ({ ...current, deliveries: current.deliveries.map((delivery) => delivery.audience === "Traveler" ? { ...delivery, status: "Preview opened" } : delivery), events: current.events.some((event) => event.type === "Viewed") ? current.events : [...current.events, createEvent("Viewed", "Admin preview", "Traveler-facing QR preview opened.")] }))} onToast={setToast}/>} 
    </AdminModal>

    <AdminModal open={modal === "provider" && Boolean(selected)} onClose={() => setModal("none")} title="Provider delivery preview" description="Review the limited trip information each assigned provider will receive." width="max-w-3xl">
      {selected && <ProviderDelivery voucher={selected} onPrepare={() => { updateVoucher(selected.id, (current) => ({ ...current, deliveries: current.deliveries.map((delivery) => delivery.audience === "Provider" ? { ...delivery, status: "Preview opened", preparedAt: nowLabel() } : delivery), events: [...current.events, createEvent("Delivery prepared", "Asim Khan", "Provider assignment packets reviewed in the frontend preview.")] })); setToast("Provider delivery previews marked as reviewed. No real notification was sent."); }}/>} 
    </AdminModal>

    <AdminModal open={modal === "scan" && Boolean(selected)} onClose={() => setModal("none")} title="Simulate provider scan" description="Test accepted and rejected scan results without a scanner or backend." width="max-w-lg">
      {selected && <ScanSimulator voucher={selected} onResult={(serviceId, providerId) => {
        const service = selected.services.find((item) => item.id === serviceId);
        if (!service) return;
        const usable = selected.status === "Active" || selected.status === "Partially used";
        const accepted = usable && service.providerId === providerId && service.status !== "Completed";
        updateVoucher(selected.id, (current) => {
          if (!accepted) return { ...current, events: [...current.events, createEvent("Scan rejected", providerOptions.find((provider) => provider.id === providerId)?.name ?? "Unknown provider", !usable ? `Voucher is ${current.status.toLowerCase()}.` : service.status === "Completed" ? `${service.serviceType} was already completed.` : `Provider is not assigned to ${service.serviceType}.`)] };
          const services = current.services.map((item) => item.id === serviceId ? { ...item, status: "Completed" as const, completedAt: nowLabel() } : item);
          const completeCount = services.filter((item) => item.status === "Completed").length;
          return { ...current, services, status: completeCount === services.length ? "Completed" : "Partially used", events: [...current.events, createEvent("Scan accepted", service.providerName, `${service.serviceType} handoff completed at ${service.location}.`)] };
        });
        setToast(accepted ? `${service.serviceType} handoff completed in the frontend preview.` : "Scan rejected. The reason was added to the voucher audit history.");
        setModal("detail");
      }}/>} 
    </AdminModal>

    <AdminModal open={modal === "generate"} onClose={() => setModal("none")} title="Generate service voucher" description="Create a draft voucher from a confirmed booking and its service assignments." width="max-w-xl">
      <GenerateVoucher existing={vouchers} bookings={bookings} bookingId={bookingId} onCreate={(voucher) => { setVouchers((current) => [voucher, ...current]); setSelectedId(voucher.id); setModal("detail"); setToast("Draft voucher created. Review it before activation and delivery preparation."); }}/>
    </AdminModal>

    <ConfirmDialog open={confirmRevoke} title="Revoke this voucher?" message="The frontend preview will block future simulated scans. Existing service history will remain visible." confirmLabel="Revoke voucher" danger onConfirm={revoke} onClose={() => setConfirmRevoke(false)}/>
    <AdminToast message={toast} onClose={() => setToast("")}/>
  </>;
}

function Summary({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-3"><span className="grid h-10 w-10 place-items-center rounded-md bg-mist text-river">{icon}</span><div><span className="block text-xs text-stone">{label}</span><strong className="text-xl text-charcoal">{value}</strong></div></div>;
}

function VoucherDetail({ voucher, onQr, onProvider, onScan, onActivate, onRevoke }: { voucher: ServiceVoucher; onQr: () => void; onProvider: () => void; onScan: () => void; onActivate: () => void; onRevoke: () => void }) {
  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-snow p-4 sm:flex-row sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><strong className="font-mono text-river">{voucher.code}</strong><StatusBadge status={voucher.status}/></div><p className="mt-1 text-sm text-stone">Created by {voucher.createdBy} · expires {voucher.expiresAt}</p></div><div className="flex flex-wrap gap-2"><button type="button" className="button-secondary" onClick={onQr}><QrCode size={15}/>View user QR</button>{voucher.status === "Draft" && <button type="button" className="button-primary" onClick={onActivate}><ShieldCheck size={15}/>Activate</button>}</div></div>

    <section><div className="mb-2 flex items-end justify-between"><div><h3 className="font-bold text-charcoal">Assigned services</h3><p className="text-xs text-stone">One traveler QR, independently tracked service handoffs.</p></div><button type="button" className="text-link" onClick={onScan}><ScanLine size={15}/>Simulate scan</button></div><div className="grid gap-2 md:grid-cols-2">{voucher.services.map((service) => <div key={service.id} className="rounded-md border border-border p-3"><div className="flex items-start justify-between gap-2"><div><strong className="text-sm text-charcoal">{service.serviceType}</strong><p className="mt-1 text-sm text-stone">{service.providerName}</p></div><StatusBadge status={service.status}/></div><p className="mt-2 text-xs text-stone">{service.scheduledFor} · {service.location}</p>{service.completedAt && <p className="mt-1 text-xs font-semibold text-pine">Completed {service.completedAt}</p>}</div>)}</div></section>

    <section><div className="mb-2 flex items-end justify-between"><div><h3 className="font-bold text-charcoal">Delivery preparation</h3><p className="text-xs text-stone">These states demonstrate delivery only. They do not send messages.</p></div><button type="button" className="text-link" onClick={onProvider}><Send size={15}/>Review provider packet</button></div><div className="divide-y divide-border rounded-md border border-border">{voucher.deliveries.map((delivery) => <div key={delivery.id} className="grid gap-1 p-3 text-sm sm:grid-cols-[100px_1fr_130px_auto] sm:items-center"><strong>{delivery.audience}</strong><span className="truncate text-stone">{delivery.recipient}</span><span className="text-stone">{delivery.channel}</span><StatusBadge status={delivery.status}/></div>)}</div></section>

    <section><h3 className="font-bold text-charcoal">Voucher audit history</h3><div className="mt-3 space-y-4 border-l border-border pl-5">{[...voucher.events].reverse().map((event) => <div key={event.id} className="relative"><span className={`absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full ${event.type === "Scan rejected" || event.type === "Revoked" ? "bg-[#9c3f2e]" : "bg-pine"}`}/><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-charcoal">{event.type}</strong><span className="text-xs text-stone">{event.occurredAt}</span></div><p className="mt-1 text-sm text-stone">{event.detail}</p><span className="mt-1 block text-xs text-stone">Actor: {event.actor}</span></div>)}</div></section>

    <div className="flex justify-end border-t border-border pt-4"><button type="button" className="button-secondary text-[#9c3f2e]" onClick={onRevoke} disabled={voucher.status === "Revoked"}><Ban size={15}/>Revoke voucher</button></div>
  </div>;
}

function QrPreview({ voucher, onViewed, onToast }: { voucher: ServiceVoucher; onViewed: () => void; onToast: (message: string) => void }) {
  const cells = useMemo(() => qrCells(voucher.code), [voucher.code]);
  useEffect(onViewed, []);

  function download() {
    const canvas = document.createElement("canvas");
    canvas.width = 760;
    canvas.height = 920;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#12372A";
    context.font = "700 28px sans-serif";
    context.fillText("SwatStay service voucher", 64, 72);
    context.font = "16px sans-serif";
    context.fillText(`${voucher.bookingReference} · ${voucher.touristName}`, 64, 108);
    const cell = 24;
    const startX = 128;
    const startY = 170;
    cells.forEach((filled, index) => {
      if (!filled) return;
      context.fillRect(startX + index % 21 * cell, startY + Math.floor(index / 21) * cell, cell, cell);
    });
    context.font = "700 22px monospace";
    context.fillText(voucher.code, 64, 740);
    context.font = "16px sans-serif";
    context.fillText(`Valid through ${voucher.expiresAt}`, 64, 780);
    context.fillText("Frontend preview. Not backend verified.", 64, 830);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${voucher.bookingReference}-voucher-preview.png`;
      link.click();
      URL.revokeObjectURL(url);
      onToast("Voucher preview downloaded as PNG.");
    }, "image/png");
  }

  async function copyCode() {
    await navigator.clipboard?.writeText(voucher.code);
    onToast("Voucher reference copied.");
  }

  return <div><div className="rounded-md border border-[#ecd3ad] bg-[#fbf3e6] p-3 text-sm text-[#925d19]">Prototype QR only. It contains a voucher reference and no personal identity information.</div><div className="mx-auto my-5 grid w-fit grid-cols-[repeat(21,9px)] gap-px border-8 border-white bg-white p-1 shadow-[0_0_0_1px_#D9E2DD]">{cells.map((filled, index) => <span key={index} className={`h-[9px] w-[9px] ${filled ? "bg-charcoal" : "bg-white"}`}/>)}</div><div className="rounded-md bg-snow p-3 text-center"><strong className="font-mono text-river">{voucher.code}</strong><p className="mt-1 text-xs text-stone">{voucher.bookingReference} · valid through {voucher.expiresAt}</p></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" className="button-secondary" onClick={copyCode}><Copy size={15}/>Copy reference</button><button type="button" className="button-primary" onClick={download}><Download size={15}/>Download PNG</button></div></div>;
}

function ProviderDelivery({ voucher, onPrepare }: { voucher: ServiceVoucher; onPrepare: () => void }) {
  return <div><div className="mb-4 rounded-md border border-[#bed7df] bg-[#eaf3f6] p-3 text-sm text-stone"><strong className="text-charcoal">Privacy rule:</strong> providers see only the trip and traveler details required for their assigned service. CNIC, passport, payment proof, and unrelated services are excluded.</div><div className="grid gap-3 md:grid-cols-2">{voucher.services.map((service) => <article key={service.id} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between gap-2"><div><span className="text-xs font-bold uppercase text-river">{service.serviceType}</span><h3 className="mt-1 font-bold text-charcoal">{service.providerName}</h3></div><Smartphone size={18} className="text-stone"/></div><dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-sm"><dt className="text-stone">Booking</dt><dd className="font-semibold">{voucher.bookingReference}</dd><dt className="text-stone">Traveler</dt><dd className="font-semibold">{voucher.touristName}</dd><dt className="text-stone">Party size</dt><dd className="font-semibold">2 travelers</dd><dt className="text-stone">Schedule</dt><dd className="font-semibold">{service.scheduledFor}</dd><dt className="text-stone">Location</dt><dd className="font-semibold">{service.location}</dd><dt className="text-stone">Contact</dt><dd className="font-semibold">Available for service coordination</dd></dl></article>)}</div><div className="mt-4 flex justify-end"><button type="button" className="button-primary" onClick={onPrepare}><Eye size={15}/>Mark delivery preview reviewed</button></div></div>;
}

function ScanSimulator({ voucher, onResult }: { voucher: ServiceVoucher; onResult: (serviceId: string, providerId: string) => void }) {
  const ready = voucher.services.find((service) => service.status !== "Completed") ?? voucher.services[0];
  const [serviceId, setServiceId] = useState(ready?.id ?? "");
  const assigned = voucher.services.find((service) => service.id === serviceId);
  const [providerId, setProviderId] = useState(assigned?.providerId ?? "");
  useEffect(() => setProviderId(voucher.services.find((service) => service.id === serviceId)?.providerId ?? ""), [serviceId, voucher.services]);
  return <form onSubmit={(event) => { event.preventDefault(); onResult(serviceId, providerId); }} className="space-y-4"><div className="rounded-md bg-snow p-3 text-sm text-stone"><strong className="text-charcoal">Validation preview:</strong> the provider must match the selected service and the voucher must be active. Choose a different provider to test a rejected scan.</div><label className="block"><span className="label mb-1.5">Service handoff</span><select className="field" value={serviceId} onChange={(event) => setServiceId(event.target.value)}>{voucher.services.map((service) => <option key={service.id} value={service.id}>{service.serviceType} · {service.providerName} · {service.status}</option>)}</select></label><label className="block"><span className="label mb-1.5">Scanning provider</span><select className="field" value={providerId} onChange={(event) => setProviderId(event.target.value)}>{providerOptions.map((provider) => <option key={provider.id} value={provider.id}>{provider.name} · {provider.type}</option>)}</select></label><div className="rounded-md border border-border p-3"><div className="flex items-center gap-2"><ScanLine size={17} className="text-river"/><strong className="text-sm">Scan result will record</strong></div><ul className="mt-2 space-y-1 text-sm text-stone"><li>Provider identity and assigned service</li><li>Accepted or rejected result</li><li>Service status and event time</li><li>Audit history visible to admin</li></ul></div><button type="submit" className="button-primary w-full"><ScanLine size={16}/>Run scan simulation</button></form>;
}

function GenerateVoucher({ existing, bookings, bookingId, onCreate }: { existing: ServiceVoucher[]; bookings: import("../types/admin").Booking[]; bookingId?: string; onCreate: (voucher: ServiceVoucher) => void }) {
  const selectable = bookings.filter((booking) => booking.status === "Active" && !existing.some((voucher) => voucher.bookingId === booking.id && voucher.status !== "Revoked"));
  const [selectedBookingId, setSelectedBookingId] = useState(bookingId && selectable.some((booking) => booking.id === bookingId) ? bookingId : selectable[0]?.id ?? "");
  const [expiresAt, setExpiresAt] = useState("");
  const booking = bookings.find((item) => item.id === selectedBookingId);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!booking || !expiresAt) return;
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const services: VoucherService[] = providerOptions.slice(0, 4).map((provider, index) => ({ id: `svc-${Date.now()}-${index}`, serviceType: provider.type, providerId: provider.id, providerName: provider.name, scheduledFor: index === 0 ? `${booking.travelStartDate}, 2:00 PM` : `${booking.travelStartDate}, time to confirm`, location: provider.location, status: "Ready" }));
    onCreate({
      id: `voucher-${Date.now()}`,
      code: `SV-${booking.reference.replace("SS-", "")}-${suffix}`,
      bookingId: booking.id,
      bookingReference: booking.reference,
      touristName: booking.touristName,
      touristPhone: booking.phone,
      packageName: booking.packageName,
      travelStartDate: booking.travelStartDate,
      travelEndDate: booking.travelEndDate,
      status: "Draft",
      createdAt: nowLabel(),
      createdBy: "Asim Khan",
      expiresAt,
      services,
      deliveries: [
        { id: `delivery-traveler-${Date.now()}`, audience: "Traveler", recipient: booking.touristName, channel: "Dashboard", status: "Not prepared" },
        ...services.map((service, index) => ({ id: `delivery-provider-${Date.now()}-${index}`, audience: "Provider" as const, recipient: service.providerName, channel: "Provider panel" as const, status: "Not prepared" as const })),
      ],
      events: [createEvent("Created", "Asim Khan", "Draft voucher created from confirmed booking and assigned service preview.")],
    });
  }

  if (!selectable.length) return <div className="py-6 text-center"><CheckCircle2 size={28} className="mx-auto text-pine"/><h3 className="mt-3 font-bold">No booking is ready for a voucher</h3><p className="mt-1 text-sm text-stone">A booking must have a confirmed provider assignment and active-trip status before its voucher can be created.</p></div>;

  return <form onSubmit={submit} className="space-y-4"><label className="block"><span className="label mb-1.5">Booking</span><select className="field" value={selectedBookingId} onChange={(event) => setSelectedBookingId(event.target.value)} required>{selectable.map((item) => <option key={item.id} value={item.id}>{item.reference} · {item.touristName} · {item.packageName}</option>)}</select></label><label className="block"><span className="label mb-1.5">Voucher expiry</span><input type="date" className="field" min={booking?.travelEndDate} value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} required/><span className="mt-1 block text-xs text-stone">Set this after the final service day.</span></label>{booking && <div className="rounded-md border border-border bg-snow p-3"><div className="flex items-center gap-2"><UserRound size={16} className="text-river"/><strong className="text-sm">{booking.touristName}</strong></div><p className="mt-2 text-sm text-stone">{booking.travelStartDate} to {booking.travelEndDate} · {booking.travelers} travelers · {booking.pickupCity}</p><p className="mt-1 text-xs text-stone">Four sample service assignments will be added for review. Nothing is delivered until activation.</p></div>}<button type="submit" className="button-primary w-full" disabled={!booking}><QrCode size={16}/>Create draft voucher</button></form>;
}
