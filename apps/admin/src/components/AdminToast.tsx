import { CheckCircle2, X } from "lucide-react";

export function AdminToast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-[70] flex max-w-sm items-start gap-3 rounded-lg border border-[#bdd5c7] bg-white p-3 text-sm text-charcoal shadow-panel"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-pine"/><span className="min-w-0 flex-1 leading-5">{message}</span><button type="button" onClick={onClose} className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-stone hover:bg-mist hover:text-charcoal" aria-label="Dismiss message"><X size={14}/></button></div>;
}
