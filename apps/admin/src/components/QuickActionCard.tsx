import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActionCard({ to, icon, title, text }: { to: string; icon: ReactNode; title: string; text: string }) { return <Link to={to} className="group flex items-start gap-3 rounded-lg border border-border bg-white p-4 hover:border-river hover:bg-mist"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-mist text-river">{icon}</span><span className="min-w-0 flex-1"><strong className="block text-sm text-charcoal">{title}</strong><small className="mt-1 block text-xs leading-5 text-stone">{text}</small></span><ArrowRight size={15} className="mt-1 text-river transition-transform group-hover:translate-x-0.5"/></Link>; }
