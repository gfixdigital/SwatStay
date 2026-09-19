"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Download,
  Hotel,
  MapPin,
  MessageSquare,
  Mountain,
  PhoneCall,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Utensils,
  WalletCards,
  XCircle,
} from "lucide-react";
import {
  DashboardServiceIconKey,
  DashboardServiceItem,
  DashboardTrip,
  mockActiveTrip,
  mockCancelledTrip,
  mockCompletedTrip,
  mockUpcomingTrips,
} from "@/data/dashboardStates";

const serviceIcons: Record<DashboardServiceIconKey, React.ReactNode> = {
  hotel: <Hotel size={18} />,
  transport: <CarFront size={18} />,
  guide: <Mountain size={18} />,
  meals: <Utensils size={18} />,
};

const matrix = ["111111100101011111111", "100000101111010000001", "101110100101010111101", "101110111001010111101", "101110101101010111101", "100000101010010000001", "111111101010111111111", "000000001101000000000", "110111111001011011011", "001010010111100100100", "111101111010111110101", "010001001111001001110", "101110111001111010011", "000000001010001111000", "111111101101111010101", "100000100011001110010", "101110101111101011111", "101110111000011000100", "101110100111110111001", "100000101001011100110", "111111101110101011011"];

type PreviewMode = "NONE" | "ACTIVE" | "MULTIPLE" | "COMPLETED" | "CANCELLED";

const previewTabs: { mode: PreviewMode; label: string }[] = [
  { mode: "NONE", label: "No trip" },
  { mode: "ACTIVE", label: "Active" },
  { mode: "MULTIPLE", label: "Multiple trips" },
  { mode: "COMPLETED", label: "Completed" },
  { mode: "CANCELLED", label: "Cancelled" },
];

