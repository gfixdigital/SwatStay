import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BookingTable } from "../components/BookingTable";
import { PageHeader } from "../components/PageHeader";
import { bookings } from "../data/adminData";

export function BookingsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [destination, setDestination] = useState("All");
  const [date, setDate] = useState("");
  const filtered = useMemo(() => bookings.filter((booking) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || [booking.reference, booking.touristName, booking.phone, booking.packageName].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (status === "All" || booking.status === status) && (destination === "All" || booking.destination === destination) && (!date || booking.travelStartDate === date);
  }), [search, status, destination, date]);
  return <><PageHeader eyebrow="BOOKING OPERATIONS" title="Booking requests" description="Search and review tourist requests before calls, payments, and provider assignments."/><section className="mb-4 grid gap-3 rounded-lg border border-border bg-white p-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]"><label className="relative"><span className="sr-only">Search bookings</span><Search className="absolute left-3 top-2.5 text-stone" size={16}/><input className="field pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Reference, tourist, phone, package"/></label><label><span className="sr-only">Status</span><select className="field" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{[...new Set(bookings.map((booking) => booking.status))].map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="sr-only">Destination</span><select className="field" value={destination} onChange={(event) => setDestination(event.target.value)}><option>All</option>{[...new Set(bookings.map((booking) => booking.destination))].map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="sr-only">Travel date</span><input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)}/></label></section><div className="mb-3 flex items-center justify-between text-sm"><span className="text-stone">{filtered.length} request{filtered.length === 1 ? "" : "s"}</span>{(search || status !== "All" || destination !== "All" || date) && <button type="button" className="text-link" onClick={() => { setSearch(""); setStatus("All"); setDestination("All"); setDate(""); }}>Clear filters</button>}</div><BookingTable bookings={filtered}/></>;
}
