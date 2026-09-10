"use client";

import { CircleDollarSign, Languages } from "lucide-react";
import { useCurrency, type CurrencyCode } from "@/hooks/useCurrency";
import { useLanguage, type LanguageCode } from "@/hooks/useLanguage";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  return <label className={`flex h-10 items-center gap-1.5 text-xs font-semibold text-stone ${className}`}><Languages size={15} className="shrink-0 text-river"/><span className="sr-only">Language</span><select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)} className="bg-transparent outline-none"><option value="en">English</option><option value="ur">اردو</option><option value="zh">中文</option></select></label>;
}

export function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return <label className={`flex h-10 items-center gap-1.5 text-xs font-semibold text-stone ${className}`}><CircleDollarSign size={15} className="shrink-0 text-river"/><span className="sr-only">Currency</span><select aria-label="Currency" value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="bg-transparent outline-none"><option value="PKR">PKR</option><option value="USD">USD</option><option value="CNY">CNY</option></select></label>;
}
