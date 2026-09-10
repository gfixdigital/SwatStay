"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({ label = "When?", name = "travelDate", className = "" }: { label?: string; name?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  const days = useMemo(() => { const start = new Date(month.getFullYear(), month.getMonth(), 1).getDay(); const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(); return [...Array(start).fill(null), ...Array.from({ length: total }, (_, index) => index + 1)]; }, [month]);
  const format = selected ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Select dates";
  return <div ref={ref} className={`relative ${className}`}>
    <span className="mb-1 block text-xs font-semibold text-stone">{label}</span><input type="hidden" name={name} value={selected?.toISOString() ?? ""}/>
    <button type="button" onClick={() => setOpen((current) => !current)} className={`flex h-11 w-full items-center gap-2 rounded-brand border bg-white px-3 text-left text-sm transition ${open ? "border-river ring-1 ring-river" : "border-border hover:border-river"}`}><CalendarDays size={17} className="text-river"/><span className={selected ? "text-charcoal" : "text-stone/70"}>{format}</span></button>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 5, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: .98 }} transition={{ duration: .16 }} className="absolute bottom-full left-0 z-40 mb-2 w-[min(300px,calc(100vw-32px))] rounded-brand border border-border bg-white p-4 shadow-editorial">
      <div className="mb-3 flex items-center justify-between"><button type="button" className="grid h-8 w-8 place-items-center rounded-md text-stone hover:bg-mist" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={16}/></button><strong className="font-display text-sm">{monthNames[month.getMonth()]} {month.getFullYear()}</strong><button type="button" className="grid h-8 w-8 place-items-center rounded-md text-stone hover:bg-mist" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={16}/></button></div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone">{weekDays.map((day) => <span key={day} className="py-1">{day}</span>)}{days.map((day, index) => day ? <button type="button" key={index} onClick={() => { setSelected(new Date(month.getFullYear(), month.getMonth(), day)); setOpen(false); }} className={`grid h-8 place-items-center rounded-md text-sm hover:bg-mist ${selected?.getDate() === day && selected?.getMonth() === month.getMonth() && selected?.getFullYear() === month.getFullYear() ? "bg-pine text-white hover:bg-pine" : "text-charcoal"}`}>{day}</button> : <span key={index}/>)}</div>
    </motion.div>}</AnimatePresence>
  </div>;
}
