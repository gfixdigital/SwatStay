import { NavLink } from "react-router-dom";
import { BarChart3, BookOpenText, CalendarCheck2, CircleDollarSign, CreditCard, FileClock, FolderKanban, HandCoins, Headphones, Images, Languages, LayoutDashboard, MapPinned, Package, PhoneCall, Settings, ShieldCheck, UsersRound, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/bookings", label: "Booking requests", icon: CalendarCheck2 },
  { to: "/call-queue", label: "Call queue", icon: PhoneCall },
  { to: "/packages", label: "Packages", icon: Package },
  { to: "/destinations", label: "Destinations", icon: MapPinned },
  { to: "/providers", label: "Providers", icon: ShieldCheck },
  { to: "/provider-suggestions", label: "Provider suggestions", icon: FolderKanban },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/commissions", label: "Commissions", icon: CircleDollarSign },
  { to: "/payouts", label: "Payouts", icon: HandCoins },
  { to: "/support", label: "Support tickets", icon: Headphones },
  { to: "/content", label: "Website content", icon: BookOpenText },
  { to: "/media", label: "Media library", icon: Images },
  { to: "/languages", label: "Languages", icon: Languages },
  { to: "/team", label: "Team members", icon: UsersRound },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/audit-logs", label: "Audit logs", icon: FileClock },
];

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <><div className={`fixed inset-0 z-30 bg-charcoal/35 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose}/><aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#284a3e] bg-pine text-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex h-16 items-center justify-between border-b border-white/10 px-5"><div><strong className="text-xl">Swat<span className="text-[#8bc9aa]">Stay</span></strong><small className="block text-[10px] font-semibold tracking-[.14em] text-[#a8cabb]">ADMIN OPERATIONS</small></div><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md text-white/80 hover:bg-white/10 lg:hidden" aria-label="Close navigation"><X size={18}/></button></div><nav className="flex-1 space-y-1 overflow-y-auto p-3">{navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold ${isActive ? "bg-white text-pine" : "text-[#d7e8df] hover:bg-white/10 hover:text-white"}`}><Icon size={17}/>{label}</NavLink>)}</nav><div className="border-t border-white/10 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-sm font-bold">AK</span><div><strong className="block text-sm">Asim Khan</strong><small className="text-xs text-[#a8cabb]">Operations admin</small></div></div><div className="mt-3 flex items-center gap-2 text-xs text-[#a8cabb]"><BarChart3 size={14}/> Static dashboard preview</div></div></aside></>;
}
