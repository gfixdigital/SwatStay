"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Car, ChevronRight, Hotel, MapPin, Mountain, Utensils, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PackageServiceDetail, Service } from "@/types/package";

export function InteractiveServiceBadges({ details }: { details: PackageServiceDetail[] }) {
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [pinnedService, setPinnedService] = useState<Service | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const activeDetail = details.find((detail) => detail.service === activeService);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setActiveService(null);
        setPinnedService(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveService(null);
        setPinnedService(null);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function toggle(service: Service) {
    if (pinnedService === service) {
      setPinnedService(null);
      setActiveService(null);
      return;
    }
    setPinnedService(service);
    setActiveService(service);
  }

  return <div ref={rootRef} className="relative z-20" onMouseLeave={() => !pinnedService && setActiveService(null)}>
    <div className="flex flex-wrap gap-2">
      {details.map((detail) => {
        const selected = activeService === detail.service;
        return <button
          key={detail.service}
          type="button"
          aria-expanded={selected}
          aria-controls="service-preview"
          onMouseEnter={() => !pinnedService && setActiveService(detail.service)}
          onFocus={() => !pinnedService && setActiveService(detail.service)}
          onClick={() => toggle(detail.service)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-brand border px-3.5 py-2 text-sm font-medium transition ${selected ? "border-river bg-mist text-pine shadow-[0_5px_16px_rgba(18,55,42,.08)]" : "border-border bg-white text-stone hover:-translate-y-0.5 hover:border-river hover:text-pine"}`}
        >
          <span className="text-river">{serviceIcon(detail.service, 17)}</span>{detail.service}
        </button>;
      })}
    </div>

    <AnimatePresence mode="wait">
      {activeDetail && <motion.div
        id="service-preview"
        key={activeDetail.service}
        initial={reduceMotion ? false : { opacity: 0, y: 6, scale: .99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: .99 }}
        transition={{ duration: reduceMotion ? 0 : .2, ease: "easeOut" }}
        className="absolute bottom-full left-0 mb-3 w-full max-w-md origin-bottom overflow-hidden rounded-brand border border-border bg-white shadow-[0_18px_45px_rgba(18,55,42,.16)]"
      >
        <div className="flex items-start gap-3 border-b border-border bg-mist p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-brand bg-white text-river shadow-[0_0_0_1px_#D9E2DD]">{serviceIcon(activeDetail.service, 19)}</span>
          <div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-[.08em] text-river">{activeDetail.service} included</span><h3 className="mt-0.5 font-display text-base font-bold text-charcoal">{activeDetail.title}</h3></div>
          <button type="button" onClick={() => { setActiveService(null); setPinnedService(null); }} aria-label="Close service preview" className="grid h-8 w-8 shrink-0 place-items-center rounded-brand text-stone hover:bg-white hover:text-pine"><X size={16}/></button>
        </div>
        <div className="p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-stone">Current sample provider</span>
          <p className="mt-1 font-display text-lg font-bold text-pine">{activeDetail.providerName}</p>
          <p className="mt-2 text-xs leading-5 text-stone">{activeDetail.description}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            {activeDetail.location ? <span className="flex items-center gap-1 text-xs text-stone"><MapPin size={13} className="text-river"/>{activeDetail.location}</span> : <span className="text-xs text-stone">Confirmed during booking call</span>}
            <a href="#providers" onClick={() => { setActiveService(null); setPinnedService(null); }} className="inline-flex items-center gap-1 text-xs font-semibold text-river hover:text-pine">Full details <ChevronRight size={14}/></a>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

function serviceIcon(service: Service, size: number) {
  if (service === "Hotel") return <Hotel size={size}/>;
  if (service === "Transport") return <Car size={size}/>;
  if (service === "Meals") return <Utensils size={size}/>;
  return <Mountain size={size}/>;
}
