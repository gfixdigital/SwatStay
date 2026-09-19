"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Hotel,
  LifeBuoy,
  MapPin,
  MessageCircle,
  MessageSquare,
  Mountain,
  PhoneCall,
  QrCode,
  ReceiptText,
  RefreshCw,
  Route,
  ShieldCheck,
  Upload,
  Utensils,
  WalletCards,
  X,
} from "lucide-react";
import { getPackage } from "@/data/packages";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { createChangeRequest, getMyBookings, submitPaymentProof } from "@/lib/api";
import { useBookingRealtime } from "@/hooks/useBookingRealtime";
import { WeatherPreview } from "@/components/WeatherPreview";

type Service = {
  id: string;
  title: string;
  provider: string;
  detail: string;
  status: "Ready" | "Pending" | "Checked in";
  icon: React.ReactNode;
};

type DashboardTab = "overview" | "services" | "itinerary" | "support";
type DocumentStatus = "Available" | "Pending confirmation" | "Coming after final confirmation";
type PaymentProofStatus = "Proof submitted" | "Updated proof submitted";
type LiveTravelerBooking = { id: string; reference: string; destination?: string; travelStart?: string; travelEnd?: string; travelersCount?: number; pickupCity?: string; status?: string; paymentStatus?: string; totalAmount?: number; amountPaid?: number; paymentMethod?: string | null; package?: { name?: string; basePrice?: number; currency?: string; itinerary?: Array<{ day?: string; title?: string; description?: string }> } | null; payments?: Array<{ amount: number; method: string; status: string }>; items?: Array<{ id: string; serviceType: string; title: string; status: string; provider?: { businessName?: string; location?: string } | null }>; events?: Array<{ eventType: string; createdAt: string; payload?: unknown }>; vouchers?: Array<{ code: string; status: string; expiresAt?: string | null }> };

const dashboardPackage = getPackage("couple-standard-kalam");
const changeTypes = ["Change travel date", "Change pickup city", "Add traveler", "Upgrade package", "Add activity", "Cancel trip", "Other"];
const dashboardTabs: { id: DashboardTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "itinerary", label: "Itinerary" },
  { id: "support", label: "Support" },
];
const documents: { title: string; detail: string; status: DocumentStatus; icon: React.ReactNode }[] = [
  { title: "Booking confirmation", detail: "Reference SS-2048", status: "Available", icon: <FileCheck2 size={18}/> },
  { title: "Payment receipt", detail: "Advance payment record", status: "Available", icon: <ReceiptText size={18}/> },
  { title: "Service voucher", detail: "Provider assignments", status: "Pending confirmation", icon: <QrCode size={18}/> },
  { title: "Trip itinerary", detail: "Confirmed day plan", status: "Coming after final confirmation", icon: <Route size={18}/> },
];

const matrix = ["111111100101011111111", "100000101111010000001", "101110100101010111101", "101110111001010111101", "101110101101010111101", "100000101010010000001", "111111101010111111111", "000000001101000000000", "110111111001011011011", "001010010111100100100", "111101111010111110101", "010001001111001001110", "101110111001111010011", "000000001010001111000", "111111101101111010101", "100000100011001110010", "101110101111101011111", "101110111000011000100", "101110100111110111001", "100000101001011100110", "111111101110101011011"];

