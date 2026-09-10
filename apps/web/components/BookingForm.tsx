"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomSelect } from "./CustomSelect";
import { DatePicker } from "./DatePicker";

export function BookingForm({ packageTitle = "A SwatStay package", packageImage }: { packageTitle?: string; packageImage?: string }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  return <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); setTimeout(() => router.push("/booking/success"), 450); }} className="grid gap-5 rounded-brand border border-border bg-white p-5 shadow-editorial md:p-7">
    {packageImage && <div className="-mx-5 -mt-5 overflow-hidden rounded-t-brand border-b border-border md:-mx-7 md:-mt-7"><div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${packageImage})` }}/><div className="bg-mist px-4 py-3"><span className="text-[11px] font-semibold uppercase tracking-[.5px] text-river">REQUESTING</span><strong className="mt-1 block font-display text-lg text-pine">{packageTitle}</strong></div></div>}
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-stone">Full name<input required name="fullName" className="field mt-1 w-full" placeholder="Your name"/></label><label className="text-xs font-semibold text-stone">Phone / WhatsApp<input required name="phone" className="field mt-1 w-full" placeholder="+92 300 1234567"/></label><label className="text-xs font-semibold text-stone">Email address<input required type="email" name="email" className="field mt-1 w-full" placeholder="you@example.com"/></label><CustomSelect label="Travelers" name="travelers" value="2" options={[{ label: "1 traveler", value: "1" }, { label: "2 travelers", value: "2" }, { label: "3 travelers", value: "3" }, { label: "4+ travelers", value: "4+" }]}/></div>
    <div className="grid gap-4 sm:grid-cols-2"><DatePicker label="Travel start date" name="travelStartDate"/><DatePicker label="Return date" name="travelEndDate"/></div>
    <div className="grid gap-4 sm:grid-cols-2"><CustomSelect label="Destination" name="destination" value="Kalam" options={[{ label: "Kalam", value: "Kalam" }, { label: "Malam Jabba", value: "Malam Jabba" }, { label: "Bahrain", value: "Bahrain" }, { label: "Anywhere in Swat", value: "all" }]}/><CustomSelect label="Stay level" name="tier" value="standard" options={[{ label: "Basic", value: "basic" }, { label: "Standard", value: "standard" }, { label: "Premium", value: "premium" }]}/></div>
    <div className="grid gap-4 sm:grid-cols-2"><CustomSelect label="Pickup preference" name="pickupCity" value="mingora" options={[{ label: "Mingora / Saidu Sharif", value: "mingora" }, { label: "Islamabad", value: "islamabad" }, { label: "I will meet in Swat", value: "swat" }]}/><CustomSelect label="Payment preference" name="paymentMethod" value="call" options={[{ label: "Discuss on confirmation call", value: "call" }, { label: "Advance payment", value: "advance" }, { label: "Full payment", value: "full" }]}/></div>
    <label className="text-xs font-semibold text-stone">Special requests<textarea name="specialRequests" rows={4} className="mt-1 w-full rounded-brand border border-border p-3 outline-none focus:border-river focus:ring-1 focus:ring-river" placeholder="Food preferences, accessibility, room needs, or anything important..."/></label>
    <p className="flex gap-2 border-t border-border pt-4 text-xs leading-5 text-stone"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-river"/> A team member will call to confirm availability, details, and payment before anything is booked.</p>
    <button disabled={submitted} className="button min-h-12 bg-pine text-white hover:bg-[#0e2c22] disabled:opacity-70">{submitted ? "Request submitted" : "Submit booking request"} <ArrowRight size={16}/></button>
  </form>;
}
