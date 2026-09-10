"use client";

import { useEffect, useState } from "react";

export type CurrencyCode = "PKR" | "USD" | "CNY";
export const CURRENCY_KEY = "swatstay-currency";
const CURRENCY_EVENT = "swatstay:currency";

const approximateRates: Record<CurrencyCode, number> = { PKR: 1, USD: 1 / 280, CNY: 1 / 39 };

function readCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "PKR";
  const value = window.localStorage.getItem(CURRENCY_KEY);
  return value === "USD" || value === "CNY" ? value : "PKR";
}

export function formatEstimatedPrice(amountPkr: number, currency: CurrencyCode) {
  const converted = amountPkr * approximateRates[currency];
  return new Intl.NumberFormat(currency === "PKR" ? "en-PK" : currency === "CNY" ? "zh-CN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  }).format(converted);
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyCode>("PKR");

  useEffect(() => {
    const sync = () => setCurrencyState(readCurrency());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CURRENCY_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CURRENCY_EVENT, sync);
    };
  }, []);

  function setCurrency(next: CurrencyCode) {
    window.localStorage.setItem(CURRENCY_KEY, next);
    window.dispatchEvent(new Event(CURRENCY_EVENT));
  }

  return { currency, setCurrency, formatPrice: (amountPkr: number) => formatEstimatedPrice(amountPkr, currency) };
}