export function DashboardView() {
  const { traveler, ready } = useDemoAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [checkedIn, setCheckedIn] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [paymentProofOpen, setPaymentProofOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [paymentProofStatus, setPaymentProofStatus] = useState<PaymentProofStatus>("Proof submitted");
  const [travelerBookings, setTravelerBookings] = useState<LiveTravelerBooking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [realtimeRefresh, setRealtimeRefresh] = useState(0);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [supportStatus, setSupportStatus] = useState("SUP-82 · Meal preference · Open");
  const [lastUpdated, setLastUpdated] = useState("Not refreshed yet");
  const [services, setServices] = useState<Service[]>([
    { id: "hotel", title: "Hotel check-in", provider: "Kalam View Guesthouse", detail: "Arrival desk · 14:00", status: "Ready", icon: <Hotel size={18}/> },
    { id: "transport", title: "Private transport", provider: "Swat Valley 4x4", detail: "Mingora pickup · 08:00", status: "Ready", icon: <CarFront size={18}/> },
    { id: "guide", title: "Ushu Forest guide", provider: "Naveed Khan · Local guide", detail: "Day 2 · 09:30", status: "Pending", icon: <Mountain size={18}/> },
    { id: "meals", title: "Breakfast and dinner", provider: "Kalam View Guesthouse", detail: "Included in stay", status: "Ready", icon: <Utensils size={18}/> },
  ]);
  useEffect(() => { getMyBookings<LiveTravelerBooking>().then((items) => { const list = items ?? []; setTravelerBookings(list); setSelectedBookingId((current) => current || list[0]?.id || ""); const booking = list[0] ?? null; const latest = booking?.payments?.[0]; if (latest) setPaymentProofStatus("Proof submitted"); if (booking?.items?.length) setServices(booking.items.map((item) => ({ id: item.id, title: item.title, provider: item.provider?.businessName ?? "Provider to be confirmed", detail: item.provider?.location ?? item.serviceType.replaceAll("_", " "), status: item.status === "COMPLETED" ? "Checked in" : item.status === "ACCEPTED" ? "Ready" : "Pending", icon: item.serviceType.includes("TRANSPORT") ? <CarFront size={18}/> : item.serviceType.includes("GUIDE") ? <Mountain size={18}/> : item.serviceType.includes("RESTAURANT") ? <Utensils size={18}/> : <Hotel size={18}/> }))); }).catch(() => undefined).finally(() => setLoadingBooking(false)); }, [realtimeRefresh]);
  const liveBooking = travelerBookings.find((booking) => booking.id === selectedBookingId) ?? travelerBookings[0] ?? null;
  const onRealtimeChange = useCallback(() => setRealtimeRefresh((value) => value + 1), []);
  useBookingRealtime(liveBooking?.id, onRealtimeChange);

  if (ready && !traveler) return <NewTravelerDashboard name="Traveler"/>;
  if (ready && traveler && !loadingBooking && !liveBooking) return <NewTravelerDashboard name={traveler.name}/>;

  function demoCheckIn() {
    setCheckedIn(true);
    setLastUpdated("A few seconds ago");
    setServices((current) => current.map((item) => item.id === "hotel" ? { ...item, status: "Checked in" } : item));
  }

  const panelClass = (tab: DashboardTab) => activeTab === tab ? "block" : "hidden md:block";

  return <>
    <section className="border-b border-border bg-snow py-2.5">
      <div className="container flex flex-col justify-between gap-2 text-xs text-stone sm:flex-row sm:items-center">
        <div className="flex items-center gap-2"><Link href="/" className="hover:text-pine">Home</Link><span>›</span><span className="font-medium text-charcoal">Traveler dashboard</span></div>
        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-pine"><ShieldCheck size={14}/> Protected trip workspace</div>
      </div>
    </section>

    <section className="border-b border-border bg-white py-4 md:py-5">
      <div className="container">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div><div className="eyebrow">MY TRIP · {liveBooking?.reference ?? "NO ACTIVE REFERENCE"}</div><h1 className="font-display text-2xl font-bold leading-tight text-pine sm:text-3xl">Welcome back, {traveler?.name.split(" ")[0] || "Traveler"}</h1><p className="mt-1 max-w-2xl text-sm leading-5 text-stone">{liveBooking ? `Your ${liveBooking.destination ?? "Swat"} trip details, payments, provider arrangements, and support requests are in one place.` : "Review your confirmed trip details, payments, provider arrangements, and support requests below."}</p></div>
          <div className="flex flex-wrap items-center gap-2">{travelerBookings.length > 1 && <label className="sr-only" htmlFor="dashboard-booking">Choose trip</label>}{travelerBookings.length > 1 && <select id="dashboard-booking" value={selectedBookingId} onChange={(event) => setSelectedBookingId(event.target.value)} className="field min-h-9 w-auto px-3 text-xs"><option value="">Choose trip</option>{travelerBookings.map((booking) => <option key={booking.id} value={booking.id}>{booking.reference} · {booking.destination}</option>)}</select>}<Link href="/packages" className="button min-h-9 border-border bg-white px-3 text-xs text-pine hover:bg-mist sm:text-sm">Plan another trip <ArrowUpRight size={15}/></Link><button type="button" onClick={() => setLastUpdated("Just now")} className="button min-h-9 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22] sm:text-sm"><RefreshCw size={15}/> Refresh status</button><span className="text-[11px] text-stone">Updated: {lastUpdated}</span></div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4"><Metric icon={<BadgeCheck/>} label="Trip status" value={liveBooking?.status === "ACTIVE" ? "Active" : liveBooking?.status === "COMPLETED" ? "Completed" : "Confirmed"} tone="green"/><Metric icon={<CalendarDays/>} label="Travel dates" value={liveBooking?.travelStart && liveBooking?.travelEnd ? `${new Date(liveBooking.travelStart).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}–${new Date(liveBooking.travelEnd).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}` : "Awaiting confirmation"}/><Metric icon={<WalletCards/>} label="Payment" value={liveBooking?.paymentStatus === "VERIFIED" ? "Verified" : liveBooking?.paymentStatus === "PROOF_SUBMITTED" ? "Proof under review" : "Payment pending"} tone="amber"/><Metric icon={<MessageSquare/>} label="Support desk" value={supportStatus.includes("Open") ? "1 open request" : "No open request"} tone="blue"/></div>
      </div>
    </section>

    <nav className="sticky top-[72px] z-20 border-b border-border bg-snow/95 px-4 py-2 backdrop-blur-sm md:hidden" aria-label="Dashboard sections">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-brand border border-border bg-white p-1" role="tablist">
        {dashboardTabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`min-h-9 rounded-md px-1 text-[11px] font-semibold transition ${activeTab === tab.id ? "bg-pine text-white" : "text-stone hover:bg-mist hover:text-pine"}`}>{tab.label}</button>)}
      </div>
    </nav>

    <section className="py-5 md:py-10">
      <div className="container grid gap-5 lg:grid-cols-[1.3fr_.7fr] lg:items-start">
        <div className="space-y-5">
          <div className={`${panelClass("overview")} space-y-5`} role="tabpanel">
            <TripSummary booking={liveBooking}/>
            <WeatherPreview destination={liveBooking?.destination ?? "Swat"}/>
            <ActivityTimeline checkedIn={checkedIn}/>
            <ItinerarySection booking={liveBooking}/>
            <div className="grid gap-4 xl:grid-cols-2"><CallConfirmation/><PaymentBreakdown proofStatus={paymentProofStatus} onUpload={() => setPaymentProofOpen(true)} totalAmount={liveBooking?.totalAmount ?? liveBooking?.package?.basePrice ?? 48000} amountPaid={liveBooking?.amountPaid ?? liveBooking?.payments?.filter((payment) => payment.status !== "REJECTED" && payment.status !== "REFUNDED").reduce((total, payment) => total + payment.amount, 0) ?? 15000} paymentMethod={liveBooking?.paymentMethod ?? liveBooking?.payments?.[0]?.method ?? "Bank transfer"}/></div>
          </div>

          <div className={`${panelClass("services")} space-y-5`} role="tabpanel">
            <ServiceVouchers services={services} checkedIn={checkedIn} voucher={liveBooking?.vouchers?.[0]}/>
            <DocumentsSection proofStatus={paymentProofStatus}/>
          </div>

          <div className={`${panelClass("itinerary")} space-y-5`} role="tabpanel">
            <p className="rounded-brand border border-border bg-white p-4 text-sm leading-6 text-stone">Your coordination timeline and day-by-day plan are shown at the top of the Overview tab so important trip information is visible first.</p>
          </div>
        </div>

        <aside className={`${panelClass("support")} space-y-4 lg:sticky lg:top-28`} role="tabpanel">
          <section className="rounded-brand border border-border bg-white p-4"><div className="flex items-center gap-2"><QrCode size={18} className="text-river"/><div><h2 className="font-display text-base font-semibold text-charcoal">Service QR voucher</h2><p className="text-xs text-stone">Prototype preview for provider check-in</p></div></div><button type="button" onClick={() => setQrOpen(true)} className="button mt-3 min-h-9 w-full bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]">Show QR voucher <ArrowUpRight size={14}/></button></section>
          <button type="button" onClick={() => setChangeOpen(true)} className="group flex w-full items-center justify-between rounded-brand border border-pine bg-pine p-4 text-left text-white transition hover:-translate-y-0.5 hover:bg-[#0e2c22]"><span><strong className="block font-display text-lg">Request a trip change</strong><small className="mt-1 block text-xs text-[#c3ebd8]">The GFix team will call before changing the booking.</small></span><ArrowUpRight size={18} className="shrink-0"/></button>
          <SupportRequestCard status={supportStatus} onOpen={() => setSupportOpen(true)}/>
          <EmergencySupport/>
        </aside>
      </div>
    </section>

    <ChangeRequestModal bookingId={liveBooking?.id} open={changeOpen} onClose={() => setChangeOpen(false)} onSubmitted={(type) => setSupportStatus(`CHANGE · ${type} · Open`)}/>
    <PaymentProofModal open={paymentProofOpen} bookingId={liveBooking?.id} onClose={() => setPaymentProofOpen(false)} onSubmitted={() => setPaymentProofStatus("Updated proof submitted")}/>
    <SupportRequestModal open={supportOpen} onClose={() => setSupportOpen(false)} onSubmitted={(type) => setSupportStatus(`DEMO-SUPPORT · ${type} · Open`)}/>
    <QrVoucherModal open={qrOpen} checkedIn={checkedIn} onClose={() => setQrOpen(false)} onCheckIn={demoCheckIn}/>
  </>;
}

