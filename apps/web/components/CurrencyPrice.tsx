"use client";

import { useCurrency } from "@/hooks/useCurrency";

export function CurrencyPrice({ amountPkr, className = "", showLabel = true }: { amountPkr: number; className?: string; showLabel?: boolean }) {
  const { currency, formatPrice } = useCurrency();
  return <span><span className={showLabel ? "block text-[11px] font-normal text-stone" : "sr-only"}>Estimated price</span><strong className={className}>{formatPrice(amountPkr)}</strong>{currency !== "PKR" && <span className="ml-1 text-[10px] font-normal text-stone">approx.</span>}</span>;
}
