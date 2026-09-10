"use client";

import { CurrencyPrice } from "./CurrencyPrice";

export function PriceBreakdown({ price }: { price: number }) { return <div className="rounded-brand border border-border bg-white p-5"><div className="flex items-end justify-between gap-4 text-sm text-stone"><span>Package base price in PKR</span><span>PKR {price.toLocaleString()}</span></div><div className="my-3 border-t border-border"/><div className="flex items-end justify-between gap-4"><span className="font-display text-lg font-bold text-pine">Estimated total</span><CurrencyPrice amountPkr={price} showLabel={false} className="font-display text-lg font-bold text-pine"/></div><p className="mt-3 text-xs leading-5 text-stone">USD and CNY values use static approximate preview rates. Final pricing is confirmed by phone based on dates, group size, availability, and the payment currency.</p></div>; }
