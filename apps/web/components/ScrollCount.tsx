"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function ScrollCount({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.7 });
  const [count, setCount] = useState(0);
  useEffect(() => { if (!visible) return; let frame = 0; const started = performance.now(); const tick = (now: number) => { const progress = Math.min((now - started) / 650, 1); setCount(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [visible, value]);
  return <span ref={ref} className="inline-flex items-center gap-2 rounded-brand border border-border bg-white px-3 py-2 text-xs text-stone"><strong className="font-display text-lg text-amber">{String(count).padStart(2, "0")}</strong><span>{label}</span></span>;
}