function NewTravelerDashboard({ name }: { name: string }) {
  const firstName = name.split(" ")[0] || "Traveler";
  return <>
    <section className="border-b border-border bg-snow py-2.5"><div className="container flex items-center justify-between gap-3 text-xs text-stone"><div className="flex items-center gap-2"><Link href="/" className="hover:text-pine">Home</Link><span>›</span><span className="font-medium text-charcoal">Traveler dashboard</span></div><div className="inline-flex items-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.07em] text-pine"><ShieldCheck size={13}/> Traveler workspace</div></div></section>
    <main className="py-6 md:py-9"><div className="container max-w-5xl"><div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end"><div><div className="eyebrow">YOUR TRIPS</div><h1 className="font-display text-2xl font-bold text-pine sm:text-3xl">Welcome, {firstName}</h1><p className="mt-1.5 max-w-xl text-sm leading-5 text-stone">You do not have a booking request yet. Start with a package or tell us what kind of Swat trip you need.</p></div><div className="flex flex-wrap gap-2"><Link href="/packages" className="button bg-pine text-white hover:bg-[#0e2c22]">Browse packages <ArrowUpRight size={15}/></Link><Link href="/custom-trip" className="button border-border bg-white text-pine hover:bg-mist">Plan a custom trip</Link></div></div>
      <section className="mt-5 overflow-hidden rounded-brand border border-border bg-white"><div className="border-b border-border bg-mist px-4 py-3"><h2 className="font-display text-lg font-bold text-charcoal">What happens after you submit a request</h2><p className="mt-1 text-xs text-stone">Nothing is booked or charged automatically.</p></div><div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">{[["1", "Send trip details", "Choose dates, travelers, pickup, and package preferences."], ["2", "Confirm by phone", "GFix calls to check availability, providers, and payment options."], ["3", "Track the booking", "Your confirmed services, itinerary, payments, and support appear here."]].map(([number, title, text]) => <div key={number} className="p-4"><span className="grid h-8 w-8 place-items-center rounded-md bg-pine text-sm font-bold text-white">{number}</span><h3 className="mt-3 text-sm font-bold text-charcoal">{title}</h3><p className="mt-1 text-sm leading-5 text-stone">{text}</p></div>)}</div></section>
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><section className="rounded-brand border border-border bg-white p-4"><h2 className="font-display text-lg font-bold text-charcoal">Saved packages</h2><p className="mt-1 text-sm leading-5 text-stone">Keep useful package options together while you decide.</p><Link href="/saved-packages" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-river">Open saved packages <ArrowUpRight size={14}/></Link></section><section className="rounded-brand border border-border bg-white p-4"><h2 className="font-display text-lg font-bold text-charcoal">Need planning help?</h2><p className="mt-1 text-sm leading-5 text-stone">Ask about routes, family needs, pickup, hotel level, or international travel support.</p><div className="mt-3 flex gap-3"><a href="https://wa.me/92946000000" className="inline-flex items-center gap-1 text-sm font-semibold text-river"><MessageCircle size={14}/> WhatsApp</a><a href="tel:+92946000000" className="inline-flex items-center gap-1 text-sm font-semibold text-river"><PhoneCall size={14}/> Call</a></div></section></div>
    </div></main>
  </>;
}

function TripSummary({ booking }: { booking: LiveTravelerBooking | null }) {
  const destination = booking?.destination ?? "Kalam";
  const start = booking?.travelStart ? new Date(booking.travelStart).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "12 Oct";
  const end = booking?.travelEnd ? new Date(booking.travelEnd).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "14 Oct";
  return <section className="rounded-brand border border-border bg-white">
    <div className="flex flex-col justify-between gap-2 border-b border-border p-4 sm:flex-row sm:items-start md:p-5"><div><span className="text-xs font-semibold text-river">{booking?.reference ?? "SS-2048"} · {booking?.package?.name ?? "COUPLE STANDARD"}</span><h2 className="mt-1 font-display text-xl font-bold text-charcoal sm:text-2xl">{destination} trip</h2><p className="mt-1 flex items-center gap-1 text-sm text-stone"><MapPin size={14} className="text-river"/> {booking?.pickupCity ?? "Mingora"} → {destination}</p></div><span className="inline-flex w-fit items-center gap-1 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-2 py-1 text-xs font-semibold text-pine"><CheckCircle2 size={13}/> {booking?.status === "ACTIVE" ? "Active" : booking?.status === "COMPLETED" ? "Completed" : "Confirmed"}</span></div>
    <div className="grid grid-cols-3 gap-2 p-4 md:p-5"><Info label="Travel dates" value={`${start}–${end}`}/><Info label="Travelers" value={`${booking?.travelersCount ?? 2} people`}/><Info label="Pickup" value={booking?.pickupCity ?? "Mingora"}/></div>
  </section>;
}

function CallConfirmation() {
  return <section className="rounded-brand border border-border bg-white p-4 md:p-5">
    <div className="flex items-start justify-between gap-3"><div><div className="eyebrow mb-1">CALL CONFIRMATION</div><h2 className="font-display text-xl font-bold text-charcoal">Details reviewed by GFix</h2></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-mist text-pine"><PhoneCall size={18}/></span></div>
    <dl className="mt-4 divide-y divide-border text-sm"><DetailRow label="Status" value="Confirmed"/><DetailRow label="Confirmed by" value="GFix Travel Desk"/><DetailRow label="Confirmation date" value="8 Oct 2026 · 4:30 PM"/></dl>
    <div className="mt-4 rounded-md bg-mist p-3"><strong className="text-xs text-pine">Call notes</strong><p className="mt-1 text-sm leading-5 text-stone">Pickup point shared by phone. Hotel room and meal timing will be reconfirmed one day before departure.</p></div>
    <div className="mt-3"><strong className="text-xs text-pine">Tourist preferences</strong><ul className="mt-2 space-y-1.5 text-sm text-stone"><li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-river"/>Quiet room where available</li><li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-river"/>Vegetarian dinner option</li><li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-river"/>No late-night road travel</li></ul></div>
  </section>;
}

function PaymentBreakdown({ proofStatus, onUpload, totalAmount, amountPaid, paymentMethod }: { proofStatus: PaymentProofStatus; onUpload: () => void; totalAmount: number; amountPaid: number; paymentMethod: string }) {
  return <section className="rounded-brand border border-border bg-white p-4 md:p-5">
    <div className="flex items-start justify-between gap-3"><div><div className="eyebrow mb-1">PAYMENT BREAKDOWN</div><h2 className="font-display text-xl font-bold text-charcoal">PKR {totalAmount.toLocaleString()} total</h2></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#faf3e8] text-amber"><Banknote size={18}/></span></div>
    <dl className="mt-4 divide-y divide-border text-sm"><DetailRow label="Amount submitted" value={`PKR ${amountPaid.toLocaleString()}`}/><DetailRow label="Remaining balance" value={`PKR ${Math.max(totalAmount - amountPaid, 0).toLocaleString()}`}/><DetailRow label="Payment method" value={paymentMethod}/><DetailRow label="Payment proof" value={proofStatus}/></dl>
    <div className="mt-4 rounded-md border border-border bg-snow p-3 text-xs leading-5 text-stone"><strong className="block text-sm text-charcoal">Transfer account for this booking</strong><dl className="mt-2 space-y-1"><div className="flex justify-between gap-3"><dt>Account title</dt><dd className="font-semibold text-charcoal">GFix Travel Services</dd></div><div className="flex justify-between gap-3"><dt>Bank</dt><dd className="font-semibold text-charcoal">Demo Bank Pakistan</dd></div><div className="flex justify-between gap-3"><dt>Account number</dt><dd className="font-semibold text-charcoal">0000 2048 4800</dd></div><div className="flex justify-between gap-3"><dt>Reference</dt><dd className="font-semibold text-charcoal">SS-2048</dd></div></dl><p className="mt-2">Use your booking reference as the transfer note. These are placeholder details for the frontend review.</p></div>
    <button type="button" onClick={onUpload} className="button mt-3 min-h-10 w-full border-border bg-white px-3 text-xs text-pine hover:bg-mist"><Upload size={15}/> Upload or update payment proof</button>
    <p className="mt-3 rounded-md border border-[#eed7b8] bg-[#faf3e8] p-3 text-xs leading-5 text-stone">Final balance, bank details, and proof status are confirmed by the GFix team during booking coordination.</p>
  </section>;
}

function ServiceVouchers({ services, checkedIn, voucher }: { services: Service[]; checkedIn: boolean; voucher?: { code: string; status: string } }) {
  return <section className="rounded-brand border border-border bg-white p-4 md:p-5"><div className="flex items-start justify-between gap-2"><div><div className="eyebrow mb-1">SERVICES</div><h2 className="font-display text-xl font-bold sm:text-2xl">Provider arrangements</h2></div><span className={`text-xs ${voucher ? "font-semibold text-pine" : "text-stone"}`}>{voucher ? `Voucher ${voucher.status.toLowerCase()}` : "Voucher pending confirmation"}</span></div>{voucher && <p className="mt-2 rounded-md bg-mist px-3 py-2 text-xs text-stone">Service voucher reference: <strong className="font-mono text-charcoal">{voucher.code}</strong></p>}<div className="mt-3 divide-y divide-border">{services.map((service) => <ServiceRow key={service.id} service={service} checkedIn={checkedIn}/>)}</div></section>;
}

function DocumentsSection({ proofStatus }: { proofStatus: PaymentProofStatus }) {
  const [expanded, setExpanded] = useState(false);
  const visibleDocuments = documents.map((document) => document.title === "Payment receipt" ? { ...document, detail: proofStatus, status: "Pending confirmation" as DocumentStatus } : document);
  const shown = expanded ? visibleDocuments : visibleDocuments.slice(0, 2);
  return <section className="rounded-brand border border-border bg-white p-4 md:p-5"><div className="flex items-start justify-between gap-3"><div><div className="eyebrow mb-1">DOCUMENTS & DOWNLOADS</div><h2 className="font-display text-xl font-bold text-charcoal">Trip files</h2><p className="mt-1 text-sm text-stone">Available files download locally. Pending files require GFix confirmation.</p></div><button type="button" onClick={() => setExpanded((current) => !current)} className="button min-h-8 shrink-0 border-border bg-white px-2.5 text-xs text-pine hover:bg-mist">{expanded ? "Show less" : "Show more"}</button></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{shown.map((document) => <DocumentItem key={document.title} {...document}/>)}</div></section>;
}

function DocumentItem({ title, detail, status, icon }: { title: string; detail: string; status: DocumentStatus; icon: React.ReactNode }) {
  const available = status === "Available";
  function download() {
    const body = title === "Booking confirmation"
      ? "SwatStay booking confirmation\nReference: SS-2048\nPackage: Couple Standard - Kalam\nTravel dates: 12-14 Oct 2026\nStatus: Confirmed\n\nFrontend preview document."
      : `SwatStay ${title}\nReference: SS-2048\n${detail}\n\nFrontend preview document.`;
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replaceAll(" ", "-")}-preview.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return <div className="flex items-start gap-3 rounded-brand border border-border bg-snow p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-river">{icon}</span><div className="min-w-0 flex-1"><strong className="block text-sm text-charcoal">{title}</strong><span className="mt-0.5 block text-xs text-stone">{detail}</span><span className={`mt-2 inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${available ? "border-[#c4d7cb] bg-[#e8efea] text-pine" : "border-border bg-white text-stone"}`}>{status}</span></div>{available && <button type="button" onClick={download} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-river hover:bg-mist" title={`Download ${title}`} aria-label={`Download ${title}`}><Download size={15}/></button>}</div>;
}

function ItinerarySection({ booking }: { booking: LiveTravelerBooking | null }) {
  const itinerary = booking?.package?.itinerary?.length ? booking.package.itinerary : dashboardPackage?.itinerary ?? [];
  return <section className="rounded-brand border border-border bg-white p-4 md:p-5"><div className="flex items-start justify-between gap-3"><div><div className="eyebrow mb-1">DAY-BY-DAY ITINERARY</div><h2 className="font-display text-xl font-bold text-charcoal sm:text-2xl">Your {booking?.destination ?? "Swat"} plan</h2></div><Route size={20} className="shrink-0 text-river"/></div><div className="mt-4 space-y-3">{itinerary.map((item, index) => <article key={`${item.day ?? "day"}-${index}`} className="grid grid-cols-[44px_1fr] gap-3 rounded-brand border border-border bg-snow p-3"><span className="grid h-11 w-11 place-items-center rounded-md bg-pine font-display text-sm font-bold text-white">{index + 1}</span><div><span className="text-xs font-semibold text-river">{item.day ?? `Day ${index + 1}`}</span><h3 className="text-sm font-semibold text-charcoal">{item.title}</h3><p className="mt-1 text-sm leading-5 text-stone">{item.description}</p></div></article>)}</div></section>;
}

function ActivityTimeline({ checkedIn }: { checkedIn: boolean }) {
  return <section className="rounded-brand border border-border bg-white p-4 md:p-5"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div><div className="eyebrow mb-1">TRIP ACTIVITY</div><h2 className="font-display text-xl font-bold">Coordination timeline</h2></div><span className="text-xs text-stone">Static preview</span></div><div className="mt-4 space-y-4 border-l border-border pl-4 sm:pl-5"><Timeline title="Booking confirmed" detail="SwatStay confirmed your Kalam package and provider assignments." time="8 Oct · 4:30 PM" done/><Timeline title="Advance payment received" detail="Your advance payment has been recorded against SS-2048." time="8 Oct · 5:10 PM" done/><Timeline title="Hotel arrival handoff" detail={checkedIn ? "Demo check-in state recorded for this preview." : "The future voucher flow will record hotel arrival here."} time={checkedIn ? "Prototype · checked in" : "12 Oct · 2:00 PM"} done={checkedIn}/></div></section>;
}

function SupportRequestCard({ status, onOpen }: { status: string; onOpen: () => void }) {
  return <section className="rounded-brand border border-border bg-white p-4">
    <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-mist text-river"><LifeBuoy size={18}/></span><div><div className="eyebrow mb-1">BOOKING SUPPORT</div><h2 className="font-display text-lg font-semibold text-charcoal">Request help from GFix</h2></div></div>
    <p className="mt-3 rounded-md bg-snow p-3 text-xs font-semibold leading-5 text-stone">{status}</p>
    <div className="mt-3 grid grid-cols-2 gap-2"><Link href="/dashboard/support" className="button min-h-9 border-border bg-white px-2 text-xs text-pine hover:bg-mist">Support center</Link><button type="button" onClick={onOpen} className="button min-h-9 bg-pine px-2 text-xs text-white hover:bg-[#0e2c22]">New request <ArrowUpRight size={14}/></button></div>
  </section>;
}

function EmergencySupport() {
  return <section className="rounded-brand border border-[#e2c8bf] bg-[#fff8f5] p-4"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-[#9c3f2e]"><AlertTriangle size={18}/></span><div><div className="eyebrow mb-1 text-[#9c3f2e]">EMERGENCY SUPPORT</div><h2 className="font-display text-lg font-semibold text-charcoal">Available during your active trip</h2></div></div><p className="mt-3 text-sm leading-5 text-stone">For urgent pickup, safety, accommodation, or route coordination. Contact local emergency services first for immediate danger.</p><div className="mt-4 grid grid-cols-2 gap-2"><a href="tel:+92946000000" className="button min-h-9 bg-[#9c3f2e] px-2 text-xs text-white hover:bg-[#813326]"><PhoneCall size={14}/> Call support</a><a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="button min-h-9 border-[#e2c8bf] bg-white px-2 text-xs text-[#813326] hover:bg-[#fff1eb]"><MessageCircle size={14}/> WhatsApp</a></div></section>;
}

function PaymentProofModal({ open, bookingId, onClose, onSubmitted }: { open: boolean; bookingId?: string; onClose: () => void; onSubmitted: () => void }) {
  const reduceMotion = useReducedMotion();
  const [method, setMethod] = useState("Bank transfer");
  const [amount, setAmount] = useState("15000");
  const [reference, setReference] = useState("FT-882410");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && closeModal();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function selectFile(file: File | undefined) {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) { setError("Choose a JPG, PNG, or PDF file."); setFileName(""); return; }
    if (file.size > 5 * 1024 * 1024) { setError("The proof file must be 5 MB or smaller."); setFileName(""); return; }
    setError("");
    setFileName(file.name);
    setFile(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fileName) { setError("Choose a payment proof file before submitting."); return; }
    if (!bookingId) { setError("No live booking is linked to this dashboard yet. Log in and open a confirmed booking before submitting proof."); return; }
    setError("");
    if (!file) { setError("Choose a payment proof file before submitting."); return; }
    try { await submitPaymentProof(bookingId, { amount: Number(amount), method, transactionReference: reference, file, notes: "Payment proof submitted by traveler." }); setSubmitted(true); onSubmitted(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to submit payment proof."); }
  }

  function closeModal() {
    onClose();
    window.setTimeout(() => { setSubmitted(false); setFileName(""); setFile(null); setError(""); }, reduceMotion ? 0 : 220);
  }

  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-charcoal/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onMouseDown={(event) => event.target === event.currentTarget && closeModal()}><motion.section role="dialog" aria-modal="true" aria-labelledby="payment-proof-title" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: .98 }} transition={{ duration: reduceMotion ? 0 : .2, ease: "easeOut" }} className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-brand border border-border bg-white p-5 shadow-2xl sm:p-6"><button type="button" onClick={closeModal} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-stone hover:bg-mist hover:text-pine" aria-label="Close payment proof"><X size={19}/></button>{submitted ? <div className="py-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-mist text-pine"><CheckCircle2 size={24}/></span><h2 id="payment-proof-title" className="mt-4 font-display text-2xl font-bold text-charcoal">Payment proof submitted</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone">Your proof is now in the GFix finance review queue.</p><button type="button" onClick={closeModal} className="button mt-6 bg-pine text-white hover:bg-[#0e2c22]">Close</button></div> : <><div className="pr-10"><div className="eyebrow mb-1">PAYMENT REVIEW</div><h2 id="payment-proof-title" className="font-display text-2xl font-bold text-charcoal">Update payment proof</h2><p className="mt-2 text-sm leading-5 text-stone">Add the details GFix needs to match your payment.</p></div><form onSubmit={submit} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Amount paid</span><input type="number" min="1" max="48000" value={amount} onChange={(event) => setAmount(event.target.value)} className="field w-full" required/></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Payment method</span><select value={method} onChange={(event) => setMethod(event.target.value)} className="field w-full" required><option>Bank transfer</option><option>JazzCash</option><option>EasyPaisa</option><option>Cash deposit</option><option>Other</option></select></label></div><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Transaction reference</span><input value={reference} onChange={(event) => setReference(event.target.value)} className="field w-full" placeholder="Bank or wallet reference" required/></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Proof file</span><span className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-brand border border-dashed border-border bg-snow px-4 text-center hover:border-river"><Upload size={20} className="text-river"/><strong className="mt-2 text-sm text-charcoal">{fileName || "Choose receipt or screenshot"}</strong><small className="mt-1 text-xs text-stone">JPG, PNG, or PDF. Maximum 5 MB.</small><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])}/></span></label>{error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<p className="rounded-md bg-mist p-3 text-xs leading-5 text-stone">Your proof is uploaded to a private Supabase Storage bucket and only the GFix finance team can review it.</p><button type="submit" className="button w-full bg-pine text-white hover:bg-[#0e2c22]">Submit proof for review <Upload size={16}/></button></form></>}</motion.section></motion.div>}</AnimatePresence>;
}

function SupportRequestModal({ open, onClose, onSubmitted }: { open: boolean; onClose: () => void; onSubmitted: (type: string) => void }) {
  const reduceMotion = useReducedMotion();
  const [type, setType] = useState("Payment question");
  const [priority, setPriority] = useState("Normal");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && closeModal();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); onSubmitted(type); }
  function closeModal() { onClose(); window.setTimeout(() => { setSubmitted(false); setMessage(""); setPriority("Normal"); }, reduceMotion ? 0 : 220); }

  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-charcoal/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onMouseDown={(event) => event.target === event.currentTarget && closeModal()}><motion.section role="dialog" aria-modal="true" aria-labelledby="support-request-title" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: .98 }} transition={{ duration: reduceMotion ? 0 : .2, ease: "easeOut" }} className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-brand border border-border bg-white p-5 shadow-2xl sm:p-6"><button type="button" onClick={closeModal} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-stone hover:bg-mist hover:text-pine" aria-label="Close support request"><X size={19}/></button>{submitted ? <div className="py-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-mist text-pine"><CheckCircle2 size={24}/></span><h2 id="support-request-title" className="mt-4 font-display text-2xl font-bold text-charcoal">Support request prepared</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone">The request now appears as open in this frontend preview. The future support API will send it to the admin support queue.</p><button type="button" onClick={closeModal} className="button mt-6 bg-pine text-white hover:bg-[#0e2c22]">Close</button></div> : <><div className="pr-10"><div className="eyebrow mb-1">BOOKING SS-2048</div><h2 id="support-request-title" className="font-display text-2xl font-bold text-charcoal">Create support request</h2><p className="mt-2 text-sm leading-5 text-stone">Use this for non-emergency booking help. Call the active-trip desk for an urgent safety issue.</p></div><form onSubmit={submit} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Issue type</span><select value={type} onChange={(event) => setType(event.target.value)} className="field w-full"><option>Payment question</option><option>Pickup timing</option><option>Hotel</option><option>Transport</option><option>Guide</option><option>Meals</option><option>Documents</option><option>Other</option></select></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)} className="field w-full"><option>Normal</option><option>High</option></select></label></div><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">What do you need help with?</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} className="field min-h-28 w-full resize-y py-3" placeholder="Share the details the support team should review" required/></label><button type="submit" className="button w-full bg-pine text-white hover:bg-[#0e2c22]">Submit support request <LifeBuoy size={16}/></button></form></>}</motion.section></motion.div>}</AnimatePresence>;
}

function ChangeRequestModal({ bookingId, open, onClose, onSubmitted }: { bookingId?: string; open: boolean; onClose: () => void; onSubmitted: (type: string) => void }) {
  const reduceMotion = useReducedMotion();
  const [changeType, setChangeType] = useState(changeTypes[0]);
  const [message, setMessage] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bookingId) { setError("No confirmed booking is linked to this dashboard yet."); return; }
    try { setError(""); await createChangeRequest(bookingId, { changeType, message, preferredCallbackAt: callbackTime, priority: "NORMAL" }); setSubmitted(true); onSubmitted(changeType); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to submit trip change request."); }
  }

  function closeModal() {
    onClose();
    window.setTimeout(() => { setSubmitted(false); setMessage(""); setCallbackTime(""); setChangeType(changeTypes[0]); setError(""); }, reduceMotion ? 0 : 220);
  }

  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-charcoal/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onMouseDown={(event) => event.target === event.currentTarget && closeModal()}><motion.section role="dialog" aria-modal="true" aria-labelledby="change-request-title" initial={reduceMotion ? false : { opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: .98 }} transition={{ duration: reduceMotion ? 0 : .2, ease: "easeOut" }} className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-brand border border-border bg-white p-5 shadow-2xl sm:p-6"><button type="button" onClick={closeModal} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-stone hover:bg-mist hover:text-pine" aria-label="Close change request"><X size={19}/></button>{submitted ? <div className="py-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-mist text-pine"><CheckCircle2 size={24}/></span><h2 id="change-request-title" className="mt-4 font-display text-2xl font-bold text-charcoal">Change request received</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone">Our team will call you before updating the booking.</p><button type="button" onClick={closeModal} className="button mt-6 bg-pine text-white hover:bg-[#0e2c22]">Close</button></div> : <><div className="pr-10"><div className="eyebrow mb-1">TRIP CHANGE REQUEST</div><h2 id="change-request-title" className="font-display text-2xl font-bold text-charcoal">Request a trip change</h2><p className="mt-2 text-sm leading-5 text-stone">No booking changes automatically. The GFix team will call to review this request.</p></div><form onSubmit={submitRequest} className="mt-5 space-y-4"><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Change type</span><select value={changeType} onChange={(event) => setChangeType(event.target.value)} className="field w-full" required>{changeTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Message</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} className="field min-h-28 w-full resize-y py-3" placeholder="Explain what you want to change" required/></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-charcoal">Preferred callback time</span><input type="time" value={callbackTime} onChange={(event) => setCallbackTime(event.target.value)} className="field w-full" required/></label>{error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button type="submit" className="button w-full bg-pine text-white hover:bg-[#0e2c22]">Submit change request <ArrowUpRight size={16}/></button></form></>}</motion.section></motion.div>}</AnimatePresence>;
}

function Metric({ icon, label, value, tone = "green" }: { icon: React.ReactNode; label: string; value: string; tone?: "green" | "amber" | "blue" }) {
  const colors = { green: "bg-mist text-pine", amber: "bg-[#faf3e8] text-amber", blue: "bg-[#ebf3f6] text-river" };
  return <div className="flex min-w-0 items-center gap-2 rounded-brand border border-border bg-white p-2.5 sm:gap-3 sm:p-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${colors[tone]} [&>svg]:h-4 [&>svg]:w-4 sm:h-9 sm:w-9 sm:[&>svg]:h-5 sm:[&>svg]:w-5`}>{icon}</span><span className="min-w-0"><small className="block truncate text-[10px] text-stone sm:text-xs">{label}</small><strong className="block truncate font-display text-xs text-charcoal sm:text-base">{value}</strong></span></div>;
}

function DetailRow({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0"><dt className="text-stone">{label}</dt><dd className="text-right font-semibold text-charcoal">{value}</dd></div>; }
function Info({ label, value }: { label: string; value: string }) { return <span className="border-l-2 border-mist pl-3"><small className="block text-xs text-stone">{label}</small><strong className="mt-1 block text-sm text-charcoal">{value}</strong></span>; }
function ServiceRow({ service, checkedIn }: { service: Service; checkedIn: boolean }) { const status = checkedIn && service.id === "hotel" ? "Checked in" : service.status; const done = status === "Checked in" || status === "Ready"; return <div className="flex items-center justify-between gap-2 py-3 sm:gap-3"><div className="flex min-w-0 items-center gap-2 sm:gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${status === "Pending" ? "bg-[#faf3e8] text-amber" : "bg-mist text-pine"}`}>{service.icon}</span><span className="min-w-0"><strong className="block truncate text-sm text-charcoal">{service.title}</strong><small className="block truncate text-xs text-stone">{service.provider} · {service.detail}</small></span></div><span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${status === "Pending" ? "border-[#eed7b8] bg-[#faf3e8] text-amber" : "border-[#c4d7cb] bg-[#e8efea] text-pine"}`}>{done ? <Check size={11}/> : <Clock3 size={11}/>}<span className="hidden sm:inline">{status}</span><span className="sm:hidden">{status === "Checked in" ? "In" : status}</span></span></div>; }
function Timeline({ title, detail, time, done }: { title: string; detail: string; time: string; done?: boolean }) { return <div className="relative"><span className={`absolute -left-[22px] top-0.5 grid h-4 w-4 place-items-center rounded-full border-2 border-white ${done ? "bg-pine" : "bg-border"}`}>{done && <Check size={9} className="text-white"/>}</span><h3 className="text-sm font-semibold text-charcoal">{title}</h3><p className="mt-1 text-sm leading-5 text-stone">{detail}</p><span className="mt-1 block text-xs font-semibold text-river">{time}</span></div>; }

function QrVoucherModal({ open, checkedIn, onClose, onCheckIn }: { open: boolean; checkedIn: boolean; onClose: () => void; onCheckIn: () => void }) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  function downloadVoucher() {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1080;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f7faf8";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#12372a";
    context.fillRect(0, 0, canvas.width, 180);
    context.fillStyle = "#ffffff";
    context.font = "700 48px Georgia, serif";
    context.fillText("SwatStay", 70, 82);
    context.font = "500 22px Arial, sans-serif";
    context.fillStyle = "#c3ebd8";
    context.fillText("FUTURE SERVICE VOUCHER · PROTOTYPE", 70, 128);
    context.fillStyle = "#ffffff";
    context.fillRect(145, 245, 610, 610);
    const cell = 24;
    const qrSize = cell * 21;
    const startX = (canvas.width - qrSize) / 2;
    const startY = 298;
    context.fillStyle = "#202923";
    matrix.forEach((row, y) => [...row].forEach((value, x) => { if (value === "1") context.fillRect(startX + x * cell, startY + y * cell, cell, cell); }));
    context.fillStyle = "#12372a";
    context.font = "700 30px Georgia, serif";
    context.fillText("Kalam Couple Standard", 70, 925);
    context.fillStyle = "#63726a";
    context.font = "500 20px Arial, sans-serif";
    context.fillText("Preview ID: DEMO-2048-KLM", 70, 970);
    context.fillText("Not connected to a scanner or backend", 70, 1010);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "swatstay-voucher-preview.png";
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-charcoal/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.section role="dialog" aria-modal="true" aria-labelledby="qr-voucher-title" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: .98 }} transition={{ duration: reduceMotion ? 0 : .22, ease: "easeOut" }} className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-brand border border-border bg-white p-5 shadow-2xl sm:p-6"><button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-stone transition hover:bg-mist hover:text-pine" aria-label="Close QR voucher"><X size={19}/></button><div className="pr-10"><div className="eyebrow mb-1">PROTOTYPE PREVIEW</div><h2 id="qr-voucher-title" className="font-display text-2xl font-bold text-charcoal">Service QR voucher</h2></div><p className="mt-2 text-sm leading-5 text-stone">A future voucher preview for service handoffs. It is not connected to a scanner or backend.</p><div className="mx-auto my-5 grid w-fit grid-cols-[repeat(21,minmax(0,1fr))] gap-0.5 border-8 border-white bg-white p-1 shadow-[0_0_0_1px_#D9E2DD]">{matrix.flatMap((row, y) => [...row].map((cell, x) => <span key={`${x}-${y}`} className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${cell === "1" ? "bg-charcoal" : "bg-white"}`}/>))}</div><div className="flex items-center justify-between border-y border-border py-3 text-xs"><span className="text-stone">Preview ID</span><strong className="font-mono text-river">DEMO-2048-KLM</strong></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={downloadVoucher} className="button min-h-10 border-border bg-white px-3 text-xs text-pine hover:bg-mist"><Download size={15}/> Download PNG</button>{checkedIn ? <div className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-3 text-xs font-semibold text-pine"><CheckCircle2 size={15}/> Demo checked in</div> : <button type="button" onClick={onCheckIn} className="button min-h-10 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]"><ShieldCheck size={15}/> Preview check-in</button>}</div><p className="mt-3 text-center text-[11px] leading-4 text-stone">Future flow: authorized provider scan → service handoff event → tourist status update.</p></motion.section></motion.div>}</AnimatePresence>;
}
