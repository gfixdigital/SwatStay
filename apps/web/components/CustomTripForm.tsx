"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { CustomSelect } from "./CustomSelect";
import { CountryPhoneField } from "./CountryPhoneField";
import { DatePicker } from "./DatePicker";
import { PickupCityField } from "./PickupCityField";

const interests = ["Mountain views", "Hiking", "Food", "Snow", "Photography", "Family time"];

export function CustomTripForm() {
  const [sent, setSent] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalError, setLegalError] = useState("");
  if (sent) return <div className="rounded-brand border border-border bg-white p-6 text-center shadow-editorial"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mist text-pine"><CheckCircle2 size={24}/></span><div className="eyebrow mt-4">REQUEST RECEIVED</div><h2 className="font-display text-xl font-bold">Your Swat brief is with our team</h2><p className="mt-2 text-sm leading-6 text-stone">We will review your preferences and call to shape the route, stay, and transport details with you.</p><button type="button" onClick={() => setSent(false)} className="mt-5 text-sm font-semibold text-river">Submit another request</button></div>;
  return <form onSubmit={(event) => { event.preventDefault(); if (!legalAccepted) { setLegalError("Please agree to the Terms and Privacy Policy before preparing your trip request."); return; } setLegalError(""); setSent(true); }} className="grid gap-4 rounded-brand border border-border bg-white p-4 shadow-editorial sm:p-6">
    <div><div className="eyebrow mb-1">YOUR TRIP BRIEF</div><h2 className="font-display text-xl font-bold text-pine sm:text-2xl">Tell us how you want to experience Swat</h2><p className="mt-1.5 text-sm leading-5 text-stone">The more context you share, the more useful our first call will be.</p></div>
    <label className="text-xs font-semibold text-stone">Where would you like to go?<input required name="destinationIdeas" className="field mt-1 w-full" placeholder="Kalam, Malam Jabba, river valleys..."/></label>
    <div className="grid gap-4 sm:grid-cols-2"><CustomSelect label="Trip length" name="days" value="3" options={[{ label: "2 days", value: "2" }, { label: "3 days", value: "3" }, { label: "4 days", value: "4" }, { label: "5+ days", value: "5+" }]}/><CustomSelect label="Who is travelling?" name="travelerType" value="family" options={[{ label: "Solo", value: "solo" }, { label: "Couple", value: "couple" }, { label: "Family", value: "family" }, { label: "Group", value: "group" }]}/></div>
    <div className="grid gap-4 sm:grid-cols-2"><DatePicker label="Preferred start date" name="travelDate"/><CustomSelect label="Approximate budget" name="budgetRange" value="30-60" options={[{ label: "PKR 30,000 - 60,000", value: "30-60" }, { label: "PKR 60,000 - 100,000", value: "60-100" }, { label: "PKR 100,000+", value: "100+" }]}/></div>
    <div className="grid gap-4 sm:grid-cols-2"><CustomSelect label="Stay preference" name="stayLevel" value="standard" options={[{ label: "Simple and practical", value: "basic" }, { label: "Comfortable standard", value: "standard" }, { label: "Premium stay", value: "premium" }]}/><CustomSelect label="Transport preference" name="transport" value="private" options={[{ label: "Private vehicle", value: "private" }, { label: "Shared transport", value: "shared" }, { label: "I will arrange transport", value: "own" }]}/></div>
    <PickupCityField/>
    <fieldset><legend className="text-xs font-semibold text-stone">What matters to your group?</legend><div className="mt-2 flex flex-wrap gap-2">{interests.map((interest) => { const active = selectedInterests.includes(interest); return <label key={interest} className={`cursor-pointer rounded-md border px-3 py-2 text-xs transition ${active ? "border-pine bg-pine text-white" : "border-border bg-white text-stone hover:border-river"}`}><input type="checkbox" name="interests" value={interest} checked={active} onChange={() => setSelectedInterests((current) => active ? current.filter((item) => item !== interest) : [...current, interest])} className="sr-only"/>{interest}</label>; })}</div></fieldset>
    <label className="text-xs font-semibold text-stone">Anything else we should plan for?<textarea name="specialRequests" rows={3} className="mt-1 w-full rounded-brand border border-border p-3 outline-none focus:border-river focus:ring-1 focus:ring-river" placeholder="Accessibility, food preferences, a celebration, or places you want to avoid..."/></label>
    <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2"><label className="text-xs font-semibold text-stone">Your name<input required name="fullName" className="field mt-1 w-full" placeholder="Your full name"/></label><CountryPhoneField/><label className="text-xs font-semibold text-stone">Email address<input required type="email" name="email" className="field mt-1 w-full" placeholder="you@example.com"/></label><CustomSelect label="Preferred call language" name="preferredLanguage" value="English" options={[{ label: "English", value: "English" }, { label: "Urdu", value: "Urdu" }, { label: "Chinese", value: "Chinese" }]}/></div>
    <label className="flex items-start gap-3 rounded-brand border border-border bg-mist p-3 text-xs leading-5 text-stone"><input required name="legalAgreement" type="checkbox" checked={legalAccepted} onChange={(event) => { setLegalAccepted(event.target.checked); if (event.target.checked) setLegalError(""); }} className="mt-0.5 h-4 w-4 accent-[#12372A]"/>I agree to the <Link href="/terms" className="font-semibold text-river">Terms and Conditions</Link> and <Link href="/privacy" className="font-semibold text-river">Privacy Policy</Link>.</label>
    {legalError && <p role="alert" className="text-xs font-semibold text-[#9c3f2e]">{legalError}</p>}
    <button className="button min-h-12 bg-pine text-white hover:bg-[#0e2c22]">Send my trip brief <ArrowRight size={16}/></button>
  </form>;
}
