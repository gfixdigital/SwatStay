import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`rounded-[8px] px-4 py-2 font-semibold ${className}`} {...props}/>; }
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`rounded-[8px] border border-[#D9E2DD] bg-white ${className}`} {...props}/>; }
