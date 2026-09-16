import { FormEvent, useState } from "react";
import { AdminModal } from "../components/AdminModal";
import { CallQueueCard } from "../components/CallQueueCard";
import { PageHeader } from "../components/PageHeader";
import { teamMembers } from "../data/adminData";
import { useBookingsPreview } from "../hooks/useBookingsPreview";
import type { Booking } from "../types/admin";

export function CallQueuePage() {
  const { bookings, updateBooking } = useBookingsPreview();
  const [owner, setOwner] = useState("All assigned members");
  const queue = bookings.filter((booking) => booking.status === "Call pending" && (owner === "All assigned members" || booking.assignedSupportMember === owner));
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  function saveNotes(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (selected) updateBooking(selected.id, { callNotes: notes }); setSaved(true); }
  const updateStatus = (id: string, status: string) => { setStatuses((current) => ({ ...current, [id]: status })); if (status === "Confirmed") updateBooking(id, { status: "Tourist confirmed", lastContactAttempt: "Call confirmed just now" }); if (status === "Cancelled") updateBooking(id, { status: "Cancelled", lastContactAttempt: "Call outcome: cancelled" }); };
  return <><PageHeader eyebrow="STEP 2 · TOURIST CONFIRMATION" title="Call queue" description="A booking belongs to its assigned support owner. Use the member filter to review one person's queue in this admin preview."/><div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-white p-3"><span className="text-sm text-stone">{queue.length} call{queue.length === 1 ? "" : "s"} in this queue</span><label className="text-xs font-semibold text-stone">Assigned member<select value={owner} onChange={(event) => setOwner(event.target.value)} className="field ml-2 w-48 text-sm"><option>All assigned members</option>{teamMembers.map((member) => <option key={member.id}>{member.name}</option>)}</select></label></div><div className="grid gap-4 xl:grid-cols-2">{queue.map((booking) => <CallQueueCard key={booking.id} booking={booking} callStatus={statuses[booking.id] ?? "Waiting"} onNotes={() => { setSelected(booking); setNotes(booking.callNotes); setSaved(false); }} onConfirm={() => updateStatus(booking.id, "Confirmed")} onNoAnswer={() => updateStatus(booking.id, "No answer")} onCallback={() => updateStatus(booking.id, "Callback scheduled")} onCancel={() => updateStatus(booking.id, "Cancelled")}/>)}</div><AdminModal open={Boolean(selected)} onClose={() => setSelected(null)} title={`Call notes · ${selected?.reference ?? ""}`} description={selected ? `${selected.touristName} · ${selected.phone}` : undefined}>{saved ? <div className="rounded-md border border-[#bdd5c7] bg-[#e8f1ec] p-4 text-sm font-semibold text-pine">Call notes saved in frontend state.</div> : <form onSubmit={saveNotes}><label className="label">Call notes<textarea className="field mt-1.5 min-h-32 resize-y py-3" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Availability, pickup, traveler preferences, and follow-up details" required/></label><label className="label mt-4">Schedule callback<input type="datetime-local" className="field mt-1.5"/></label><button type="submit" className="button-primary mt-4 w-full">Save call notes</button></form>}</AdminModal></>;
}
