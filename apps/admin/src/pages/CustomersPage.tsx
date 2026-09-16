import { ArrowLeft, CalendarDays, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { PaymentBadge } from "../components/PaymentBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useBookingsPreview } from "../hooks/useBookingsPreview";

export function CustomersPage() {
  const { customerKey } = useParams();
  const { bookings } = useBookingsPreview();
  const customers = Object.values(bookings.reduce<Record<string, typeof bookings[number][]>>((groups, booking) => ({ ...groups, [booking.email]: [...(groups[booking.email] ?? []), booking] }), {}));
  const selected = customerKey ? customers.find((items) => items[0]?.email === decodeURIComponent(customerKey)) : undefined;

  if (customerKey && !selected) return <><Link to="/customers" className="text-link mb-4"><ArrowLeft size={14}/> Back to customers</Link><section className="rounded-lg border border-border bg-white p-5 text-sm text-stone">Customer not found in this preview.</section></>;
  if (selected) return <CustomerProfile bookings={selected}/>;

  return <><PageHeader eyebrow="CUSTOMER OPERATIONS" title="Customers" description="Review customer contact information, booking history, payment state, support ownership, and trip activity from one directory."/>
    <section className="overflow-hidden rounded-lg border border-border bg-white"><div className="hidden grid-cols-[1.2fr_1fr_120px_120px_150px] border-b border-border bg-mist px-4 py-3 text-xs font-semibold uppercase text-stone md:grid"><span>Customer</span><span>Latest trip</span><span>Trips</span><span>Country</span><span>Action</span></div><div className="divide-y divide-border">{customers.map((items) => { const customer = items[0]; const latest = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]; return <article key={customer.email} className="grid gap-3 p-4 md:grid-cols-[1.2fr_1fr_120px_120px_150px] md:items-center"><div><div className="flex items-center gap-2"><UserRound size={15} className="text-river"/><h2 className="font-bold text-charcoal">{customer.touristName}</h2></div><p className="mt-1 text-xs text-stone">{customer.email} · {customer.phone}</p></div><div><strong className="block text-sm text-charcoal">{latest.packageName}</strong><span className="mt-1 block text-xs text-stone">{latest.destination} · {latest.travelStartDate}</span></div><span className="text-sm font-semibold text-charcoal">{items.length}</span><span className="text-sm text-stone">{customer.country}</span><Link to={`/customers/${encodeURIComponent(customer.email)}`} className="button-secondary w-fit">View customer</Link></article>; })}</div></section>
  </>;
}

function CustomerProfile({ bookings }: { bookings: import("../types/admin").Booking[] }) {
  const customer = bookings[0];
  const totalBooked = bookings.reduce((total, booking) => total + booking.totalAmount, 0);
  const totalPaid = bookings.reduce((total, booking) => total + booking.amountPaid, 0);
  return <><Link to="/customers" className="text-link mb-4"><ArrowLeft size={14}/> Back to customers</Link><PageHeader eyebrow="CUSTOMER PROFILE" title={customer.touristName} description="Customer contact, trip history, payment progress, preferences, and current support owner."/>
    <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]"><aside className="space-y-4"><section className="rounded-lg border border-border bg-white p-4"><h2 className="font-bold text-charcoal">Customer details</h2><dl className="mt-3 space-y-3 text-sm"><Row icon={<Mail size={15}/>} label="Email" value={customer.email}/><Row icon={<Phone size={15}/>} label="Phone" value={customer.phone}/><Row icon={<MapPin size={15}/>} label="Country" value={customer.country}/><Row icon={<CalendarDays size={15}/>} label="Preferred language" value={customer.preferredLanguage}/></dl></section><section className="rounded-lg border border-border bg-white p-4"><h2 className="font-bold text-charcoal">Customer summary</h2><dl className="mt-3 divide-y divide-border text-sm"><div className="flex justify-between py-2"><dt className="text-stone">Trips</dt><dd className="font-semibold">{bookings.length}</dd></div><div className="flex justify-between py-2"><dt className="text-stone">Total booked</dt><dd className="font-semibold">PKR {totalBooked.toLocaleString("en-PK")}</dd></div><div className="flex justify-between py-2"><dt className="text-stone">Total recorded paid</dt><dd className="font-semibold">PKR {totalPaid.toLocaleString("en-PK")}</dd></div></dl></section></aside><section className="rounded-lg border border-border bg-white"><div className="border-b border-border p-4"><h2 className="font-bold text-charcoal">Trip history</h2><p className="mt-1 text-xs text-stone">Each booking remains linked to its workflow and assigned team owner.</p></div><div className="divide-y divide-border">{bookings.map((booking) => <article key={booking.id} className="p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-river">{booking.reference}</strong><StatusBadge status={booking.status}/><PaymentBadge status={booking.paymentStatus}/></div><h3 className="mt-2 font-bold text-charcoal">{booking.packageName}</h3><p className="mt-1 text-sm text-stone">{booking.destination} · {booking.travelStartDate} to {booking.travelEndDate} · {booking.travelers} travelers</p><p className="mt-2 text-xs text-stone">Owner: {booking.assignedSupportMember} · Preferences: {booking.specialRequests}</p></div><Link to={`/bookings/${booking.id}`} className="button-secondary w-fit">Open trip</Link></div></article>)}</div></section></div>
  </>;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex gap-2"><span className="mt-0.5 text-river">{icon}</span><div><dt className="text-xs text-stone">{label}</dt><dd className="mt-0.5 font-semibold text-charcoal">{value}</dd></div></div>; }
