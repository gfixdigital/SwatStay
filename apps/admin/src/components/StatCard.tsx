import type { ReactNode } from "react";

export function StatCard({ label, value, note, icon }: { label: string; value: string | number; note: string; icon: ReactNode }) {
  return <article className="rounded-lg border border-border bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-stone">{label}</p><strong className="mt-1 block text-2xl font-bold text-charcoal">{value}</strong></div><span className="grid h-9 w-9 place-items-center rounded-md bg-mist text-river [&>svg]:h-4.5 [&>svg]:w-4.5">{icon}</span></div><p className="mt-3 border-t border-border pt-3 text-xs text-stone">{note}</p></article>;
}
