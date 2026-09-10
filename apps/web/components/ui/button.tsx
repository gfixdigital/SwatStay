import type { ButtonHTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={cn("inline-flex min-h-11 items-center justify-center rounded-brand px-4 font-semibold", className)} {...props}/>; }
