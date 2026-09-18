import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  LifeBuoy,
  PhoneCall,
  QrCode,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { BookingWorkflow } from "../components/BookingWorkflow";
import { PaymentBadge } from "../components/PaymentBadge";
import { StatusBadge } from "../components/StatusBadge";
import { formatPkr } from "../data/adminData";
import { useBookingsPreview } from "../hooks/useBookingsPreview";
import { workflowBlockReason } from "../lib/bookingWorkflow";
import type { Booking, BookingAssignmentLog, BookingStatus, PaymentStatus } from "../types/admin";

export function BookingDetailPage() {
  const { id } = useParams();
  const { bookings, updateBooking, assignBooking, teamMembers } = useBookingsPreview();
  const booking = bookings.find((item) => item.id === id);
  const [status, setStatus] = useState<BookingStatus>(
    booking?.status ?? "Call pending",
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    booking?.paymentStatus ?? "Pending proof",
  );
  const [notes, setNotes] = useState(booking?.callNotes ?? "");
  const [saved, setSaved] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [assignedMember, setAssignedMember] = useState(booking?.assignedSupportMember ?? "Unassigned");
  const [assignmentReason, setAssignmentReason] = useState("");
  const [assignmentHistory, setAssignmentHistory] = useState<BookingAssignmentLog[]>(booking?.assignmentHistory ?? []);

  useEffect(() => {
    setAssignedMember(booking?.assignedSupportMember ?? "Unassigned");
    setAssignmentHistory(booking?.assignmentHistory ?? []);
    setAssignmentReason("");
    setStatus(booking?.status ?? "Call pending");
    setPaymentStatus(booking?.paymentStatus ?? "Pending proof");
  }, [booking?.id, booking?.paymentStatus, booking?.status]);
  if (!booking)
    return (
      <>
        <Link to="/bookings" className="text-link mb-4">
          <ArrowLeft size={14} /> Back to bookings
        </Link>
        <EmptyState
          title="Booking not found"
          text="This static booking reference is not available in the sample data."
        />
      </>
    );
  const remaining = booking.totalAmount - booking.amountPaid;
  const providerGate = workflowBlockReason({ ...booking, status, paymentStatus }, "providers");

  function changeStatus(next: BookingStatus, message: string) {
    setStatus(next);
    updateBooking(booking!.id, { status: next });
    setActionMessage(message);
  }

  function saveAssignment(event: React.FormEvent) {
    event.preventDefault();
    const previousMember = booking!.assignedSupportMember || "Unassigned";
    if (assignedMember === previousMember) {
      setActionMessage("Choose a different team member or unassign this booking before saving.");
      return;
    }
    const entry: BookingAssignmentLog = {
      id: `assignment-${Date.now()}`,
      previousMember,
      assignedMember,
      reason: assignmentReason.trim(),
      assignedBy: "Asim Khan",
      assignedAt: new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date()),
    };
    const nextHistory = [...assignmentHistory, entry];
    const member = teamMembers.find((entry) => entry.fullName === assignedMember);
    if (!member) {
      setActionMessage("Select an active team member loaded from the server.");
      return;
    }
    assignBooking(booking!.id, member.id, assignmentReason.trim());
    updateBooking(booking!.id, { assignedSupportMember: assignedMember, assignmentHistory: nextHistory });
    setAssignmentHistory(nextHistory);
    setAssignmentReason("");
    setActionMessage(assignedMember === "Unassigned" ? "Booking removed from the team queue in frontend state." : `Booking assigned to ${assignedMember} in frontend state.`);
  }
  return (
    <>
      <div className="mb-5">
        <Link to="/bookings" className="text-link">
          <ArrowLeft size={14} /> Back to bookings
        </Link>
        <div className="mt-3 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-river">
                {booking.reference}
              </span>
              <StatusBadge status={status} />
              <PaymentBadge status={paymentStatus} />
            </div>
            <h1 className="mt-2 text-2xl font-bold text-charcoal md:text-3xl">
              {booking.touristName}
            </h1>
            <p className="mt-1 text-sm text-stone">
              Created {booking.createdAt} · Assigned to {assignedMember}
            </p>
          </div>
          {providerGate ? <Link to="/payments" className="button-secondary">Complete payment step first</Link> : <Link to={`/bookings/${booking.id}/provider-suggestions`} className="button-primary"><Send size={15} /> Open provider selection</Link>}
        </div>
      </div>
      {actionMessage && (
        <div className="mb-4 rounded-md border border-[#bdd5c7] bg-[#e8f1ec] p-3 text-sm font-semibold text-pine">
          {actionMessage}
        </div>
      )}
      <BookingWorkflow booking={{ ...booking, status, paymentStatus, assignedSupportMember: assignedMember }}/>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-5">
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Tourist and trip details</h2>
                <p className="panel-subtitle">
                  Request information supplied by the tourist
                </p>
              </div>
            </div>
            <div className="grid gap-5 p-4 md:grid-cols-2">
              <DetailGroup
                title="Tourist details"
                icon={<UserRound size={17} />}
                rows={[
                  ["Full name", booking.touristName],
                  ["Phone", booking.phone],
                  ["Email", booking.email],
                  ["Country", booking.country],
                  ["Language", booking.preferredLanguage],
                ]}
              />
              <DetailGroup
                title="Package details"
                icon={<CalendarDays size={17} />}
                rows={[
                  ["Package", booking.packageName],
                  ["Destination", booking.destination],
                  [
                    "Travel dates",
                    `${booking.travelStartDate} to ${booking.travelEndDate}`,
                  ],
                  ["Travelers", String(booking.travelers)],
                  ["Pickup city", booking.pickupCity],
                ]}
              />
            </div>
            <div className="border-t border-border p-4">
              <h3 className="text-sm font-semibold text-charcoal">
                Special requests
              </h3>
              <p className="mt-2 rounded-md bg-snow p-3 text-sm leading-6 text-stone">
                {booking.specialRequests}
              </p>
            </div>
          </section>
          <section className="grid gap-5 lg:grid-cols-2">
            <CallPanel booking={booking} status={status} />
            <PaymentPanel
              booking={booking}
              status={paymentStatus}
              remaining={remaining}
            />
          </section>
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Provider assignment summary</h2>
                <p className="panel-subtitle">
                  Saved provider selections for this booking preview
                </p>
              </div>
              {providerGate ? <span className="text-xs text-[#925d19]">Provider selection locked until payment is verified</span> : <Link to={`/bookings/${booking.id}/provider-suggestions`} className="text-link">Manage suggestions</Link>}
            </div>
            <div className="divide-y divide-border">
              {(booking.providerArrangements?.length ? booking.providerArrangements.map((item) => [item.serviceType, item.providerName, item.status]) : [
                ["Hotel", "Not selected", "Pending"],
                ["Transport", "Not selected", "Pending"],
                ["Guide", "Not selected", "Pending"],
                ["Restaurant", "Not selected", "Pending"],
              ]).map(([type, provider, assignment]) => (
                <div
                  key={type}
                  className="grid grid-cols-[90px_1fr_auto] items-center gap-3 px-4 py-3 text-sm"
                >
                  <strong className="text-charcoal">{type}</strong>
                  <span className="truncate text-stone">{provider}</span>
                  <StatusBadge
                    status={assignment === "Selected" || assignment === "Confirmed" ? "Selected" : "Pending"}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Internal notes</h2>
                <p className="panel-subtitle">
                  Visible only to the operations team in the future system
                </p>
              </div>
            </div>
            <div className="p-4">
              <textarea
                className="field min-h-28 resize-y py-3"
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setSaved(false);
                }}
                placeholder="Add call, payment, or provider notes"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-stone">
                  {saved
                    ? "Notes saved in frontend state"
                    : "Static preview only"}
                </span>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setSaved(true)}
                >
                  Save notes
                </button>
              </div>
            </div>
          </section>
        </div>
        <aside className="space-y-5">
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Assign team member</h2>
                <p className="panel-subtitle">Sets the owner responsible for tourist follow-up.</p>
              </div>
            </div>
            <form onSubmit={saveAssignment} className="space-y-3 p-4">
              <label className="label">Assigned member
                <select className="field mt-1.5" value={assignedMember} onChange={(event) => setAssignedMember(event.target.value)}>
                  <option value="Unassigned">Unassigned</option>
                  {teamMembers.map((member) => <option key={member.id} value={member.fullName}>{member.fullName} · {member.role}</option>)}
                </select>
              </label>
              <label className="label">Assignment reason
                <textarea className="field mt-1.5 min-h-20 resize-y py-3" value={assignmentReason} onChange={(event) => setAssignmentReason(event.target.value)} placeholder="For example: Urdu confirmation call and vegetarian meal follow-up" required/>
              </label>
              <button type="submit" className="button-primary w-full">Save assignment</button>
              <p className="text-xs leading-5 text-stone">The selected member appears in the booking list and can be used to filter their queue. This preview is saved only in this browser.</p>
            </form>
          </section>
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Request actions</h2>
                <p className="panel-subtitle">Frontend-only status controls</p>
              </div>
            </div>
            <div className="grid gap-2 p-3">
              <button
                type="button"
                className="action-row"
                disabled={status !== "Call pending"}
                onClick={() => changeStatus("Tourist confirmed", "Call marked confirmed in frontend state.")}
              >
                <PhoneCall size={16} /> Mark call confirmed
              </button>
              <button
                type="button"
                className="action-row"
                onClick={() => {
                  setNotes((value) => `${value}\nNew call note: `);
                  setActionMessage("Call note field prepared below.");
                }}
              >
                <PhoneCall size={16} /> Add call note
              </button>
              <Link to="/payments" className="action-row"><CreditCard size={16} /> Open Finance payment review</Link>
              <button
                type="button"
                className="action-row"
                disabled={Boolean(providerGate)}
                onClick={() => changeStatus("Provider selection", "Booking sent to provider selection in frontend state.")}
              >
                <Send size={16} /> Send to provider selection
              </button>
              {providerGate ? <span className="action-row cursor-not-allowed opacity-55"><Send size={16} /> Assign providers after payment</span> : <Link to={`/bookings/${booking.id}/provider-suggestions`} className="action-row"><Send size={16} /> Assign providers</Link>}
              <button
                type="button"
                className="action-row"
                onClick={() =>
                  setActionMessage(
                    "Itinerary preview generated in frontend state.",
                  )
                }
              >
                <FileText size={16} /> Generate itinerary preview
              </button>
              <button
                type="button"
                className="action-row"
                disabled={status !== "Active"}
                onClick={() => changeStatus("Completed", "Booking marked completed in frontend state.")}
              >
                <CheckCircle2 size={16} /> Mark completed
              </button>
              <button
                type="button"
                className="action-row text-[#9c3f2e]"
                onClick={() => changeStatus("Cancelled", "Booking cancelled in frontend state.")}
              >
                <XCircle size={16} /> Cancel booking
              </button>
            </div>
          </section>
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Timeline</h2>
                <p className="panel-subtitle">Request history preview</p>
              </div>
            </div>
            <div className="space-y-5 p-4">
              {[
                ["Request submitted", booking.createdAt, true],
                [
                  "Call confirmation",
                  status === "Call pending"
                    ? "Waiting"
                    : "Updated in this session",
                  status !== "Call pending",
                ],
                ["Payment review", paymentStatus, paymentStatus === "Verified"],
                [
                  "Provider assignment",
                  status === "Provider selection"
                    ? "Ready for selection"
                    : "Not started",
                  status === "Provider selection",
                ],
              ].map(([title, detail, complete]) => (
                <div
                  key={String(title)}
                  className="relative border-l border-border pl-5"
                >
                  <span
                    className={`absolute -left-2 top-0 grid h-4 w-4 place-items-center rounded-full border-2 border-white ${complete ? "bg-pine" : "bg-border"}`}
                  >
                    {complete && (
                      <CheckCircle2 size={9} className="text-white" />
                    )}
                  </span>
                  <strong className="block text-sm text-charcoal">
                    {title}
                  </strong>
                  <span className="mt-1 block text-xs text-stone">
                    {detail}
                  </span>
                </div>
              ))}
              {assignmentHistory.slice().reverse().map((entry) => (
                <div key={entry.id} className="relative border-l border-border pl-5">
                  <span className="absolute -left-2 top-0 grid h-4 w-4 place-items-center rounded-full border-2 border-white bg-river"><CheckCircle2 size={9} className="text-white" /></span>
                  <strong className="block text-sm text-charcoal">Team assignment updated</strong>
                  <span className="mt-1 block text-xs text-stone">{entry.previousMember} → {entry.assignedMember} · {entry.assignedAt}</span>
                  <p className="mt-1 text-xs leading-5 text-stone">{entry.reason}</p>
                  <span className="mt-1 block text-xs text-stone">Assigned by {entry.assignedBy}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold text-charcoal">
                  <QrCode size={16} className="text-river" />
                  Service voucher
                </h2>
                <p className="mt-2 text-sm text-stone">
                  Generate, view, deliver, and test provider handoffs in the frontend workflow.
                </p>
              </div>
              <Link to={`/bookings/${booking.id}/vouchers`} className="button-secondary shrink-0">
                <QrCode size={15} />
                Open
              </Link>
            </div>
          </section>
          <section className="panel p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-charcoal">
              <FileText size={16} className="text-river" />
              Documents
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-stone">
              <li>Booking confirmation · Available</li>
              <li>Payment receipt · Pending review</li>
              <li>Final itinerary · Preview only</li>
            </ul>
          </section>
          <section className="panel p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-charcoal">
              <LifeBuoy size={16} className="text-river" />
              Linked support tickets
            </h2>
            <p className="mt-2 text-sm text-stone">
              SUP-82 · Meal preference · Open
            </p>
            <Link to="/support" className="text-link mt-3">
              Open support desk
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}

function DetailGroup({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  rows: string[][];
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-bold text-pine">
        {icon}
        {title}
      </h3>
      <dl className="mt-3 divide-y divide-border">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-3 py-2.5 text-sm"
          >
            <dt className="text-stone">{label}</dt>
            <dd className="max-w-[65%] text-right font-semibold text-charcoal">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
function CallPanel({
  booking,
  status,
}: {
  booking: Booking;
  status: BookingStatus;
}) {
  return (
    <section className="panel p-4">
      <div className="flex items-center gap-2 text-pine">
        <PhoneCall size={17} />
        <h2 className="panel-title">Call confirmation</h2>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-stone">Status</span>
        <StatusBadge
          status={status === "Call pending" ? "Call pending" : "Confirmed"}
        />
      </div>
      <p className="mt-3 rounded-md bg-snow p-3 text-sm leading-6 text-stone">
        {booking.callNotes || "No call notes recorded yet."}
      </p>
    </section>
  );
}
function PaymentPanel({
  booking,
  status,
  remaining,
}: {
  booking: Booking;
  status: PaymentStatus;
  remaining: number;
}) {
  return (
    <section className="panel p-4">
      <div className="flex items-center gap-2 text-pine">
        <CreditCard size={17} />
        <h2 className="panel-title">Payment breakdown</h2>
      </div>
      <dl className="mt-3 divide-y divide-border text-sm">
        <div className="flex justify-between py-2">
          <dt className="text-stone">Total</dt>
          <dd className="font-semibold">{formatPkr(booking.totalAmount)}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-stone">Submitted amount</dt>
          <dd className="font-semibold">{formatPkr(booking.amountPaid)}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-stone">Balance after verification</dt>
          <dd className="font-semibold">{formatPkr(remaining)}</dd>
        </div>
        <div className="flex items-center justify-between py-2">
          <dt className="text-stone">Proof status</dt>
          <dd>
            <PaymentBadge status={status} />
          </dd>
        </div>
      </dl>
      <Link to="/payments" className="text-link mt-3">
        Open submitted proof
      </Link>
    </section>
  );
}
