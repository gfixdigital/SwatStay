import { CalendarClock, CheckCircle2, Eye, MessageSquarePlus, PhoneCall, RefreshCcw, XCircle } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminModal } from "../components/AdminModal";
import { AdminToast } from "../components/AdminToast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { FilterBar } from "../components/FilterBar";
import { PageHeader } from "../components/PageHeader";
import { SearchInput } from "../components/SearchInput";
import { StatusBadge } from "../components/StatusBadge";
import { Timeline } from "../components/Timeline";
import { tripChangeRequests as initialRequests } from "../data/tripChangeRequests";
import { useBookingsPreview } from "../hooks/useBookingsPreview";
import type { TripChangeRequest, TripChangeStatus, TripChangeType } from "../types/admin";

type Decision = "approve" | "reject" | "apply" | null;
const changeTypes: TripChangeType[] = ["Change travel date", "Change pickup city", "Add traveler", "Upgrade package", "Add activity", "Cancel trip", "Other"];

export function TripChangeRequestsPage() {
  const { id } = useParams();
  const { updateBooking } = useBookingsPreview();
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [callbackAt, setCallbackAt] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [logAction, setLogAction] = useState("Tourist called");
  const [logNote, setLogNote] = useState("");
  const [decision, setDecision] = useState<Decision>(null);
  const [toast, setToast] = useState("");

  const selected = requests.find((request) => request.id === selectedId) ?? null;
  const visible = useMemo(() => requests.filter((request) => {
    const query = search.toLowerCase();
    return (!id || request.bookingId === id)
      && (!query || `${request.id} ${request.bookingReference} ${request.touristName} ${request.phone}`.toLowerCase().includes(query))
      && (status === "All" || request.status === status)
      && (type === "All" || request.changeType === type);
  }), [requests, id, search, status, type]);

  function openRequest(request: TripChangeRequest) {
    setSelectedId(request.id);
    setCallbackAt(request.preferredCallbackAt);
    setResolutionNote(request.resolutionNote);
    setLogAction("Tourist called");
    setLogNote("");
  }

  function updateRequest(idToUpdate: string, changes: Partial<TripChangeRequest>, log?: { action: string; note: string }) {
    setRequests((current) => current.map((request) => request.id === idToUpdate ? {
      ...request,
      ...changes,
      logs: log ? [...request.logs, { id: `log-${Date.now()}`, actor: "Current admin", action: log.action, note: log.note, time: "Just now" }] : request.logs,
    } : request));
  }

  function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const nextStatus: TripChangeStatus = selected.status === "New" ? "Under review" : selected.status;
    updateRequest(selected.id, { preferredCallbackAt: callbackAt, resolutionNote, status: nextStatus }, { action: "Review details updated", note: resolutionNote || "Callback and review details saved." });
    setToast(`${selected.id} review details saved.`);
  }

  function addLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !logNote.trim()) return;
    const nextStatus: TripChangeStatus = logAction === "Callback scheduled" ? "Callback scheduled" : selected.status === "New" ? "Under review" : selected.status;
    updateRequest(selected.id, { status: nextStatus }, { action: logAction, note: logNote.trim() });
    setLogNote("");
    setToast(`Activity added to ${selected.id}.`);
  }

  function confirmDecision() {
    if (!selected || !decision) return;
    if (decision !== "apply" && !resolutionNote.trim()) { setToast("Add a resolution note before making a decision."); setDecision(null); return; }
    if (decision === "approve") {
      updateRequest(selected.id, { status: "Approved", resolutionNote }, { action: "Request approved", note: resolutionNote });
      setToast(`${selected.id} approved. Apply it to the booking when provider impact is confirmed.`);
    }
    if (decision === "reject") {
      updateRequest(selected.id, { status: "Rejected", resolutionNote }, { action: "Request rejected", note: resolutionNote });
      setToast(`${selected.id} rejected with a recorded reason.`);
    }
    if (decision === "apply") {
      updateRequest(selected.id, { status: "Applied" }, { action: "Change applied to booking", note: applicationNote(selected) });
      updateBooking(selected.bookingId, (booking) => {
        if (selected.changeType === "Change travel date") return { ...booking, travelStartDate: selected.requestedValue, lastContactAttempt: "Travel-date change applied just now" };
        if (selected.changeType === "Change pickup city") return { ...booking, pickupCity: selected.requestedValue, lastContactAttempt: "Pickup-city change applied just now" };
        if (selected.changeType === "Add traveler") return { ...booking, travelers: booking.travelers + 1, lastContactAttempt: "Traveler-count change applied just now" };
        if (selected.changeType === "Cancel trip") return { ...booking, status: "Cancelled", lastContactAttempt: "Trip cancellation applied just now" };
        return { ...booking, specialRequests: `${booking.specialRequests}\nApproved change: ${selected.changeType} · ${selected.requestedValue}`, lastContactAttempt: "Trip change applied just now" };
      });
      setToast(`${selected.id} applied to ${selected.bookingReference} in frontend state.`);
    }
    setDecision(null);
  }

  return <>
    <PageHeader eyebrow="TRAVELER CHANGE CONTROL" title={id ? "Booking change requests" : "Trip change requests"} description="Review requested changes, contact the tourist, record decisions, and apply approved changes to the existing booking preview." actions={id ? <Link to={`/bookings/${id}`} className="button-secondary">Back to booking</Link> : undefined}/>

    <FilterBar resultText={`${visible.length} change request${visible.length === 1 ? "" : "s"}`} onClear={() => { setSearch(""); setStatus("All"); setType("All"); }}><SearchInput value={search} onChange={setSearch} placeholder="Request, booking, tourist, or phone"/><select className="field" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{["New", "Callback scheduled", "Under review", "Approved", "Rejected", "Applied"].map((value) => <option key={value}>{value}</option>)}</select><select className="field" value={type} onChange={(event) => setType(event.target.value)}><option>All</option>{changeTypes.map((value) => <option key={value}>{value}</option>)}</select></FilterBar>

    {visible.length ? <div className="overflow-hidden rounded-lg border border-border bg-white"><div className="divide-y divide-border">{visible.map((request) => <article key={request.id} className="grid gap-3 p-4 lg:grid-cols-[150px_1fr_180px_170px_auto] lg:items-center"><div><span className="text-xs font-bold text-river">{request.id}</span><Link to={`/bookings/${request.bookingId}`} className="mt-1 block text-sm font-semibold text-charcoal hover:text-river">{request.bookingReference}</Link></div><div><h2 className="font-bold text-charcoal">{request.changeType}</h2><p className="mt-1 text-sm text-stone">{request.touristName} · {request.requestedValue}</p></div><div className="text-xs text-stone"><span className="block">Callback</span><strong className="mt-1 block text-charcoal">{formatDateTime(request.preferredCallbackAt)}</strong></div><div><StatusBadge status={request.status}/><span className="mt-2 block text-xs text-stone">{request.assignedTo} · {request.priority}</span></div><button type="button" className="button-secondary" onClick={() => openRequest(request)}><Eye size={15}/> Review</button></article>)}</div></div> : <EmptyState title="No change requests found" text="No traveler requests match the current booking or filters."/>}

    <AdminModal open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected ? `${selected.id} · ${selected.changeType}` : "Trip change request"} description={selected ? `${selected.bookingReference} · ${selected.touristName}` : undefined} width="max-w-5xl">
      {selected && <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-5">
          <section className="rounded-lg border border-border"><div className="border-b border-border bg-mist p-3"><h3 className="text-sm font-bold text-charcoal">Requested booking change</h3></div><dl className="grid gap-3 p-4 sm:grid-cols-2"><Detail label="Current booking value" value={selected.currentValue}/><Detail label="Requested value" value={selected.requestedValue}/><Detail label="Preferred callback" value={formatDateTime(selected.preferredCallbackAt)}/><Detail label="Assigned support" value={selected.assignedTo}/></dl><div className="border-t border-border p-4"><span className="text-xs font-semibold text-stone">Traveler message</span><p className="mt-1 text-sm leading-6 text-charcoal">{selected.message}</p></div></section>

          <form onSubmit={saveReview} className="rounded-lg border border-border p-4"><h3 className="text-sm font-bold text-charcoal">Review and callback details</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="label">Preferred callback<input type="datetime-local" className="field mt-1.5" value={callbackAt} onChange={(event) => setCallbackAt(event.target.value)} required/></label><label className="label sm:col-span-2">Resolution or impact note<textarea className="field mt-1.5 min-h-24 resize-y py-3" value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} placeholder="Record availability, price, provider, or cancellation impact"/></label></div><button className="button-secondary mt-3"><RefreshCcw size={15}/> Save review details</button></form>

          <form onSubmit={addLog} className="rounded-lg border border-border p-4"><h3 className="text-sm font-bold text-charcoal">Add contact or decision log</h3><div className="mt-4 grid gap-4 sm:grid-cols-[190px_1fr]"><select className="field" value={logAction} onChange={(event) => setLogAction(event.target.value)}><option>Tourist called</option><option>No answer</option><option>WhatsApp sent</option><option>Callback scheduled</option><option>Provider checked</option><option>Price impact reviewed</option></select><textarea className="field min-h-20 resize-y py-3" value={logNote} onChange={(event) => setLogNote(event.target.value)} placeholder="What happened and what is next?" required/></div><button className="button-secondary mt-3"><MessageSquarePlus size={15}/> Add activity log</button></form>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4"><a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="button-secondary"><PhoneCall size={15}/> Call tourist</a><button type="button" className="button-primary" disabled={selected.status === "Applied" || selected.status === "Rejected"} onClick={() => setDecision("approve")}><CheckCircle2 size={15}/> Approve request</button><button type="button" className="button-secondary text-[#9c3f2e]" disabled={selected.status === "Applied" || selected.status === "Rejected"} onClick={() => setDecision("reject")}><XCircle size={15}/> Reject request</button><button type="button" className="button-secondary ml-auto" disabled={selected.status !== "Approved"} onClick={() => setDecision("apply")}><RefreshCcw size={15}/> Apply to booking</button></div>
        </div>

        <aside className="space-y-5"><section className="rounded-lg border border-border p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-charcoal">Request status</h3><StatusBadge status={selected.status}/></div><p className="mt-3 text-sm leading-6 text-stone">{statusExplanation(selected.status)}</p>{selected.status === "Approved" && <p className="mt-3 rounded-md border border-[#ecd3ad] bg-[#fbf3e6] p-3 text-xs leading-5 text-[#925d19]">Approved does not alter the booking. Use Apply to booking after final provider and price checks.</p>}{selected.status === "Applied" && <p className="mt-3 rounded-md border border-[#bdd5c7] bg-[#e8f1ec] p-3 text-xs leading-5 text-pine">{applicationNote(selected)}</p>}</section><section className="rounded-lg border border-border p-4"><h3 className="mb-4 text-sm font-bold text-charcoal">Complete request log</h3><Timeline items={selected.logs.map((log) => ({ title: `${log.action} · ${log.actor}`, detail: log.note, time: log.time, complete: true }))}/></section></aside>
      </div>}
    </AdminModal>

    <ConfirmDialog open={Boolean(decision)} title={decision === "approve" ? "Approve this change request?" : decision === "reject" ? "Reject this change request?" : "Apply this change to the booking?"} message={decision === "apply" ? `This updates ${selected?.bookingReference ?? "the booking"} with the approved value in frontend state and records the action in the request log.` : "The decision and resolution note will be recorded in the complete request log."} confirmLabel={decision === "approve" ? "Approve request" : decision === "reject" ? "Reject request" : "Apply change"} danger={decision === "reject"} onConfirm={confirmDecision} onClose={() => setDecision(null)}/>
    <AdminToast message={toast} onClose={() => setToast("")}/>
  </>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-md bg-snow p-3"><dt className="text-xs text-stone">{label}</dt><dd className="mt-1 text-sm font-semibold leading-5 text-charcoal">{value}</dd></div>; }
function formatDateTime(value: string) { return value ? new Date(value).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }) : "Not requested"; }
function applicationNote(request: TripChangeRequest) { return request.changeType === "Cancel trip" ? `Booking ${request.bookingReference} marked cancelled in frontend state.` : `${request.changeType} applied: ${request.requestedValue}.`; }
function statusExplanation(status: TripChangeStatus) { const messages: Record<TripChangeStatus, string> = { New: "The request has not been reviewed by the operations team.", "Callback scheduled": "A callback time is recorded and the tourist still needs confirmation.", "Under review": "The team is checking availability, price, provider, or itinerary impact.", Approved: "The request is approved but has not yet changed the booking record.", Rejected: "The request cannot be applied. The reason is stored in the resolution note and log.", Applied: "The approved change has been written to the booking preview and logged." }; return messages[status]; }
