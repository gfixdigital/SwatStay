"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mountain, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 1250); return () => window.clearTimeout(timer); }, []);
  return <><AnimatePresence>{loading && <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }} className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-pine text-white"><motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="relative z-10 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-brand bg-white/10 ring-1 ring-white/20"><Mountain size={32}/></span><div className="mt-5 font-display text-3xl font-extrabold">Swat<span className="text-[#9bd6b6]">Stay</span></div><p className="mt-2 text-sm text-[#c9e3d3]">Planning your way into the valley</p><div className="mx-auto mt-7 flex items-center justify-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-white"/><span className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:150ms]"/><span className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:300ms]"/></div><div className="mt-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[.14em] text-[#9bd6b6]"><ShieldCheck size={14}/> Local travel, clearly arranged</div></motion.div><div className="absolute -bottom-24 left-1/2 h-72 w-[min(720px,120vw)] -translate-x-1/2 rounded-[50%] border border-white/10"/><div className="absolute -bottom-32 left-1/2 h-72 w-[min(900px,140vw)] -translate-x-1/2 rounded-[50%] border border-white/5"/></motion.div>}</AnimatePresence><div className={loading ? "h-screen overflow-hidden" : ""}>{children}</div></>;
}
