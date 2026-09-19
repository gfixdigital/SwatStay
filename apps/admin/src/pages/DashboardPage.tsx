import { ArrowRight, CalendarCheck2, CreditCard, Headphones, PhoneCall, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { PaymentBadge } from "../components/PaymentBadge";
import { useBookingsPreview } from "../hooks/useBookingsPreview";
import { adminRequest, getAdminToken } from "../lib/adminApi";

type DashboardPayment = { id: string; bookingReference: string; touristName: string; status: "Pending proof" | "Proof submitted" | "Verified" | "Rejected" };
type DashboardProvider = { id: string; name: string; status: string };
type DashboardTicket = { id: string; status: string };

export function DashboardPage() {
  const { bookings } = useBookingsPreview();
  const [pendingPayments, setPendingPayments] = useState<DashboardPayment[]>([]);
  const [pendingProviders, setPendingProviders] = useState<DashboardProvider[]>([]);
  const [openSupport, setOpenSupport] = useState<DashboardTicket[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!getAdminToken()) return;
    Promise.all([
      adminRequest<Array<{ id: string; booking?: { reference?: string } | null; submittedBy?: { fullName?: string } | null; status: string }>>("/admin/payments"),
      adminRequest<DashboardProvider[]>("/admin/providers"),
      adminRequest<DashboardTicket[]>("/support/admin/tickets"),
    ]).then(([payments, providers, tickets]) => {
      setPendingPayments(payments.filter((item) => item.status === "PROOF_SUBMITTED" || item.status === "PENDING").map((item) => ({ id: item.id, bookingReference: item.booking?.reference ?? "Unknown booking", touristName: item.submittedBy?.fullName ?? "Unknown tourist", status: item.status === "PROOF_SUBMITTED" ? "Proof submitted" : "Pending proof" })));
      setPendingProviders(providers.filter((provider) => provider.status === "PENDING" || provider.status === "IN_REVIEW"));
      setOpenSupport(tickets.filter((ticket) => ticket.status !== "RESOLVED" && ticket.status !== "CLOSED"));
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load live operations queues."));
  }, []);
  const callPending = bookings.filter((booking) => booking.status === "Call pending");
  const activeTrips = bookings.filter((booking) => booking.status === "Active");
  return <><PageHeader eyebrow="TODAY OVERVIEW" title="Operations dashboard" description="Review the small set of requests that need a GFix team decision today." actions={<><Link to="/bookings" className="button-secondary">All bookings</Link><Link to="/call-queue" className="button-primary"><PhoneCall size={15}/> Open call queue</Link></>}/>{error && <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Calls needed" value={callPending.length} note="Booking requests waiting" icon={<PhoneCall/>}/><StatCard label="Payment proofs" value={pendingPayments.length} note="Needs finance review" icon={<CreditCard/>}/><StatCard label="Provider approvals" value={pendingProviders.length} note="Registration records" icon={<ShieldCheck/>}/><StatCard label="Active trips" value={activeTrips.length} note="Currently in service" icon={<CalendarCheck2/>}/><StatCard label="Support issues" value={openSupport.length} note="Open or in progress" icon={<Headphones/>}/></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><section className="panel"><div className="panel-header"><div><h2 className="panel-title">Booking requests needing call</h2><p className="panel-subtitle">Contact tourists before provider selection.</p></div><Link to="/call-queue" className="text-link">View queue <ArrowRight size={14}/></Link></div><div className="divide-y divide-border">{callPending.map((booking) => <div key={booking.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><strong className="text-sm text-river">{booking.reference}</strong><StatusBadge status={booking.status}/></div><h3 className="mt-2 font-semibold text-charcoal">{booking.touristName}</h3><p className="mt-1 text-sm text-stone">{booking.packageName} · {booking.travelStartDate}</p></div><Link to={`/bookings/${booking.id}`} className="button-secondary">Open request <ArrowRight size={14}/></Link></div>)}</div></section><aside className="space-y-5"><section className="panel"><div className="panel-header"><div><h2 className="panel-title">Payment proof pending</h2><p className="panel-subtitle">Finance review queue</p></div></div>{pendingPayments.length ? pendingPayments.map((payment) => <div key={payment.id} className="p-4"><div className="flex items-center justify-between gap-3"><div><strong className="text-sm text-charcoal">{payment.bookingReference}</strong><p className="mt-1 text-sm text-stone">{payment.touristName}</p></div><PaymentBadge status={payment.status}/></div><Link to="/payments" className="text-link mt-3">Review payment <ArrowRight size={14}/></Link></div>) : <p className="p-4 text-sm text-stone">No payment proofs need review.</p>}</section><section className="panel"><div className="panel-header"><div><h2 className="panel-title">Quick actions</h2><p className="panel-subtitle">Common operations routes</p></div></div><div className="grid gap-2 p-3"><QuickAction to="/packages" icon={<Plus size={16}/>} label="Add package"/><QuickAction to="/destinations" icon={<Plus size={16}/>} label="Add destination"/><QuickAction to="/providers/approvals" icon={<ShieldCheck size={16}/>} label="Review provider"/><QuickAction to="/call-queue" icon={<PhoneCall size={16}/>} label="Open call queue"/><QuickAction to="/payments" icon={<CreditCard size={16}/>} label="Verify payment"/></div></section></aside></div><section className="panel mt-5"><div className="panel-header"><div><h2 className="panel-title">Recent booking activity</h2><p className="panel-subtitle">Latest live request updates</p></div></div><div className="divide-y divide-border">{bookings.slice(0, 4).map((booking) => <div key={booking.id} className="flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center"><div><strong className="text-sm text-charcoal">{booking.reference} · {booking.touristName}</strong><p className="mt-1 text-xs text-stone">{booking.packageName} · {booking.createdAt}</p></div><StatusBadge status={booking.status}/></div>)}</div></section></>;
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) { return <Link to={to} className="flex min-h-10 items-center justify-between rounded-md border border-border px-3 text-sm font-semibold text-charcoal hover:border-river hover:bg-mist"><span className="flex items-center gap-3 text-pine">{icon}<span className="text-charcoal">{label}</span></span><ArrowRight size={14} className="text-river"/></Link>; }