export function DashboardView() {
  const [mode, setMode] = useState<PreviewMode>("ACTIVE");
  const [selectedTrip, setSelectedTrip] = useState<DashboardTrip>(mockActiveTrip);

  function openTripAsActive(trip: DashboardTrip) {
    setSelectedTrip(trip);
    setMode("ACTIVE");
  }

  return (
    <>
      {/*
        Preview switcher — frontend-only, for reviewing every dashboard
        state before real trip-status data drives this automatically.
        Replace this block with real status logic when the API is wired
        up; each state below already renders from static data only.
      */}
      <section className="border-b border-dashed border-border bg-[#fbf9f4] py-3">
        <div className="container flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.08em] text-stone">Preview state</span>
          {previewTabs.map((tab) => (
            <button
              key={tab.mode}
              type="button"
              aria-pressed={mode === tab.mode}
              onClick={() => setMode(tab.mode)}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition ${
                mode === tab.mode
                  ? "border-pine bg-pine text-white"
                  : "border-border bg-white text-stone hover:border-river hover:text-river"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-snow py-4">
        <div className="container flex flex-col justify-between gap-3 text-xs text-stone sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-pine">Home</Link>
            <span>›</span>
            <span className="font-medium text-charcoal">Traveler dashboard</span>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-pine">
            <ShieldCheck size={14} /> Protected trip workspace
          </div>
        </div>
      </section>

      {mode === "NONE" && <NoTripState />}
      {mode === "ACTIVE" && <ActiveTripState trip={selectedTrip} />}
      {mode === "MULTIPLE" && <MultipleTripsState trips={mockUpcomingTrips} onSelect={openTripAsActive} />}
      {mode === "COMPLETED" && <CompletedTripState trip={mockCompletedTrip} />}
      {mode === "CANCELLED" && <CancelledTripState trip={mockCancelledTrip} />}
    </>
  );
}

/* ----------------------------- No active trip ---------------------------- */

function NoTripState() {
  return (
    <section className="border-b border-border bg-white py-14 md:py-20">
      <div className="container flex flex-col items-start gap-4 sm:items-center sm:text-center">
        <span className="grid h-12 w-12 place-items-center rounded-brand bg-mist text-pine">
          <Compass size={22} />
        </span>
        <div className="eyebrow">TRAVELER OPERATIONS DESK</div>
        <h1 className="font-display text-3xl font-bold text-pine sm:text-4xl">You do not have an active trip yet</h1>
        <p className="max-w-md text-sm leading-6 text-stone">
          Browse a package or send a custom trip request. Our team will call to confirm details before anything is
          booked.
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Link href="/packages" className="button min-h-11 w-full bg-pine px-4 text-sm text-white hover:bg-[#0e2c22] sm:w-auto">
            Browse packages <ArrowUpRight size={15} />
          </Link>
          <Link href="/custom-trip" className="button min-h-11 w-full border-border bg-white px-4 text-sm text-pine hover:bg-mist sm:w-auto">
            Build a custom trip
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Multiple trips ---------------------------- */

function MultipleTripsState({ trips, onSelect }: { trips: DashboardTrip[]; onSelect: (trip: DashboardTrip) => void }) {
  return (
    <section className="border-b border-border bg-white py-6 md:py-12">
      <div className="container">
        <div className="eyebrow">TRAVELER OPERATIONS DESK</div>
        <h1 className="font-display text-3xl font-bold leading-tight text-pine sm:text-4xl">
          You have {trips.length} upcoming trips
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone">Select a trip to see its live status and service vouchers.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {trips.map((trip) => (
            <button
              key={trip.id}
              type="button"
              onClick={() => onSelect(trip)}
              className="rounded-brand border border-border bg-white p-4 text-left shadow-editorial transition hover:-translate-y-0.5 hover:border-river/50 md:p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-river">{trip.bookingCode} · {trip.tierLabel}</span>
                  <h2 className="mt-1 font-display text-lg font-bold text-charcoal">{trip.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-stone">
                    <MapPin size={13} className="text-river" /> {trip.route}
                  </p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-stone">
                <span>{trip.travelDatesLabel} · {trip.travelersLabel}</span>
                <span className="flex items-center gap-1 font-semibold text-river">View details <ArrowUpRight size={13} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: DashboardTrip["status"] }) {
  const config: Record<DashboardTrip["status"], { label: string; className: string }> = {
    ACTIVE: { label: "Confirmed", className: "border-[#c4d7cb] bg-[#e8efea] text-pine" },
    PAYMENT_PENDING: { label: "Payment pending", className: "border-[#eed7b8] bg-[#faf3e8] text-amber" },
    COMPLETED: { label: "Completed", className: "border-[#c7dbe2] bg-[#ebf3f6] text-river" },
    CANCELLED: { label: "Cancelled", className: "border-border bg-mist text-stone" },
  };
  const { label, className } = config[status];
  return (
    <span className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

/* -------------------------------- Completed -------------------------------- */

function CompletedTripState({ trip }: { trip: DashboardTrip }) {
  return (
    <section className="py-5 md:py-12">
      <div className="container grid gap-4 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
        <div className="space-y-4 md:space-y-6">
          <TripSummaryCard trip={trip} />
          <section className="rounded-brand border border-border bg-white p-4 md:p-6">
            <div className="eyebrow mb-1">SERVICES USED</div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">Trip summary</h2>
            <div className="mt-3 divide-y divide-border sm:mt-5">
              {trip.services.map((service) => (
                <CompletedServiceRow key={service.id} service={service} />
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:space-y-6">
          <section className="rounded-brand border border-border bg-white p-4 shadow-editorial md:p-6">
            <div className="flex items-center gap-2 text-pine">
              <CheckCircle2 size={20} />
              <h2 className="font-display text-lg font-semibold">Trip completed</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-stone">Thank you for traveling with SwatStay.</p>
            <button type="button" className="button mt-4 min-h-10 w-full border-border bg-white px-3 text-xs text-pine hover:bg-mist sm:text-sm">
              <Download size={15} /> Download trip summary
            </button>
            <p className="mt-3 text-xs leading-5 text-stone">
              Verified reviews are collected after a completed trip and shown once moderated.
            </p>
          </section>
          <SupportCard />
        </aside>
      </div>
    </section>
  );
}

function CompletedServiceRow({ service }: { service: DashboardServiceItem }) {
  return (
    <div className="flex items-center justify-between gap-2 py-3 sm:gap-3 sm:py-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-mist text-pine sm:h-10 sm:w-10">
          {serviceIcons[service.iconKey]}
        </span>
        <span className="min-w-0">
          <strong className="block truncate text-xs text-charcoal sm:text-sm">{service.title}</strong>
          <small className="block truncate text-[10px] text-stone sm:text-xs">{service.provider}</small>
        </span>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-1.5 py-1 text-[10px] font-semibold text-pine sm:px-2 sm:text-xs">
        <Check size={11} /> Completed
      </span>
    </div>
  );
}

/* -------------------------------- Cancelled -------------------------------- */

function CancelledTripState({ trip }: { trip: DashboardTrip }) {
  return (
    <section className="py-5 md:py-12">
      <div className="container grid gap-4 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
        <div className="space-y-4 md:space-y-6">
          <TripSummaryCard trip={trip} />
          <section className="rounded-brand border border-border bg-white p-4 md:p-6">
            <div className="flex items-start gap-2">
              <XCircle size={18} className="mt-0.5 shrink-0 text-stone" />
              <div>
                <h2 className="font-display text-lg font-semibold text-charcoal">This trip was cancelled</h2>
                <p className="mt-1 text-sm leading-6 text-stone">{trip.cancelledReason}</p>
              </div>
            </div>
          </section>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:space-y-6">
          <section className="rounded-brand border border-border bg-mist p-4 shadow-editorial md:p-6">
            <h2 className="font-display text-lg font-semibold text-charcoal">Plan another trip</h2>
            <p className="mt-2 text-sm leading-6 text-stone">Browse packages or send a new request whenever you are ready.</p>
            <Link href="/packages" className="button mt-4 min-h-10 w-full bg-pine px-3 text-xs text-white hover:bg-[#0e2c22] sm:text-sm">
              Browse packages <ArrowUpRight size={15} />
            </Link>
          </section>
          <SupportCard />
        </aside>
      </div>
    </section>
  );
}

/* --------------------------- Shared summary card --------------------------- */

function TripSummaryCard({ trip }: { trip: DashboardTrip }) {
  return (
    <section className="rounded-brand border border-border bg-white">
      <div className="flex flex-col justify-between gap-2 border-b border-border p-4 sm:flex-row sm:items-start md:p-6">
        <div>
          <span className="text-[11px] font-semibold text-river">{trip.bookingCode} · {trip.tierLabel}</span>
          <h2 className="mt-1 font-display text-xl font-bold text-charcoal sm:text-2xl">{trip.title}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-stone sm:text-sm">
            <MapPin size={14} className="text-river" /> {trip.route}
          </p>
        </div>
        <StatusBadge status={trip.status} />
      </div>
      <div className="grid grid-cols-3 gap-2 p-4 text-xs sm:gap-4 sm:p-5 sm:text-sm md:p-6">
        <Info label="Travel dates" value={trip.travelDatesLabel} />
        <Info label="Travelers" value={trip.travelersLabel} />
        <Info label="Pickup" value={trip.pickupLabel} />
      </div>
    </section>
  );
}

function SupportCard() {
  return (
    <section className="rounded-brand border border-border bg-white p-4 md:p-5">
      <div className="flex items-center gap-2">
        <PhoneCall size={18} className="text-river" />
        <h2 className="font-display text-lg font-semibold">Need the field team?</h2>
      </div>
      <p className="mt-2 text-sm leading-5 text-stone">Ask about pickup changes, provider arrival, accessibility, or any detail during the trip.</p>
      <a href="mailto:desk@swatstay.pk" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-river">
        Contact support <ArrowUpRight size={15} />
      </a>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Active trip — UNCHANGED from the original DashboardView design.
   Only the data source moved from inline literals to a `trip` prop.
--------------------------------------------------------------------------- */

function ActiveTripState({ trip }: { trip: DashboardTrip }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [services, setServices] = useState<DashboardServiceItem[]>(trip.services);

  function demoCheckIn() {
    setCheckedIn(true);
    setLastUpdated("A few seconds ago");
    setServices((current) => current.map((item) => (item.id === "hotel" ? { ...item, status: "Checked in" } : item)));
  }

  return (
    <>
      <section className="border-b border-border bg-white py-6 md:py-12">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="eyebrow">TRAVELER OPERATIONS DESK</div>
              <h1 className="font-display text-3xl font-bold leading-tight text-pine sm:text-4xl md:text-5xl">Good morning, Ayesha</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone">Your confirmed trip, service vouchers, and live arrival updates in one place.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/packages" className="button min-h-10 border-border bg-white px-3 text-xs text-pine hover:bg-mist sm:text-sm">
                Plan another trip <ArrowUpRight size={15} />
              </Link>
              <button type="button" onClick={() => setLastUpdated("Just now")} className="button min-h-10 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22] sm:text-sm">
                <RefreshCw size={15} /> Refresh
              </button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            <Metric icon={<BadgeCheck />} label="Trip status" value="Confirmed" tone="green" />
            <Metric icon={<CalendarDays />} label="Travel dates" value={trip.travelDatesLabel} />
            <Metric icon={<WalletCards />} label="Payment" value="Advance received" tone="amber" />
            <Metric icon={<MessageSquare />} label="Support desk" value="Available" tone="blue" />
          </div>
        </div>
      </section>
      <section className="py-5 md:py-12">
        <div className="container grid gap-4 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
          <div className="space-y-4 md:space-y-6">
            <TripSummaryCard trip={trip} />
            <section className="rounded-brand border border-border bg-white p-4 md:p-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="eyebrow mb-1">SERVICE VOUCHERS</div>
                  <h2 className="font-display text-xl font-bold sm:text-2xl">Every stop, one live status</h2>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-river">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-river" />Live
                </span>
              </div>
              <div className="mt-3 divide-y divide-border sm:mt-5">
                {services.map((service) => (
                  <ServiceRow key={service.id} service={service} checkedIn={checkedIn} />
                ))}
              </div>
            </section>
            <section className="rounded-brand border border-border bg-white p-4 md:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="eyebrow mb-1">TRIP ACTIVITY</div>
                  <h2 className="font-display text-xl font-bold sm:text-2xl">Coordination timeline</h2>
                </div>
                <span className="text-[11px] text-stone">Updated {lastUpdated}</span>
              </div>
              <div className="mt-4 space-y-4 border-l border-border pl-4 sm:mt-5 sm:space-y-5 sm:pl-5">
                <Timeline title="Booking confirmed" detail="SwatStay confirmed your Kalam package and provider assignments." time="Today · 10:42" done />
                <Timeline title="Advance payment received" detail="Your advance payment has been recorded against SS-2048." time="Yesterday · 16:20" done />
                <Timeline
                  title="Hotel arrival handoff"
                  detail={checkedIn ? "Kalam View Guesthouse marked your arrival at the desk." : "Scan your QR voucher at the hotel desk on arrival."}
                  time={checkedIn ? "Live · checked in" : "12 Oct · 14:00"}
                  done={checkedIn}
                />
              </div>
            </section>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:space-y-6">
            <QrVoucher voucherId={trip.voucherId} checkedIn={checkedIn} onCheckIn={demoCheckIn} />
            <SupportCard />
          </aside>
        </div>
      </section>
    </>
  );
}

function Metric({ icon, label, value, tone = "green" }: { icon: React.ReactNode; label: string; value: string; tone?: "green" | "amber" | "blue" }) {
  const colors = { green: "bg-mist text-pine", amber: "bg-[#faf3e8] text-amber", blue: "bg-[#ebf3f6] text-river" };
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-brand border border-border bg-white p-2.5 sm:gap-3 sm:p-4">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${colors[tone]} [&>svg]:h-4 [&>svg]:w-4 sm:h-9 sm:w-9 sm:[&>svg]:h-5 sm:[&>svg]:w-5`}>{icon}</span>
      <span className="min-w-0">
        <small className="block truncate text-[10px] text-stone sm:text-xs">{label}</small>
        <strong className="block truncate font-display text-xs text-charcoal sm:text-base">{value}</strong>
      </span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <span className="border-l-2 border-mist pl-3">
      <small className="block text-xs text-stone">{label}</small>
      <strong className="mt-1 block text-sm text-charcoal">{value}</strong>
    </span>
  );
}

function ServiceRow({ service, checkedIn }: { service: DashboardServiceItem; checkedIn: boolean }) {
  const status = checkedIn && service.id === "hotel" ? "Checked in" : service.status;
  const done = status === "Checked in" || status === "Ready";
  return (
    <div className="flex items-center justify-between gap-2 py-3 sm:gap-3 sm:py-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md sm:h-10 sm:w-10 ${status === "Pending" ? "bg-[#faf3e8] text-amber" : "bg-mist text-pine"}`}>
          {serviceIcons[service.iconKey]}
        </span>
        <span className="min-w-0">
          <strong className="block truncate text-xs text-charcoal sm:text-sm">{service.title}</strong>
          <small className="block truncate text-[10px] text-stone sm:text-xs">{service.provider} · {service.detail}</small>
        </span>
      </div>
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-1 text-[10px] font-semibold sm:px-2 sm:text-xs ${status === "Pending" ? "border-[#eed7b8] bg-[#faf3e8] text-amber" : "border-[#c4d7cb] bg-[#e8efea] text-pine"}`}>
        {done ? <Check size={11} /> : <Clock3 size={11} />}
        <span className="hidden sm:inline">{status}</span>
        <span className="sm:hidden">{status === "Checked in" ? "In" : status}</span>
      </span>
    </div>
  );
}

function Timeline({ title, detail, time, done }: { title: string; detail: string; time: string; done?: boolean }) {
  return (
    <div className="relative">
      <span className={`absolute -left-[26px] top-0.5 grid h-4 w-4 place-items-center rounded-full border-2 border-white ${done ? "bg-pine" : "bg-border"}`}>
        {done && <Check size={9} className="text-white" />}
      </span>
      <h3 className="text-sm font-semibold text-charcoal">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-stone">{detail}</p>
      <span className="mt-1 block text-[11px] font-semibold text-river">{time}</span>
    </div>
  );
}

function QrVoucher({ voucherId, checkedIn, onCheckIn }: { voucherId: string; checkedIn: boolean; onCheckIn: () => void }) {
  return (
    <section className="rounded-brand border border-border bg-white p-4 shadow-editorial md:p-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="eyebrow mb-1">UNIVERSAL TRIP VOUCHER</div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Scan for service access</h2>
        </div>
        <QrCode size={20} className="shrink-0 text-river" />
      </div>
      <p className="mt-2 text-xs leading-5 text-stone sm:mt-3 sm:text-sm">Show this code to the hotel, driver, guide, or meal provider. Each scan records the service handoff.</p>
      <div className="mx-auto my-4 grid w-fit grid-cols-[repeat(21,minmax(0,1fr))] gap-0.5 border-4 border-white bg-white p-1 shadow-[0_0_0_1px_#D9E2DD] sm:my-6 sm:border-8">
        {matrix.flatMap((row, y) => [...row].map((cell, x) => <span key={`${x}-${y}`} className={`h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 ${cell === "1" ? "bg-charcoal" : "bg-white"}`} />))}
      </div>
      <div className="flex items-center justify-between border-y border-border py-2.5 text-[11px] sm:py-3 sm:text-xs">
        <span className="text-stone">Voucher ID</span>
        <strong className="font-mono text-river">{voucherId}</strong>
      </div>
      {checkedIn ? (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] p-2.5 text-xs font-semibold text-pine sm:mt-4 sm:p-3 sm:text-sm">
          <CheckCircle2 size={16} /> Demo hotel check-in recorded
        </div>
      ) : (
        <button type="button" onClick={onCheckIn} className="button mt-3 min-h-10 w-full bg-pine px-3 text-xs text-white hover:bg-[#0e2c22] sm:mt-4 sm:text-sm">
          <ShieldCheck size={15} /> Simulate hotel scan
        </button>
      )}
      <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 text-[11px] font-semibold text-river sm:text-xs">
        <Download size={14} /> Download trip voucher
      </button>
    </section>
  );
}
