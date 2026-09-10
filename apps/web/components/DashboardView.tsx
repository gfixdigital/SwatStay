"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2, Clock3, Hotel, MapPin, MessageSquare, Mountain, PhoneCall, QrCode, RefreshCw, ShieldCheck, Utensils, WalletCards } from "lucide-react";

type Service = { id: string; title: string; provider: string; detail: string; status: "Ready" | "Pending" | "Checked in"; icon: React.ReactNode };

const matrix = ["111111100101011111111", "100000101111010000001", "101110100101010111101", "101110111001010111101", "101110101101010111101", "100000101010010000001", "111111101010111111111", "000000001101000000000", "110111111001011011011", "001010010111100100100", "111101111010111110101", "010001001111001001110", "101110111001111010011", "000000001010001111000", "111111101101111010101", "100000100011001110010", "101110101111101011111", "101110111000011000100", "101110100111110111001", "100000101001011100110", "111111101110101011011"];

export function DashboardView() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [services, setServices] = useState<Service[]>([
    { id: "hotel", title: "Hotel check-in", provider: "Kalam View Guesthouse", detail: "Arrival desk · 14:00", status: "Ready", icon: <Hotel size={17}/> },
    { id: "transport", title: "Private transport", provider: "Swat Valley 4x4", detail: "Mingora pickup · 08:00", status: "Ready", icon: <CarFront size={17}/> },
    { id: "guide", title: "Ushu Forest guide", provider: "Naveed Khan · Local guide", detail: "Day 2 · 09:30", status: "Pending", icon: <Mountain size={17}/> },
    { id: "meals", title: "Breakfast and dinner", provider: "Kalam View Guesthouse", detail: "Included in stay", status: "Ready", icon: <Utensils size={17}/> },
  ]);

  function demoCheckIn() {
    setCheckedIn(true);
    setLastUpdated("A few seconds ago");
    setServices((current) => current.map((item) => item.id === "hotel" ? { ...item, status: "Checked in" } : item));
  }

  return <>
    <section className="border-b border-border bg-snow py-3"><div className="container flex flex-col justify-between gap-2 text-xs text-stone sm:flex-row sm:items-center"><div className="flex items-center gap-2"><Link href="/" className="hover:text-pine">Home</Link><span>›</span><span className="font-medium text-charcoal">Traveler dashboard</span></div><div className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.06em] text-pine"><ShieldCheck size={13}/> Prototype trip workspace</div></div></section>

    <section className="border-b border-border bg-white py-5 md:py-7"><div className="container"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><div className="eyebrow mb-1">TRAVELER OPERATIONS DESK</div><h1 className="font-display text-3xl font-bold leading-tight text-pine md:text-4xl">Good morning, Ayesha</h1><p className="mt-1.5 max-w-xl text-sm leading-5 text-stone">Your confirmed trip, service voucher preview, and coordination details in one place.</p></div><div className="flex flex-wrap gap-2"><Link href="/packages" className="button min-h-9 border-border bg-white px-3 text-xs text-pine hover:bg-mist">Plan another trip <ArrowUpRight size={14}/></Link><button type="button" onClick={() => setLastUpdated("Just now")} className="button min-h-9 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]"><RefreshCw size={14}/> Refresh</button></div></div><div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4"><Metric icon={<BadgeCheck/>} label="Trip status" value="Confirmed" tone="green"/><Metric icon={<CalendarDays/>} label="Travel dates" value="12–14 Oct 2026"/><Metric icon={<WalletCards/>} label="Payment" value="Advance received" tone="amber"/><Metric icon={<MessageSquare/>} label="Support options" value="Call or WhatsApp" tone="blue"/></div></div></section>

    <section className="py-5 md:py-8"><div className="container grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start"><div className="space-y-4"><section className="rounded-brand border border-border bg-white"><div className="flex flex-col justify-between gap-2 border-b border-border p-4 sm:flex-row sm:items-start"><div><span className="text-[11px] font-semibold text-river">SS-2048 · COUPLE STANDARD</span><h2 className="mt-1 font-display text-xl font-bold text-charcoal">Kalam, 3 days</h2><p className="mt-1 flex items-center gap-1 text-xs text-stone"><MapPin size={13} className="text-river"/> Mingora → Kalam → Ushu Forest</p></div><span className="inline-flex w-fit items-center gap-1 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-2 py-1 text-[11px] font-semibold text-pine"><CheckCircle2 size={13}/> Confirmed</span></div><div className="grid grid-cols-3 gap-2 p-4 text-xs"><Info label="Travel dates" value="12–14 Oct"/><Info label="Travelers" value="2 people"/><Info label="Pickup" value="Mingora · 08:00"/></div></section>

      <section className="rounded-brand border border-border bg-white p-4"><div className="flex items-start justify-between gap-2"><div><div className="eyebrow mb-1">SERVICE VOUCHERS</div><h2 className="font-display text-xl font-bold">Recorded service status</h2></div><span className="text-[10px] text-stone">Prototype</span></div><div className="mt-3 divide-y divide-border">{services.map((service) => <ServiceRow key={service.id} service={service} checkedIn={checkedIn}/>)}</div></section>

      <section className="rounded-brand border border-border bg-white p-4"><div className="flex items-center justify-between gap-2"><div><div className="eyebrow mb-1">TRIP ACTIVITY</div><h2 className="font-display text-xl font-bold">Coordination timeline</h2></div><span className="text-[10px] text-stone">{lastUpdated}</span></div><div className="mt-4 space-y-4 border-l border-border pl-4"><Timeline title="Booking confirmed" detail="SwatStay confirmed your Kalam package and provider assignments." time="Today · 10:42" done/><Timeline title="Advance payment received" detail="Your advance payment has been recorded against SS-2048." time="Yesterday · 16:20" done/><Timeline title="Hotel arrival handoff" detail={checkedIn ? "Demo check-in state recorded for this preview." : "The future voucher flow will record hotel arrival here."} time={checkedIn ? "Prototype · checked in" : "12 Oct · 14:00"} done={checkedIn}/></div></section></div>

      <aside className="space-y-4 lg:sticky lg:top-24"><QrVoucher checkedIn={checkedIn} onCheckIn={demoCheckIn}/><section className="rounded-brand border border-border bg-mist p-4"><div className="flex items-center gap-2"><PhoneCall size={17} className="text-river"/><h2 className="font-display text-base font-semibold">Need the field team?</h2></div><p className="mt-1.5 text-xs leading-5 text-stone">Ask about pickup changes, provider arrival, accessibility, or trip details.</p><a href="mailto:desk@swatstay.pk" className="mt-2.5 inline-flex items-center gap-2 text-xs font-semibold text-river">Contact support <ArrowUpRight size={14}/></a></section></aside></div></section>
  </>;
}

