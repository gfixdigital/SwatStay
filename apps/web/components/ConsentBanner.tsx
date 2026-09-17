"use client";

import Link from "next/link";
import { Cookie, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

type ConsentChoice = "essential" | "all";
const storageKey = "swatstay.consent.v1";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    setOpen(!window.localStorage.getItem(storageKey));
  }, []);

  function save(choice: ConsentChoice) {
    window.localStorage.setItem(storageKey, JSON.stringify({ choice, savedAt: new Date().toISOString(), version: 1 }));
    setOpen(false);
  }

  if (!open) return null;
  return <section className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl rounded-brand border border-border bg-white p-4 shadow-editorial sm:bottom-5 sm:p-5" aria-label="Privacy choices">
    <div className="flex items-start gap-3"><span className="mt-0.5 text-river"><Cookie size={20} /></span><div className="min-w-0 flex-1"><h2 className="font-display text-base font-bold text-charcoal">Your privacy choices</h2><p className="mt-1 text-xs leading-5 text-stone">SwatStay uses browser storage for essential preferences and prototype features. We do not use advertising or analytics SDKs in this frontend preview.</p>{details && <div className="mt-3 border-l-2 border-river pl-3 text-xs leading-5 text-stone"><p><strong className="text-charcoal">Essential:</strong> language, currency, onboarding, saved packages, and form-preview state.</p><p className="mt-1"><strong className="text-charcoal">Optional:</strong> no optional tracking is active today. Choosing “Accept all” records your preference for future optional tools only.</p><Link href="/privacy" className="mt-2 inline-block font-semibold text-river">Read the Privacy Policy</Link></div>}</div><button type="button" onClick={() => save("essential")} className="text-stone hover:text-charcoal" aria-label="Use essential preferences only"><X size={18} /></button></div>
    <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" className="button min-h-9 border-border bg-white px-3 text-xs text-pine hover:bg-mist" onClick={() => setDetails((value) => !value)}><Settings2 size={14} />{details ? "Hide details" : "Manage choices"}</button><button type="button" className="button min-h-9 border-pine bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]" onClick={() => save("essential")}>Essential only</button><button type="button" className="button min-h-9 border-river bg-river px-3 text-xs text-white hover:bg-[#12566d]" onClick={() => save("all")}>Accept all</button></div>
  </section>;
}
