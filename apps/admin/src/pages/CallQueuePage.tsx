import { FormEvent, useState } from "react";
import { AdminModal } from "../components/AdminModal";
import { CallQueueCard } from "../components/CallQueueCard";
import { PageHeader } from "../components/PageHeader";
import { bookings } from "../data/adminData";
import type { Booking } from "../types/admin";

export function CallQueuePage() {
  const queue = bookings.filter((booking) => booking.status === "Call pending");
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  function saveNotes(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaved(true); }
  const updateStatus = (id: string, status: string) => setStatuses((current) => ({ ...current, [id]: status }));
  return <><PageHeader eyebrow="TOURIST CONFIRMATION" title="Call queue" description="Contact tourists, record practical notes, and update the call outcome in frontend state."/><div className="grid gap-4 xl:grid-cols-2">{queue.map((booking) => <CallQueueCard key={booking.id} booking={booking} callStatus={statuses[booking.id] ?? "Waiting"} onNotes={() => { setSelected(booking); setNotes(booking.callNotes); setSaved(false); }} onConfirm={() => updateStatus(booking.id, "Confirmed")} onNoAnswer={() => updateStatus(booking.id, "No answer")} onCallback={() => updateStatus(booking.id, "Callback scheduled")} onCancel={() => updateStatus(booking.id, "Cancelled")}/>)}</div><AdminModal open={Boolean(selected)} onClose={() => setSelected(null)} title={`Call notes · ${selected?.reference ?? ""}`} description={selected ? `${selected.touristName} · ${selected.phone}` : undefined}>{saved ? <div className="rounded-md border border-[#bdd5c7] bg-[#e8f1ec] p-4 text-sm font-semibold text-pine">Call notes saved in frontend state.</div> : <form onSubmit={saveNotes}><label className="label">Call notes<textarea className="field mt-1.5 min-h-32 resize-y py-3" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Availability, pickup, traveler preferences, and follow-up details" required/></label><label className="label mt-4">Schedule callback<input type="datetime-local" className="field mt-1.5"/></label><button type="submit" className="button-primary mt-4 w-full">Save call notes</button></form>}</AdminModal></>;
}
