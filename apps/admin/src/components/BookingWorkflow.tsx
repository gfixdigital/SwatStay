import { ArrowRight, CalendarCheck2, CreditCard, FolderKanban, Headphones, PhoneCall, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import type { Booking } from "../types/admin";
import { workflowBlockReason, type WorkflowStep } from "../lib/bookingWorkflow";

const steps = [
  { label: "Booking inbox", owner: "Operations", to: "/bookings", icon: CalendarCheck2, key: "inbox" },
  { label: "Call confirmation", owner: "Support", to: "/call-queue", icon: PhoneCall, key: "call" },
  { label: "Payment review", owner: "Finance", to: "/payments", icon: CreditCard, key: "payment" },
  { label: "Provider assignment", owner: "Operations", to: "/provider-suggestions", icon: FolderKanban, key: "providers" },
  { label: "Trip voucher", owner: "Operations", to: "/vouchers", icon: QrCode, key: "voucher" },
  { label: "Trip support and close", owner: "Support", to: "/support", icon: Headphones, key: "support" },
];

function currentStep(booking: Booking) {
  if (booking.status === "Call pending") return 1;
  if (["Pending proof", "Proof submitted", "Rejected"].includes(booking.paymentStatus)) return 2;
  if (["Tourist confirmed", "Provider selection"].includes(booking.status)) return 3;
  if (booking.status === "Active") return 4;
  if (booking.status === "Completed") return 5;
  return 0;
}

export function BookingWorkflow({ booking, compact = false }: { booking: Booking; compact?: boolean }) { const active = currentStep(booking); return <section className={compact ? "" : "mb-5 rounded-lg border border-border bg-white p-4"}>{!compact && <div className="mb-3"><h2 className="text-sm font-bold text-charcoal">Booking handoff path</h2><p className="mt-1 text-xs text-stone">Each step has one responsible team. A blocked step cannot be opened until the earlier work is done.</p></div>}<ol className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">{steps.map((step, index) => { const Icon = step.icon; const current = index === active; const complete = index < active; const blocked = workflowBlockReason(booking, step.key as WorkflowStep); return <li key={step.label} className={`min-w-0 rounded-md border p-3 ${current ? "border-pine bg-[#e8efea]" : complete ? "border-[#c4d7cb] bg-white" : "border-border bg-snow"}`}><span className={`grid h-7 w-7 place-items-center rounded-md ${current ? "bg-pine text-white" : "bg-mist text-river"}`}><Icon size={14}/></span><strong className="mt-2 block text-xs leading-4 text-charcoal">{index + 1}. {step.label}</strong><span className="mt-1 block text-[11px] text-stone">Owner: {step.owner}</span>{current && !blocked && <Link to={step.to} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-pine">Open step <ArrowRight size={12}/></Link>}{blocked && <span className="mt-2 block text-[10px] leading-4 text-[#925d19]">Blocked: {blocked}</span>}</li>; })}</ol>{!compact && <p className="mt-3 border-t border-border pt-3 text-xs text-stone">Current team: <strong className="text-charcoal">{steps[active].owner}</strong> · Queue owner: <strong className="text-charcoal">{booking.assignedSupportMember || "Unassigned"}</strong></p>}</section>; }
