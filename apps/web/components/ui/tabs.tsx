import type { HTMLAttributes } from "react"; export function Tabs({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={className} {...props}/>; }
