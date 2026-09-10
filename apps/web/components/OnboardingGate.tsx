"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mountain, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export const ONBOARDING_KEY = "swatstay-onboarding-seen";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (window.localStorage.getItem(ONBOARDING_KEY)) return;
    setLoading(true);
    const timer = window.setTimeout(() => { window.localStorage.setItem(ONBOARDING_KEY, "true"); setLoading(false); }, 900);
    return () => window.clearTimeout(timer);
  }, []);
  return <><AnimatePresence>{loading && <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }} className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-pine text-white"><div className="relative z-10 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-brand bg-white/10 ring-1 ring-white/20"><Mountain size={28}/></span><div className="mt-4 font-display text-2xl font-extrabold">Swat<span className="text-[#9bd6b6]">Stay</span></div><p className="mt-2 text-sm text-[#c9e3d3]">Planning your way into the valley</p><div className="mt-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[.14em] text-[#9bd6b6]"><ShieldCheck size={14}/> Local travel, clearly arranged</div></div></motion.div>}</AnimatePresence><div className={loading ? "h-screen overflow-hidden" : ""}>{children}</div></>;
}
