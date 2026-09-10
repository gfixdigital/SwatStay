"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, ChevronDown, Globe2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCurrency, type CurrencyCode } from "@/hooks/useCurrency";
import { useLanguage, type LanguageCode } from "@/hooks/useLanguage";
import { useSavedPackages } from "@/hooks/useSavedPackages";

const languages: { value: LanguageCode; short: string; label: string }[] = [
  { value: "en", short: "EN", label: "English" },
  { value: "ur", short: "UR", label: "اردو" },
  { value: "zh", short: "ZH", label: "中文" },
];
const currencies: { value: CurrencyCode; label: string }[] = [
  { value: "PKR", label: "Pakistani rupee" },
  { value: "USD", label: "US dollar estimate" },
  { value: "CNY", label: "Chinese yuan estimate" },
];

export function TravelPreferencesMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { currency } = useCurrency();

  useEffect(() => {
    const close = (event: MouseEvent) => !rootRef.current?.contains(event.target as Node) && setOpen(false);
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const shortLanguage = languages.find((item) => item.value === language)?.short ?? "EN";
  return <div ref={rootRef} className="relative hidden xl:block">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" className={`flex h-11 items-center rounded-brand border bg-white text-sm font-semibold transition ${open ? "border-river shadow-[0_6px_20px_rgba(18,55,42,.10)]" : "border-border hover:border-river"}`}>
      <span className="grid h-full w-10 place-items-center border-r border-border text-river"><Globe2 size={17}/></span><span className="px-3 text-charcoal">{shortLanguage}</span><span className="h-4 w-px bg-border"/><span className="px-3 text-charcoal">{currency}</span><ChevronDown size={15} className={`mr-3 text-stone transition-transform ${open ? "rotate-180" : ""}`}/>
    </button>
    <AnimatePresence>{open && <motion.div role="menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .18, ease: "easeOut" }} className="absolute right-0 top-full mt-2 w-[300px] overflow-hidden rounded-brand border border-border bg-white shadow-[0_18px_46px_rgba(18,55,42,.16)]"><PreferencePanel close={() => setOpen(false)}/></motion.div>}</AnimatePresence>
  </div>;
}

export function MobileTravelPreferences() {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const shortLanguage = languages.find((item) => item.value === language)?.short ?? "EN";
  return <div className="overflow-hidden rounded-brand border border-border bg-white">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-travel-preferences" className="flex min-h-12 w-full items-center gap-3 px-3.5 text-left hover:bg-mist"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-brand bg-mist text-river"><Globe2 size={16}/></span><span className="min-w-0 flex-1"><strong className="block text-sm text-charcoal">Language and currency</strong><span className="mt-0.5 block text-xs text-stone">{shortLanguage} · {currency}</span></span><ChevronDown size={17} className={`shrink-0 text-river transition-transform ${open ? "rotate-180" : ""}`}/></button>
    <AnimatePresence initial={false}>{open && <motion.div id="mobile-travel-preferences" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .2, ease: "easeOut" }} className="overflow-hidden border-t border-border"><PreferencePanel/></motion.div>}</AnimatePresence>
  </div>;
}

function PreferencePanel({ close }: { close?: () => void }) {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { savedSlugs, loaded } = useSavedPackages();
  return <div>
    <div className="border-b border-border bg-mist px-3.5 py-2.5"><span className="text-[10px] font-bold uppercase tracking-[.09em] text-river">Travel preferences</span><p className="mt-0.5 text-[11px] text-stone">Language and estimated price display</p></div>
    <div className="space-y-4 p-3.5">
      <fieldset><legend className="mb-2 text-xs font-bold text-charcoal">Language</legend><div className="grid grid-cols-3 gap-1.5">{languages.map((item) => <button key={item.value} type="button" onClick={() => setLanguage(item.value)} className={`relative min-h-10 rounded-brand border px-1.5 text-xs font-semibold ${language === item.value ? "border-pine bg-pine text-white" : "border-border bg-white text-stone hover:border-river hover:text-pine"}`}>{item.label}{language === item.value && <Check size={11} className="absolute right-1 top-1"/>}</button>)}</div></fieldset>
      <fieldset><legend className="mb-2 text-xs font-bold text-charcoal">Currency preview</legend><div className="space-y-1.5">{currencies.map((item) => <button key={item.value} type="button" onClick={() => setCurrency(item.value)} className={`flex min-h-9 w-full items-center justify-between rounded-brand border px-2.5 text-left ${currency === item.value ? "border-river bg-mist" : "border-border bg-white hover:border-river"}`}><span><strong className="text-xs text-charcoal">{item.value}</strong><span className="ml-2 text-[11px] text-stone">{item.label}</span></span>{currency === item.value && <Check size={14} className="text-river"/>}</button>)}</div><p className="mt-1.5 text-[10px] leading-4 text-stone">USD and CNY use static approximate rates.</p></fieldset>
    </div>
    <Link href="/saved-packages" onClick={close} className="flex min-h-12 items-center justify-between border-t border-border bg-snow px-3.5 hover:bg-mist"><span className="flex items-center gap-2 text-xs font-semibold text-pine"><Bookmark size={16} className="text-river"/>Saved packages</span><span className="text-[11px] text-stone">{loaded ? savedSlugs.length : 0}</span></Link>
  </div>;
}
