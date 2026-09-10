import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="eyebrow">{eyebrow}</p><h1 className="text-2xl font-bold text-charcoal md:text-3xl">{title}</h1><p className="mt-1 max-w-2xl text-sm text-stone">{description}</p></div>{actions && <div className="flex flex-wrap gap-2">{actions}</div>}</header>;
}
