import { Check, FileText, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import { AdminModal } from "../components/AdminModal";
import { PageHeader } from "../components/PageHeader";
import { ProviderApprovalCard } from "../components/ProviderApprovalCard";
import { providers as initialProviders } from "../data/adminData";
import { usePreviewState } from "../hooks/usePreviewState";
import type { Provider } from "../types/admin";

type ReviewLog = { providerId: string; action: string; reason: string; at: string };

export function ProviderApprovalsPage() {
  const [providers, setProviders] = usePreviewState("swatstay.admin.providers.preview", initialProviders);
  const [logs, setLogs] = usePreviewState<ReviewLog[]>("swatstay.admin.provider-review-log.preview", []);
  const [selected, setSelected] = useState<Provider | null>(null);
  const [decision, setDecision] = useState<"Approved" | "Rejected" | null>(null);
  const [reason, setReason] = useState("");
  const openDecision = (provider: Provider, next: "Approved" | "Rejected") => { setSelected(provider); setDecision(next); setReason(""); };
  const confirmDecision = () => {
    if (!selected || !decision || (decision === "Rejected" && !reason.trim())) return;
    setProviders((current) => current.map((provider) => provider.id === selected.id ? { ...provider, status: decision } : provider));
    setLogs((current) => [{ providerId: selected.id, action: decision, reason: reason.trim() || "Provider documents and photos reviewed.", at: "Just now" }, ...current]);
    setSelected(null); setDecision(null);
  };
  return <><PageHeader eyebrow="PROVIDER OPERATIONS" title="Provider approvals" description="Review document, photo, capacity, and commission information before a provider can receive assignments."/>
    <div className="grid gap-4 xl:grid-cols-2">{providers.map((provider) => <ProviderApprovalCard key={provider.id} provider={provider} onView={() => { setSelected(provider); setDecision(null); }} onApprove={() => openDecision(provider, "Approved")} onReject={() => openDecision(provider, "Rejected")}/>)}</div>
    <AdminModal open={Boolean(selected)} onClose={() => { setSelected(null); setDecision(null); }} title={decision ? `${decision === "Approved" ? "Approve" : "Reject"} provider` : selected?.name ?? "Provider details"} description="Frontend-only review record">{selected ? (decision ? <div className="space-y-4"><div className="rounded-md border border-border bg-snow p-3 text-sm text-stone">{decision === "Approved" ? "Confirm that the visible business details, documents, photos, capacity, and commission are ready for operations review." : "A rejection reason is required so the provider knows what must be corrected."}</div><label className="label">{decision === "Rejected" ? "Rejection reason" : "Approval note"}<textarea className="field mt-1.5 min-h-24 py-3" required={decision === "Rejected"} value={reason} onChange={(event) => setReason(event.target.value)} placeholder={decision === "Rejected" ? "Missing document, photo, price, or compliance information" : "Optional review note"}/></label><button type="button" disabled={decision === "Rejected" && !reason.trim()} onClick={confirmDecision} className="button-primary w-full">{decision === "Approved" ? <Check size={15}/> : <X size={15}/>} Confirm {decision.toLowerCase()}</button></div> : <ProviderReviewDetail provider={selected} logs={logs} onApprove={() => openDecision(selected, "Approved")} onReject={() => openDecision(selected, "Rejected")}/>) : null}</AdminModal>
  </>;
}

function ProviderReviewDetail({ provider, logs, onApprove, onReject }: { provider: Provider; logs: ReviewLog[]; onApprove: () => void; onReject: () => void }) { const history = logs.filter((log) => log.providerId === provider.id); return <div className="space-y-4"><dl className="grid grid-cols-2 gap-4 text-sm">{[["Owner", provider.ownerName], ["Service type", provider.serviceType], ["Location", provider.location], ["Phone", provider.phone], ["Capacity", provider.capacity], ["Commission", `${provider.commissionRate}%`], ["Documents", provider.documentsStatus], ["Photos", provider.photosStatus]].map(([label, value]) => <div key={label} className="rounded-md bg-snow p-3"><dt className="text-xs text-stone">{label}</dt><dd className="mt-1 font-semibold text-charcoal">{value}</dd></div>)}</dl><section className="rounded-md border border-border p-3"><h3 className="flex items-center gap-2 text-sm font-bold text-charcoal"><FileText size={15}/> Review history</h3>{history.length ? <div className="mt-3 space-y-2">{history.map((log, index) => <p key={`${log.action}-${index}`} className="text-xs text-stone"><strong className="text-charcoal">{log.action}</strong> · {log.reason} · {log.at}</p>)}</div> : <p className="mt-2 text-xs text-stone">No frontend review decisions recorded yet.</p>}</section>{provider.status === "Pending review" && <div className="flex gap-2"><button type="button" className="button-secondary text-[#9c3f2e]" onClick={onReject}><ShieldAlert size={15}/> Reject</button><button type="button" className="button-primary ml-auto" onClick={onApprove}><Check size={15}/> Approve</button></div>}</div>; }
