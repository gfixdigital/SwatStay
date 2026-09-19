"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { promotionPopup } from "@/data/siteContent";

const STORAGE_PREFIX = "swatstay:promo-popup-dismissed:";

export function PromotionPopup() {
  const popup = promotionPopup;
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Show once per promotion id, after a short delay, unless already dismissed.
  useEffect(() => {
    if (!popup.isActive) return;
    let alreadyDismissed = false;
    try {
      alreadyDismissed = window.localStorage.getItem(STORAGE_PREFIX + popup.id) === "1";
    } catch {
      alreadyDismissed = false;
    }
    if (alreadyDismissed) return;
    const timer = window.setTimeout(() => setOpen(true), popup.showAfterMs);
    return () => window.clearTimeout(timer);
  }, [popup.isActive, popup.id, popup.showAfterMs]);

  // Escape closes it, focus moves in, background scroll locks while open.
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_PREFIX + popup.id, "1");
    } catch {
      // localStorage unavailable (private browsing, etc). Popup will
      // simply show again next visit, which is an acceptable fallback.
    }
  }

  if (!popup.isActive) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-charcoal/55 p-4"
          onClick={(event) => event.target === event.currentTarget && close()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-popup-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97, y: reduceMotion ? 0 : 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className="relative w-full max-w-md rounded-brand border border-border bg-snow p-7 shadow-editorial outline-none"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 text-stone hover:text-pine"
              aria-label="Close"
            >
              <X size={19} />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-brand bg-mist text-pine">
              <Sparkles size={18} />
            </span>
            <div className="eyebrow mt-4">{popup.eyebrow}</div>
            <h2 id="promo-popup-title" className="font-display text-2xl font-bold text-charcoal sm:text-3xl">
              {popup.title}
            </h2>
            <p className="my-3 text-sm leading-6 text-stone">{popup.description}</p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href={popup.ctaHref}
                onClick={close}
                className="button min-h-11 flex-1 gap-2 bg-pine text-sm text-white hover:bg-[#0e2c22]"
              >
                {popup.ctaLabel} <ArrowUpRight size={15} />
              </Link>
              <button
                type="button"
                onClick={close}
                className="button min-h-11 border-border bg-white px-4 text-sm text-stone hover:bg-mist"
              >
                {popup.dismissLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
