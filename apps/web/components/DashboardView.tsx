"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2, Clock3, Download, Hotel, MapPin, MessageSquare, Mountain, PhoneCall, QrCode, RefreshCw, ShieldCheck, Utensils, WalletCards, X } from "lucide-react";

type Service = { id: string; title: string; provider: string; detail: string; status: "Ready" | "Pending" | "Checked in"; icon: React.ReactNode };

const matrix = ["111111100101011111111", "100000101111010000001", "101110100101010111101", "101110111001010111101", "101110101101010111101", "100000101010010000001", "111111101010111111111", "000000001101000000000", "110111111001011011011", "001010010111100100100", "111101111010111110101", "010001001111001001110", "101110111001111010011", "000000001010001111000", "111111101101111010101", "100000100011001110010", "101110101111101011111", "101110111000011000100", "101110100111110111001", "100000101001011100110", "111111101110101011011"];

export function DashboardView() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [services, setServices] = useState<Service[]>([
    { id: "hotel", title: "Hotel check-in", provider: "Kalam View Guesthouse", detail: "Arrival desk · 14:00", status: "Ready", icon: <Hotel size={18}/> },
    { id: "transport", title: "Private transport", provider: "Swat Valley 4x4", detail: "Mingora pickup · 08:00", status: "Ready", icon: <CarFront size={18}/> },
    { id: "guide", title: "Ushu Forest guide", provider: "Naveed Khan · Local guide", detail: "Day 2 · 09:30", status: "Pending", icon: <Mountain size={18}/> },
    { id: "meals", title: "Breakfast and dinner", provider: "Kalam View Guesthouse", detail: "Included in stay", status: "Ready", icon: <Utensils size={18}/> },
  ]);
  function demoCheckIn() { setCheckedIn(true); setLastUpdated("A few seconds ago"); setServices((current) => current.map((item) => item.id === "hotel" ? { ...item, status: "Checked in" } : item)); }
  return <>
    <section className="border-b border-border bg-snow py-4"><div className="container flex flex-col justify-between gap-3 text-xs text-stone sm:flex-row sm:items-center"><div className="flex items-center gap-2"><Link href="/" className="hover:text-pine">Home</Link><span>›</span><span className="font-medium text-charcoal">Traveler dashboard</span></div><div className="inline-flex w-fit items-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-pine"><ShieldCheck size={14}/> Protected trip workspace</div></div></section>
    <section className="border-b border-border bg-white py-5 md:py-8"><div className="container"><div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center"><div><div className="eyebrow">TRAVELER OPERATIONS DESK</div><h1 className="font-display text-3xl font-bold leading-tight text-pine sm:text-4xl">Good morning, Ayesha</h1><p className="mt-1.5 max-w-xl text-sm leading-6 text-stone">Your confirmed trip, service vouchers, and live arrival updates in one place.</p></div><div className="flex flex-wrap gap-2"><Link href="/packages" className="button min-h-9 border-border bg-white px-3 text-xs text-pine hover:bg-mist sm:text-sm">Plan another trip <ArrowUpRight size={15}/></Link><button type="button" onClick={() => setLastUpdated("Just now")} className="button min-h-9 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22] sm:text-sm"><RefreshCw size={15}/> Refresh</button></div></div><div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={<BadgeCheck/>} label="Trip status" value="Confirmed" tone="green"/><Metric icon={<CalendarDays/>} label="Travel dates" value="12–14 Oct 2026"/><Metric icon={<WalletCards/>} label="Payment" value="Advance received" tone="amber"/><Metric icon={<MessageSquare/>} label="Support desk" value="Available" tone="blue"/></div></div></section>
    <section className="py-5 md:py-12"><div className="container grid gap-4 lg:grid-cols-[1.25fr_.75fr] lg:items-start"><div className="space-y-4 md:space-y-6"><section className="rounded-brand border border-border bg-white"><div className="flex flex-col justify-between gap-2 border-b border-border p-4 sm:flex-row sm:items-start md:p-6"><div><span className="text-[11px] font-semibold text-river">SS-2048 · COUPLE STANDARD</span><h2 className="mt-1 font-display text-xl font-bold text-charcoal sm:text-2xl">Kalam, 3 days</h2><p className="mt-1 flex items-center gap-1 text-xs text-stone sm:text-sm"><MapPin size={14} className="text-river"/> Mingora → Kalam → Ushu Forest</p></div><span className="inline-flex w-fit items-center gap-1 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-2 py-1 text-[11px] font-semibold text-pine"><CheckCircle2 size={13}/> Confirmed</span></div><div className="grid grid-cols-3 gap-2 p-4 text-xs sm:gap-4 sm:p-5 sm:text-sm md:p-6"><Info label="Travel dates" value="12–14 Oct"/><Info label="Travelers" value="2 people"/><Info label="Pickup" value="Mingora · 08:00"/></div></section><section className="rounded-brand border border-border bg-white p-4 md:p-6"><div className="flex items-start justify-between gap-2"><div><div className="eyebrow mb-1">SERVICE VOUCHERS</div><h2 className="font-display text-xl font-bold sm:text-2xl">Every stop, one recorded status</h2></div><span className="text-[11px] text-stone">Prototype data</span></div><div className="mt-3 divide-y divide-border sm:mt-5">{services.map((service) => <ServiceRow key={service.id} service={service} checkedIn={checkedIn}/>)}</div></section><section className="rounded-brand border border-border bg-white p-4 md:p-6"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div><div className="eyebrow mb-1">TRIP ACTIVITY</div><h2 className="font-display text-xl font-bold sm:text-2xl">Coordination timeline</h2></div><span className="text-[11px] text-stone">Prototype status</span></div><div className="mt-4 space-y-4 border-l border-border pl-4 sm:mt-5 sm:space-y-5 sm:pl-5"><Timeline title="Booking confirmed" detail="SwatStay confirmed your Kalam package and provider assignments." time="Today · 10:42" done/><Timeline title="Advance payment received" detail="Your advance payment has been recorded against SS-2048." time="Yesterday · 16:20" done/><Timeline title="Hotel arrival handoff" detail={checkedIn ? "Demo check-in state recorded for this preview." : "The future voucher flow will record hotel arrival here."} time={checkedIn ? "Prototype · checked in" : "12 Oct · 14:00"} done={checkedIn}/></div></section></div><aside className="space-y-4 lg:sticky lg:top-28 lg:space-y-6"><button type="button" onClick={() => setQrOpen(true)} className="group flex w-full items-center justify-between rounded-brand border border-border bg-white p-4 text-left shadow-editorial transition hover:-translate-y-0.5 hover:border-river"><span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-md bg-mist text-river"><QrCode size={19}/></span><span><strong className="block font-display text-lg text-charcoal">Show QR voucher</strong><small className="mt-0.5 block text-xs text-stone">Prototype service preview</small></span></span><ArrowUpRight size={17} className="text-river transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></button><section className="rounded-brand border border-border bg-mist p-4 md:p-5"><div className="flex items-center gap-2"><PhoneCall size={18} className="text-river"/><h2 className="font-display text-lg font-semibold">Need the field team?</h2></div><p className="mt-2 text-sm leading-5 text-stone">Ask about pickup changes, provider arrival, accessibility, or any detail during the trip.</p><a href="mailto:desk@swatstay.pk" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-river">Contact support <ArrowUpRight size={15}/></a></section></aside></div></section>
    <QrVoucherModal open={qrOpen} checkedIn={checkedIn} onClose={() => setQrOpen(false)} onCheckIn={demoCheckIn}/>
  </>;
}

