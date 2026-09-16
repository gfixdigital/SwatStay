import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3, BookOpenText, CalendarCheck2, ChevronDown, CircleDollarSign, CreditCard,
  FileClock, FolderKanban, HandCoins, Headphones, Images, Languages, LayoutDashboard,
  Mail, MapPinned, Package, PhoneCall, QrCode, RefreshCcw, Settings, ShieldCheck, UsersRound, X,
} from "lucide-react";
import type { AdminTeamRole } from "../types/admin";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; roles: AdminTeamRole[] };
type NavGroup = { id: string; label: string; items: NavItem[] };

const allRoles: AdminTeamRole[] = ["Admin", "Operations", "Support", "Finance", "QA"];
const operationsRoles: AdminTeamRole[] = ["Admin", "Operations", "Support", "QA"];
const financeRoles: AdminTeamRole[] = ["Admin", "Finance", "Operations", "QA"];

const navGroups: NavGroup[] = [
  { id: "workflow", label: "Booking workflow", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true, roles: allRoles },
    { to: "/bookings", label: "1. Booking inbox", icon: CalendarCheck2, roles: operationsRoles },
    { to: "/call-queue", label: "2. Call confirmation", icon: PhoneCall, roles: ["Admin", "Operations", "Support"] },
    { to: "/payments", label: "3. Payment review", icon: CreditCard, roles: financeRoles },
    { to: "/provider-suggestions", label: "4. Provider assignment", icon: FolderKanban, roles: ["Admin", "Operations"] },
    { to: "/vouchers", label: "5. Active trip voucher", icon: QrCode, roles: operationsRoles },
    { to: "/support", label: "6. Support and close", icon: Headphones, roles: ["Admin", "Operations", "Support", "QA"] },
  ] },
  { id: "customers", label: "Customer operations", items: [
    { to: "/customers", label: "Customers", icon: UsersRound, roles: allRoles },
    { to: "/trips", label: "All trips", icon: CalendarCheck2, roles: allRoles },
  ] },
  { id: "catalog", label: "Tour catalog", items: [
    { to: "/packages", label: "Packages", icon: Package, roles: ["Admin", "Operations"] },
    { to: "/destinations", label: "Destinations", icon: MapPinned, roles: ["Admin", "Operations"] },
  ] },
  { id: "providers", label: "Provider network", items: [
    { to: "/providers", label: "Providers", icon: ShieldCheck, roles: ["Admin", "Operations", "QA"] },
    { to: "/providers/approvals", label: "Provider approvals", icon: UsersRound, roles: ["Admin", "Operations", "QA"] },
    { to: "/provider-suggestions", label: "Provider suggestions", icon: FolderKanban, roles: ["Admin", "Operations"] },
  ] },
  { id: "finance", label: "Finance and settlement", items: [
    { to: "/commissions", label: "Commissions", icon: CircleDollarSign, roles: financeRoles },
    { to: "/payouts", label: "Payouts", icon: HandCoins, roles: financeRoles },
  ] },
  { id: "experience", label: "Customer experience", items: [
    { to: "/contact-inbox", label: "Contact inbox", icon: Mail, roles: ["Admin", "Operations", "Support"] },
    { to: "/content", label: "Website content", icon: BookOpenText, roles: ["Admin", "Operations", "QA"] },
    { to: "/promotions", label: "Promotions", icon: RefreshCcw, roles: ["Admin", "Operations"] },
    { to: "/reviews", label: "Trip reviews", icon: BarChart3, roles: ["Admin", "Operations", "Support"] },
    { to: "/legal", label: "Legal content", icon: FileClock, roles: ["Admin", "Operations", "QA"] },
    { to: "/media", label: "Media library", icon: Images, roles: ["Admin", "Operations", "QA"] },
    { to: "/languages", label: "Languages", icon: Languages, roles: ["Admin", "Operations", "QA"] },
  ] },
  { id: "administration", label: "Administration", items: [
    { to: "/team", label: "Team members", icon: UsersRound, roles: ["Admin"] },
    { to: "/settings", label: "Settings", icon: Settings, roles: ["Admin"] },
    { to: "/audit-logs", label: "Audit logs", icon: FileClock, roles: ["Admin", "QA"] },
  ] },
];

// Backend auth will provide this role later. Admin intentionally sees every work area in this preview.
const currentRole: AdminTeamRole = "Admin";

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const availableGroups = useMemo(() => navGroups.map((group) => ({ ...group, items: group.items.filter((item) => item.roles.includes(currentRole)) })).filter((group) => group.items.length), []);
  const activeGroup = availableGroups.find((group) => group.items.some((item) => item.end ? location.pathname === item.to : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)))?.id ?? "operations";
  const [expanded, setExpanded] = useState<string[]>([activeGroup]);

  useEffect(() => setExpanded((current) => current.includes(activeGroup) ? current : [...current, activeGroup]), [activeGroup]);

  function toggleGroup(groupId: string) {
    setExpanded((current) => current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId]);
  }

  return <>
    <div className={`fixed inset-0 z-30 bg-charcoal/35 backdrop-blur-[1px] lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose}/>
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#284a3e] bg-pine text-white shadow-2xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5"><div><strong className="text-xl">Swat<span className="text-[#8bc9aa]">Stay</span></strong><small className="block text-[10px] font-semibold tracking-[.14em] text-[#a8cabb]">ADMIN OPERATIONS</small></div><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md text-white/80 hover:bg-white/10 lg:hidden" aria-label="Close navigation"><X size={18}/></button></div>
      <div className="border-b border-white/10 px-4 py-3"><div className="flex items-center justify-between rounded-md bg-white/10 px-3 py-2"><div><span className="block text-[10px] font-semibold uppercase tracking-[.1em] text-[#a8cabb]">Access view</span><strong className="text-sm">{currentRole}</strong></div><ShieldCheck size={17} className="text-[#8bc9aa]"/></div></div>

      <nav className="admin-nav-scroll min-h-0 flex-1 overflow-y-auto px-3 py-2" aria-label="Admin navigation">
        {availableGroups.map((group) => {
          const isExpanded = expanded.includes(group.id);
          const containsActive = group.id === activeGroup;
          return <section key={group.id} className="border-b border-white/10 py-1.5 last:border-0">
            <button type="button" onClick={() => toggleGroup(group.id)} className={`flex min-h-8 w-full items-center justify-between rounded-md px-2 text-left text-[11px] font-bold uppercase tracking-[.08em] transition hover:bg-white/10 ${containsActive ? "text-white" : "text-[#a8cabb]"}`} aria-expanded={isExpanded}><span>{group.label}</span><ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}/></button>
            <div className={`grid transition-[grid-template-rows,opacity] duration-200 ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70"}`}><div className="overflow-hidden"><div className="space-y-1 pb-1 pt-1">{group.items.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `flex min-h-9 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${isActive ? "bg-white text-pine shadow-sm" : "text-[#d7e8df] hover:bg-white/10 hover:text-white"}`}><Icon size={16}/><span className="min-w-0 truncate">{label}</span></NavLink>)}</div></div></div>
          </section>;
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3"><div className="flex items-center gap-3 rounded-md px-2 py-1"><span className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-sm font-bold">AK</span><div className="min-w-0"><strong className="block truncate text-sm">Asim Khan</strong><small className="block text-xs text-[#a8cabb]">Platform admin preview</small></div></div><div className="mt-2 flex items-center gap-2 px-2 text-xs text-[#a8cabb]"><BarChart3 size={14}/>Role-ready navigation</div></div>
    </aside>
  </>;
}
