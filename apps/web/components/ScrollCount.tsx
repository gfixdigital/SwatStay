export function ScrollCount({ value, label }: { value: number; label: string }) {
  return <span className="inline-flex items-center gap-2 rounded-brand border border-border bg-white px-3 py-2 text-xs text-stone"><strong className="font-display text-lg text-amber">{value}</strong><span>{label}</span></span>;
}
