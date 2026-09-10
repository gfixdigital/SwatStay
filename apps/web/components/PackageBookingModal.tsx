"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, MessageCircle, PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { BookingForm } from "./BookingForm";
import { CurrencyPrice } from "./CurrencyPrice";

type PackageBookingModalProps = {
  packageTitle: string;
  packageImage: string;
  price: number;
  duration: string;
};

export function PackageBookingModal({ packageTitle, packageImage, price, duration }: PackageBookingModalProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return <>
    <aside className="hidden lg:block lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-brand border border-border bg-white shadow-editorial">
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${packageImage})` }}/>
        <div className="p-5">
          <div className="mt-1 flex items-end justify-between gap-3"><CurrencyPrice amountPkr={price} className="font-display text-3xl text-pine"/><span className="pb-1 text-xs text-stone">{duration}</span></div>
          <p className="mt-2 text-xs leading-5 text-stone">Final price and provider availability are confirmed by phone before payment.</p>
          <div className="my-5 space-y-3 border-y border-border py-4 text-xs text-stone">
            <p className="flex gap-2"><CheckCircle2 size={15} className="shrink-0 text-river"/>No charge when sending a request</p>
            <p className="flex gap-2"><PhoneCall size={15} className="shrink-0 text-river"/>A team member confirms the plan</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="button w-full bg-pine text-white hover:bg-[#0e2c22]">{t("requestPackage")}</button>
          <a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-brand border border-border text-sm font-semibold text-river hover:bg-mist"><MessageCircle size={16}/> Ask on WhatsApp</a>
        </div>
      </div>
    </aside>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-3 shadow-[0_-8px_24px_rgba(18,55,42,.10)] lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3"><div className="min-w-0 flex-1"><CurrencyPrice amountPkr={price} className="font-display text-lg text-pine"/></div><button type="button" onClick={() => setOpen(true)} className="button min-h-11 bg-pine px-4 text-sm text-white">{t("requestBooking")}</button></div>
    </div>

    <AnimatePresence>
      {open && <motion.div className="fixed inset-0 z-[90] flex items-end justify-center bg-charcoal/60 p-0 sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
        <motion.section role="dialog" aria-modal="true" aria-labelledby="package-booking-title" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: .99 }} transition={{ duration: reduceMotion ? 0 : .22, ease: "easeOut" }} className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-brand border border-border bg-snow shadow-2xl sm:rounded-brand">
          <header className="flex items-start justify-between gap-4 border-b border-border bg-white px-5 py-4 sm:px-6"><div><span className="text-[10px] font-bold uppercase tracking-[.08em] text-river">Booking request</span><h2 id="package-booking-title" className="mt-1 font-display text-xl font-bold text-pine sm:text-2xl">{packageTitle}</h2><p className="mt-1 text-xs text-stone">Nothing is charged until the details are confirmed.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close booking form" className="grid h-10 w-10 shrink-0 place-items-center rounded-brand border border-border bg-white text-stone hover:border-river hover:text-pine"><X size={19}/></button></header>
          <div className="overflow-y-auto p-4 sm:p-6"><BookingForm packageTitle={packageTitle}/></div>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </>;
}
