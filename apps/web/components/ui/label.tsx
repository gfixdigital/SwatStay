import type { LabelHTMLAttributes } from "react"; export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) { return <label className="text-xs font-semibold" {...props}/>; }
