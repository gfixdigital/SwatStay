import { useState } from "react";
import { AdminModal } from "../components/AdminModal";
import { PageHeader } from "../components/PageHeader";
import { ProviderApprovalCard } from "../components/ProviderApprovalCard";
import { providers as initialProviders } from "../data/adminData";
import type { Provider } from "../types/admin";

export function ProviderApprovalsPage() {
  const [providers, setProviders] = useState(initialProviders);
  const [selected, setSelected] = useState<Provider | null>(null);
  const updateStatus = (id: string, status: Provider["status"]) => setProviders((current) => current.map((provider) => provider.id === id ? { ...provider, status } : provider));
  return <><PageHeader eyebrow="PROVIDER OPERATIONS" title="Provider approvals" description="Review submitted business details before a provider can receive booking assignments."/><div className="grid gap-4 xl:grid-cols-2">{providers.map((provider) => <ProviderApprovalCard key={provider.id} provider={provider} onView={() => setSelected(provider)} onApprove={() => updateStatus(provider.id, "Approved")} onReject={() => updateStatus(provider.id, "Rejected")}/>)}</div><AdminModal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? "Provider details"} description="Static provider registration preview">{selected && <div className="space-y-4"><dl className="grid grid-cols-2 gap-4 text-sm">{[["Owner", selected.ownerName], ["Service type", selected.serviceType], ["Location", selected.location], ["Phone", selected.phone], ["Capacity", selected.capacity], ["Commission", `${selected.commissionRate}%`], ["Documents", selected.documentsStatus], ["Photos", selected.photosStatus]].map(([label, value]) => <div key={label} className="rounded-md bg-snow p-3"><dt className="text-xs text-stone">{label}</dt><dd className="mt-1 font-semibold text-charcoal">{value}</dd></div>)}</dl><p className="rounded-md border border-[#ecd3ad] bg-[#fbf3e6] p-3 text-sm text-stone">Approval and rejection are local preview actions. No provider account or notification is created.</p></div>}</AdminModal></>;
}