function Metric({ icon, label, value, tone = "green" }: { icon: React.ReactNode; label: string; value: string; tone?: "green" | "amber" | "blue" }) {
  const colors = { green: "bg-mist text-pine", amber: "bg-[#faf3e8] text-amber", blue: "bg-[#ebf3f6] text-river" };
  return <div className="flex min-w-0 items-center gap-2 rounded-brand border border-border bg-white p-2.5"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${colors[tone]} [&>svg]:h-4 [&>svg]:w-4`}>{icon}</span><span className="min-w-0"><small className="block truncate text-[10px] text-stone">{label}</small><strong className="block truncate font-display text-xs text-charcoal sm:text-sm">{value}</strong></span></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <span className="border-l-2 border-mist pl-2.5"><small className="block text-[10px] text-stone sm:text-xs">{label}</small><strong className="mt-0.5 block text-xs text-charcoal sm:text-sm">{value}</strong></span>;
}

function ServiceRow({ service, checkedIn }: { service: Service; checkedIn: boolean }) {
  const status = checkedIn && service.id === "hotel" ? "Checked in" : service.status;
  const done = status === "Checked in" || status === "Ready";
  return <div className="flex items-center justify-between gap-2 py-3"><div className="flex min-w-0 items-center gap-2.5"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${status === "Pending" ? "bg-[#faf3e8] text-amber" : "bg-mist text-pine"}`}>{service.icon}</span><span className="min-w-0"><strong className="block truncate text-xs text-charcoal sm:text-sm">{service.title}</strong><small className="block truncate text-[10px] text-stone sm:text-xs">{service.provider} · {service.detail}</small></span></div><span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-1 text-[10px] font-semibold ${status === "Pending" ? "border-[#eed7b8] bg-[#faf3e8] text-amber" : "border-[#c4d7cb] bg-[#e8efea] text-pine"}`}>{done ? <Check size={11}/> : <Clock3 size={11}/>}<span className="hidden sm:inline">{status}</span></span></div>;
}

function Timeline({ title, detail, time, done }: { title: string; detail: string; time: string; done?: boolean }) {
  return <div className="relative"><span className={`absolute -left-[23px] top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-white ${done ? "bg-pine" : "bg-border"}`}>{done && <Check size={8} className="text-white"/>}</span><h3 className="text-xs font-semibold text-charcoal sm:text-sm">{title}</h3><p className="mt-0.5 text-xs leading-5 text-stone">{detail}</p><span className="mt-0.5 block text-[10px] font-semibold text-river">{time}</span></div>;
}

function QrVoucher({ checkedIn, onCheckIn }: { checkedIn: boolean; onCheckIn: () => void }) {
  return <section className="rounded-brand border border-border bg-white p-4"><div className="flex items-start justify-between gap-2"><div><div className="eyebrow mb-1">FUTURE SERVICE VOUCHER</div><h2 className="font-display text-lg font-bold">QR preview</h2></div><QrCode size={18} className="shrink-0 text-river"/></div><p className="mt-1.5 text-[11px] leading-4 text-stone">Future hotel, transport, guide, and meal handoff preview. No scanner or backend is connected.</p><div className="mx-auto my-4 grid w-fit grid-cols-[repeat(21,minmax(0,1fr))] gap-px border-4 border-white bg-white p-1 shadow-[0_0_0_1px_#D9E2DD]">{matrix.flatMap((row, y) => [...row].map((cell, x) => <span key={`${x}-${y}`} className={`h-1.5 w-1.5 sm:h-2 sm:w-2 ${cell === "1" ? "bg-charcoal" : "bg-white"}`}/>))}</div><div className="flex items-center justify-between border-y border-border py-2 text-[10px]"><span className="text-stone">Preview ID</span><strong className="font-mono text-river">DEMO-2048-KLM</strong></div>{checkedIn ? <div className="mt-3 flex items-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] p-2 text-xs font-semibold text-pine"><CheckCircle2 size={14}/> Demo status changed</div> : <button type="button" onClick={onCheckIn} className="button mt-3 min-h-9 w-full bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]"><ShieldCheck size={14}/> Preview check-in state</button>}<p className="mt-2 text-center text-[10px] leading-4 text-stone">Future authorized provider scan and status update.</p></section>;
}
