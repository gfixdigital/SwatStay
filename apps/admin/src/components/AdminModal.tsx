import type { ReactNode } from "react";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

export function AdminModal({ open, title, description, onClose, children, width = "max-w-lg" }: { open: boolean; title: string; description?: string; onClose: () => void; children: ReactNode; width?: string }) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/55 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .15 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.section role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" initial={reduceMotion ? false : { opacity: 0, y: 12, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: .99 }} transition={{ duration: reduceMotion ? 0 : .18 }} className={`max-h-[90dvh] w-full ${width} overflow-y-auto rounded-lg border border-border bg-white shadow-2xl`}><header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-white p-4"><div><h2 id="admin-modal-title" className="text-lg font-bold text-charcoal">{title}</h2>{description && <p className="mt-1 text-sm text-stone">{description}</p>}</div><button type="button" className="icon-button" onClick={onClose} aria-label="Close modal"><X size={18}/></button></header><div className="p-4">{children}</div></motion.section></motion.div>}</AnimatePresence>;
}
