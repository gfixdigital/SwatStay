"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = { label: string; value: string };

export function CustomSelect({ label, name, value, onChange, options, className = "", placeholder }: { label?: string; name?: string; value?: string; onChange?: (value: string) => void; options: Option[]; className?: string; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const currentValue = onChange ? value : localValue;
  const selected = options.find((option) => option.value === currentValue);
  useEffect(() => { const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return <div ref={ref} className={`relative ${className}`}>
    {label && <span className="mb-1 block text-xs font-semibold text-stone">{label}</span>}
    {name && <input type="hidden" name={name} value={currentValue ?? ""} />}
    <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className={`flex h-11 w-full items-center justify-between rounded-brand border bg-white px-3 text-left text-sm outline-none transition ${open ? "border-river ring-1 ring-river" : "border-border hover:border-river"}`}>
      <span className={selected ? "text-charcoal" : "text-stone/70"}>{selected?.label ?? placeholder ?? "Select an option"}</span><ChevronDown size={16} className={`text-stone transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.98 }} transition={{ duration: 0.16 }} className="absolute bottom-full left-0 right-0 z-40 mb-2 overflow-hidden rounded-brand border border-border bg-white p-1 shadow-editorial">
      {options.map((option) => <button type="button" key={option.value} onClick={() => { setLocalValue(option.value); onChange?.(option.value); setOpen(false); }} className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-charcoal hover:bg-mist">{option.label}{option.value === currentValue && <Check size={16} className="text-river"/>}</button>)}
    </motion.div>}</AnimatePresence>
  </div>;
}
