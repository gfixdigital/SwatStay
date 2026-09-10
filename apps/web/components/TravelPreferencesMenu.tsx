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
    <AnimatePresence>{open && <motion.div role="menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .18, ease: "easeOut" }} className="absolute right-0 top-full mt-3 w-[330px] overflow-hidden rounded-brand border border-border bg-white shadow-[0_20px_55px_rgba(18,55,42,.18)]"><PreferencePanel close={() => setOpen(false)}/></motion.div>}</AnimatePresence>
  </div>;
}

export function MobileTravelPreferences() {
  return <div className="overflow-hidden rounded-brand border border-border bg-white"><PreferencePanel/></div>;
}

function PreferencePanel({ close }: { close?: () => void }) {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { savedSlugs, loaded } = useSavedPackages();
  return <div>
    <div className="border-b border-border bg-mist px-4 py-3"><span className="text-[10px] font-bold uppercase tracking-[.09em] text-river">Travel preferences</span><p className="mt-1 text-xs text-stone">Language and estimated price display</p></div>
    <div className="space-y-5 p-4">
      <fieldset><legend className="mb-2 text-xs font-bold text-charcoal">Language</legend><div className="grid grid-cols-3 gap-2">{languages.map((item) => <button key={item.value} type="button" onClick={() => setLanguage(item.value)} className={`relative min-h-11 rounded-brand border px-2 text-sm font-semibold ${language === item.value ? "border-pine bg-pine text-white" : "border-border bg-white text-stone hover:border-river hover:text-pine"}`}>{item.label}{language === item.value && <Check size={12} className="absolute right-1.5 top-1.5"/>}</button>)}</div></fieldset>
      <fieldset><legend className="mb-2 text-xs font-bold text-charcoal">Currency preview</legend><div className="space-y-2">{currencies.map((item) => <button key={item.value} type="button" onClick={() => setCurrency(item.value)} className={`flex min-h-10 w-full items-center justify-between rounded-brand border px-3 text-left ${currency === item.value ? "border-river bg-mist" : "border-border bg-white hover:border-river"}`}><span><strong className="text-sm text-charcoal">{item.value}</strong><span className="ml-2 text-xs text-stone">{item.label}</span></span>{currency === item.value && <Check size={15} className="text-river"/>}</button>)}</div><p className="mt-2 text-[11px] leading-4 text-stone">USD and CNY use static approximate rates.</p></fieldset>
    </div>
    <Link href="/saved-packages" onClick={close} className="flex min-h-14 items-center justify-between border-t border-border bg-snow px-4 hover:bg-mist"><span className="flex items-center gap-2 text-sm font-semibold text-pine"><Bookmark size={17} className="text-river"/>Saved packages</span><span className="text-xs text-stone">{loaded ? savedSlugs.length : 0}</span></Link>
  </div>;
}
