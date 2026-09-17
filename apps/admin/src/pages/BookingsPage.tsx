import { Download, Search, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { BookingTable } from "../components/BookingTable";
import { PageHeader } from "../components/PageHeader";
import { teamMembers } from "../data/adminData";
import { useBookingsPreview } from "../hooks/useBookingsPreview";
import type { Booking } from "../types/admin";

export function BookingsPage() {
  const { bookings } = useBookingsPreview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [destination, setDestination] = useState("All");
  const [date, setDate] = useState("");
  const [packageType, setPackageType] = useState("All");
  const [payment, setPayment] = useState("All");
  const [assignedMember, setAssignedMember] = useState("All");
  const [exported, setExported] = useState(false);

  const filtered = useMemo(() => bookings.filter((booking) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || [booking.reference, booking.touristName, booking.phone, booking.packageName].some((value) => value.toLowerCase().includes(query));
    const matchesAssignee = assignedMember === "All" || (assignedMember === "Unassigned" ? booking.assignedSupportMember === "Unassigned" : booking.assignedSupportMember === assignedMember);
    return matchesSearch && matchesAssignee && (status === "All" || booking.status === status) && (destination === "All" || booking.destination === destination) && (packageType === "All" || booking.packageName.startsWith(packageType)) && (payment === "All" || booking.paymentStatus === payment) && (!date || booking.travelStartDate === date);
  }), [assignedMember, bookings, search, status, destination, date, packageType, payment]);

  function clearFilters() {
    setSearch(""); setStatus("All"); setDestination("All"); setPackageType("All"); setPayment("All"); setDate(""); setAssignedMember("All");
  }

  function exportFilteredBookings() {
    const headers = ["Reference", "Tourist", "Phone", "Package", "Destination", "Travel date", "Status", "Payment", "Assigned member"];
    const rows = filtered.map((booking) => [booking.reference, booking.touristName, booking.phone, booking.packageName, booking.destination, booking.travelStartDate, booking.status, booking.paymentStatus, booking.assignedSupportMember]);
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `swatstay-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
  }

  return <>
    <PageHeader eyebrow="STEP 1 · BOOKING INBOX" title="Booking requests" description="Operations receives every new request here, assigns one queue owner, then hands it to Support for the confirmation call." actions={<button type="button" className="button-secondary" onClick={exportFilteredBookings}><Download size={15}/> Export CSV</button>}/>
    <section className="mb-4 grid gap-3 rounded-lg border border-border bg-white p-3 md:grid-cols-2 xl:grid-cols-3">
      <label className="relative"><span className="sr-only">Search bookings</span><Search className="absolute left-3 top-2.5 text-stone" size={16}/><input className="field pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Reference, tourist, phone, package"/></label>
      <select className="field" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{[...new Set(bookings.map((booking) => booking.status))].map((item) => <option key={item}>{item}</option>)}</select>
      <select className="field" value={destination} onChange={(event) => setDestination(event.target.value)}><option>All</option>{[...new Set(bookings.map((booking) => booking.destination))].map((item) => <option key={item}>{item}</option>)}</select>
      <select className="field" value={packageType} onChange={(event) => setPackageType(event.target.value)}><option>All</option><option>Couple</option><option>Family</option><option>Private</option></select>
      <select className="field" value={payment} onChange={(event) => setPayment(event.target.value)}><option>All</option>{[...new Set(bookings.map((booking) => booking.paymentStatus))].map((item) => <option key={item}>{item}</option>)}</select>
      <input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)}/>
      <label className="relative md:col-span-2 xl:col-span-1"><UsersRound className="pointer-events-none absolute left-3 top-2.5 text-stone" size={16}/><span className="sr-only">Assigned team member</span><select className="field pl-9" value={assignedMember} onChange={(event) => setAssignedMember(event.target.value)}><option>All</option><option>Unassigned</option>{teamMembers.map((member) => <option key={member.id}>{member.name}</option>)}</select></label>
    </section>
    {exported && <p className="mb-3 rounded-md bg-mist p-3 text-sm font-semibold text-pine">Filtered booking rows were exported as a CSV from this browser preview.</p>}
    <div className="mb-3 flex items-center justify-between text-sm"><span className="text-stone">{filtered.length} request{filtered.length === 1 ? "" : "s"}</span>{(search || status !== "All" || destination !== "All" || packageType !== "All" || payment !== "All" || date || assignedMember !== "All") && <button type="button" className="text-link" onClick={clearFilters}>Clear filters</button>}</div>
    <BookingTable bookings={filtered}/>
  </>;
}