function Metric({ icon, label, value, tone = "green" }: { icon: React.ReactNode; label: string; value: string; tone?: "green" | "amber" | "blue" }) { const colors = { green: "bg-mist text-pine", amber: "bg-[#faf3e8] text-amber", blue: "bg-[#ebf3f6] text-river" }; return <div className="flex min-w-0 items-center gap-2 rounded-brand border border-border bg-white p-2.5 sm:gap-3 sm:p-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${colors[tone]} [&>svg]:h-4 [&>svg]:w-4 sm:h-9 sm:w-9 sm:[&>svg]:h-5 sm:[&>svg]:w-5`}>{icon}</span><span className="min-w-0"><small className="block truncate text-[10px] text-stone sm:text-xs">{label}</small><strong className="block truncate font-display text-xs text-charcoal sm:text-base">{value}</strong></span></div>; }
function Info({ label, value }: { label: string; value: string }) { return <span className="border-l-2 border-mist pl-3"><small className="block text-xs text-stone">{label}</small><strong className="mt-1 block text-sm text-charcoal">{value}</strong></span>; }
function ServiceRow({ service, checkedIn }: { service: Service; checkedIn: boolean }) { const status = checkedIn && service.id === "hotel" ? "Checked in" : service.status; const done = status === "Checked in" || status === "Ready"; return <div className="flex items-center justify-between gap-2 py-3 sm:gap-3 sm:py-4"><div className="flex min-w-0 items-center gap-2 sm:gap-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md sm:h-10 sm:w-10 ${status === "Pending" ? "bg-[#faf3e8] text-amber" : "bg-mist text-pine"}`}>{service.icon}</span><span className="min-w-0"><strong className="block truncate text-xs text-charcoal sm:text-sm">{service.title}</strong><small className="block truncate text-[10px] text-stone sm:text-xs">{service.provider} · {service.detail}</small></span></div><span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-1 text-[10px] font-semibold sm:px-2 sm:text-xs ${status === "Pending" ? "border-[#eed7b8] bg-[#faf3e8] text-amber" : "border-[#c4d7cb] bg-[#e8efea] text-pine"}`}>{done ? <Check size={11}/> : <Clock3 size={11}/>}<span className="hidden sm:inline">{status}</span><span className="sm:hidden">{status === "Checked in" ? "In" : status}</span></span></div>; }
function Timeline({ title, detail, time, done }: { title: string; detail: string; time: string; done?: boolean }) { return <div className="relative"><span className={`absolute -left-[26px] top-0.5 grid h-4 w-4 place-items-center rounded-full border-2 border-white ${done ? "bg-pine" : "bg-border"}`}>{done && <Check size={9} className="text-white"/>}</span><h3 className="text-sm font-semibold text-charcoal">{title}</h3><p className="mt-1 text-xs leading-5 text-stone">{detail}</p><span className="mt-1 block text-[11px] font-semibold text-river">{time}</span></div>; }
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
    matrix.forEach((row, y) => [...row].forEach((value, x) => {
      if (value === "1") context.fillRect(startX + x * cell, startY + y * cell, cell, cell);
    }));
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

  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-charcoal/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.section role="dialog" aria-modal="true" aria-labelledby="qr-voucher-title" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: .98 }} transition={{ duration: reduceMotion ? 0 : .22, ease: "easeOut" }} className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-brand border border-border bg-white p-5 shadow-2xl sm:p-6"><button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-stone transition hover:bg-mist hover:text-pine" aria-label="Close QR voucher"><X size={19}/></button><div className="pr-10"><div className="eyebrow mb-1">FUTURE SERVICE VOUCHER</div><h2 id="qr-voucher-title" className="font-display text-2xl font-bold text-charcoal">QR preview</h2></div><p className="mt-2 text-sm leading-5 text-stone">A future voucher preview for service handoffs. It is not connected to a scanner or backend.</p><div className="mx-auto my-5 grid w-fit grid-cols-[repeat(21,minmax(0,1fr))] gap-0.5 border-8 border-white bg-white p-1 shadow-[0_0_0_1px_#D9E2DD]">{matrix.flatMap((row, y) => [...row].map((cell, x) => <span key={`${x}-${y}`} className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${cell === "1" ? "bg-charcoal" : "bg-white"}`}/>))}</div><div className="flex items-center justify-between border-y border-border py-3 text-xs"><span className="text-stone">Preview ID</span><strong className="font-mono text-river">DEMO-2048-KLM</strong></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={downloadVoucher} className="button min-h-10 border-border bg-white px-3 text-xs text-pine hover:bg-mist"><Download size={15}/> Download picture</button>{checkedIn ? <div className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#c4d7cb] bg-[#e8efea] px-3 text-xs font-semibold text-pine"><CheckCircle2 size={15}/> Demo checked in</div> : <button type="button" onClick={onCheckIn} className="button min-h-10 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]"><ShieldCheck size={15}/> Preview check-in</button>}</div><p className="mt-3 text-center text-[11px] leading-4 text-stone">Future flow: authorized provider scan → service handoff event → tourist status update.</p></motion.section></motion.div>}</AnimatePresence>;
}
