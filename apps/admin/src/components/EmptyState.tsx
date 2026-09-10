import { Inbox } from "lucide-react";

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="rounded-lg border border-dashed border-border bg-snow px-5 py-10 text-center"><Inbox className="mx-auto text-river" size={24}/><h3 className="mt-3 text-base font-semibold text-charcoal">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm text-stone">{text}</p></div>;
}
