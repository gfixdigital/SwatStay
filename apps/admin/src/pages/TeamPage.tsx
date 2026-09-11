import { Edit3, LockKeyhole, Plus, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { AdminModal } from "../components/AdminModal";
import { FormField } from "../components/FormField";
import { PageHeader } from "../components/PageHeader";
import { teamMembers as initialMembers } from "../data/teamMembers";
import type { AdminTeamRole } from "../types/admin";

const roles: AdminTeamRole[] = ["Admin", "Operations", "Support", "Finance", "QA"];
const accessPlan: { role: AdminTeamRole; access: string; restriction: string }[] = [
  { role: "Admin", access: "All admin routes, team access, settings, and audit logs", restriction: "No restriction after authenticated authorization" },
  { role: "Operations", access: "Bookings, calls, packages, destinations, providers, assignments, support, content, and media", restriction: "No finance approval or team permission changes" },
  { role: "Support", access: "Dashboard, call queue, booking details, traveler changes, and support tickets", restriction: "No package publishing, provider approval, or finance actions" },
  { role: "Finance", access: "Payments, commissions, payouts, and booking payment summaries", restriction: "No booking cancellation, provider assignment, or content editing" },
  { role: "QA", access: "Read-only workflow and content preview", restriction: "No production status or financial changes" },
];

export function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminTeamRole>("Support");
  const [module, setModule] = useState("Tourist support");

  function openEditor(id?: string) {
    const member = members.find((item) => item.id === id);
    setEditingId(id ?? null);
    setName(member?.name ?? "");
    setEmail(member?.email ?? "");
    setRole(member?.role ?? "Support");
    setModule(member?.assignedModule ?? "Tourist support");
    setOpen(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (editingId) {
      setMembers((current) => current.map((item) => item.id === editingId ? { ...item, name, email, role, assignedModule: module } : item));
    } else {
      setMembers((current) => [...current, { id: `tm-${Date.now()}`, name, email, role, assignedModule: module, activeQueue: 0, status: "Invited" }]);
    }
    setOpen(false);
  }

  return <>
    <PageHeader eyebrow="ACCESS PLANNING" title="Team members" description="Prepare GFix roles and module assignments for future authenticated access control." actions={<button className="button-primary" onClick={() => openEditor()}><Plus size={15}/> Add team member</button>}/>
    <section className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="divide-y divide-border">{members.map((member) => <article key={member.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_180px_100px_auto] md:items-center"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-mist text-river"><UserRound size={17}/></span><span><strong className="block text-sm text-charcoal">{member.name}</strong><small className="text-xs text-stone">{member.email}</small></span></div><span className="text-sm font-semibold text-charcoal">{member.role}</span><span className="text-sm text-stone">{member.assignedModule}</span><span className="rounded-md bg-snow px-2 py-1 text-center text-xs font-semibold text-stone">{member.status}</span><button className="button-secondary" onClick={() => openEditor(member.id)}><Edit3 size={15}/> Edit role</button></article>)}</div>
    </section>

    <section className="panel mt-5">
      <div className="panel-header"><div><div className="flex items-center gap-2"><LockKeyhole size={17} className="text-river"/><h2 className="panel-title">Planned role access</h2></div><p className="panel-subtitle">Reference only. No permissions are enforced until authentication and API guards are connected.</p></div></div>
      <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border bg-mist text-xs uppercase text-stone"><tr><th className="px-4 py-3">Role</th><th className="px-4 py-3">Panel access</th><th className="px-4 py-3">Restriction</th></tr></thead><tbody className="divide-y divide-border">{accessPlan.map((item) => <tr key={item.role}><td className="px-4 py-3 font-bold text-charcoal">{item.role}</td><td className="px-4 py-3 text-stone">{item.access}</td><td className="px-4 py-3 text-stone">{item.restriction}</td></tr>)}</tbody></table></div>
      <div className="divide-y divide-border md:hidden">{accessPlan.map((item) => <article key={item.role} className="p-4"><h3 className="font-bold text-charcoal">{item.role}</h3><p className="mt-2 text-sm leading-5 text-stone">{item.access}</p><p className="mt-2 text-xs leading-5 text-[#8a4f22]">{item.restriction}</p></article>)}</div>
    </section>

    <AdminModal open={open} onClose={() => setOpen(false)} title={editingId ? "Edit team member" : "Add team member"} description="Frontend-only access setup">
      <form onSubmit={save} className="grid gap-4"><FormField label="Name"><input className="field mt-1.5" value={name} onChange={(event) => setName(event.target.value)} required/></FormField><FormField label="Email"><input type="email" className="field mt-1.5" value={email} onChange={(event) => setEmail(event.target.value)} required/></FormField><FormField label="Role"><select className="field mt-1.5" value={role} onChange={(event) => setRole(event.target.value as AdminTeamRole)}>{roles.map((value) => <option key={value}>{value}</option>)}</select></FormField><FormField label="Assigned module"><input className="field mt-1.5" value={module} onChange={(event) => setModule(event.target.value)}/></FormField><button className="button-primary">Save team member</button></form>
    </AdminModal>
  </>;
}
