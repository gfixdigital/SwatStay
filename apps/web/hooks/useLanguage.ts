"use client";

import { useEffect, useState } from "react";

export type LanguageCode = "en" | "ur" | "zh";
export const LANGUAGE_KEY = "swatstay-language";
const LANGUAGE_EVENT = "swatstay:language";

const translations = {
  en: { packages: "Packages", destinations: "Destinations", customTrip: "Custom trip", about: "About", contact: "Contact", saved: "Saved", login: "Log in", bookTrip: "Book a trip", whatsapp: "WhatsApp", viewDetails: "View details", save: "Save", savedLabel: "Saved", requestPackage: "Request this package", requestBooking: "Request booking", share: "Share", print: "Print itinerary" },
  ur: { packages: "پیکیجز", destinations: "مقامات", customTrip: "اپنا سفر", about: "ہمارے بارے میں", contact: "رابطہ", saved: "محفوظ", login: "لاگ اِن", bookTrip: "سفر بک کریں", whatsapp: "واٹس ایپ", viewDetails: "تفصیل دیکھیں", save: "محفوظ کریں", savedLabel: "محفوظ", requestPackage: "یہ پیکیج منتخب کریں", requestBooking: "بکنگ درخواست", share: "شیئر کریں", print: "سفرنامہ پرنٹ کریں" },
  zh: { packages: "旅游套餐", destinations: "目的地", customTrip: "定制行程", about: "关于我们", contact: "联系我们", saved: "已收藏", login: "登录", bookTrip: "预订行程", whatsapp: "WhatsApp", viewDetails: "查看详情", save: "收藏", savedLabel: "已收藏", requestPackage: "申请此套餐", requestBooking: "申请预订", share: "分享", print: "打印行程" },
} as const;

export type TranslationKey = keyof typeof translations.en;

function readLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const value = window.localStorage.getItem(LANGUAGE_KEY);
  return value === "ur" || value === "zh" ? value : "en";
}

export function useLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const sync = () => {
      const next = readLanguage();
      setLanguageState(next);
      document.documentElement.lang = next === "zh" ? "zh-CN" : next;
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(LANGUAGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(LANGUAGE_EVENT, sync);
    };
  }, []);

  function setLanguage(next: LanguageCode) {
    window.localStorage.setItem(LANGUAGE_KEY, next);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  }

  return { language, setLanguage, t: (key: TranslationKey) => translations[language][key] ?? translations.en[key] };
}
