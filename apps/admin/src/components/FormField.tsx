import type { ReactNode } from "react";

export function FormField({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) { return <label className="label">{label}{required && <span className="ml-1 text-[#9c3f2e]">*</span>}{children}{hint && <span className="mt-1 block text-xs font-normal text-stone">{hint}</span>}</label>; }
