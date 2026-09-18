"use client";

import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CustomSelect } from "./CustomSelect";
import { CountryPhoneField } from "./CountryPhoneField";
import { DatePicker } from "./DatePicker";
import { PickupCityField } from "./PickupCityField";
import { createBooking } from "@/lib/api";

export function BookingForm({
  packageTitle = "A SwatStay package",
  packageImage,
  packageSlug,
  destination,
}: {
  packageTitle?: string;
  packageImage?: string;
  packageSlug?: string;
  destination?: string;
}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalError, setLegalError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!legalAccepted) {
      setLegalError("Please agree to the Terms and Conditions and Privacy Policy before submitting.");
      return;
    }
    setLegalError("");
    setError("");
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const language = String(data.get("preferredLanguage") ?? "English");
    const travelersRaw = String(data.get("travelers") ?? "2");
    const travelersCount = Number(travelersRaw.replace("+", "")) || 2;
    const travelStart = String(data.get("travelStartDate") ?? "");
    const travelEnd = String(data.get("travelEndDate") ?? "");

    if (!travelStart || !travelEnd) {
      setError("Please select both travel start and return dates.");
      setSubmitting(false);
      return;
    }
    if (new Date(travelEnd) <= new Date(travelStart)) {
      setError("Return date must be after the start date.");
      setSubmitting(false);
      return;
    }

    const result = await createBooking({
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: `${String(data.get("countryCode") ?? "")} ${String(data.get("phone") ?? "")}`.trim(),
      whatsapp: `${String(data.get("countryCode") ?? "")} ${String(data.get("phone") ?? "")}`.trim(),
      country: String(data.get("country") ?? ""),
      preferredLanguage: language === "Urdu" ? "UR" : language === "Chinese" ? "ZH" : "EN",
      packageSlug: packageSlug ?? undefined,
      destination: destination ?? String(data.get("destination") ?? "Swat"),
      travelStart,
      travelEnd,
      travelersCount,
      travelerType: String(data.get("travelerType") ?? ""),
      tier: String(data.get("tier") ?? ""),
      pickupCity: String(data.get("pickupCity") ?? ""),
      preferredPaymentMethod: String(data.get("paymentMethod") ?? ""),
      specialRequests: String(data.get("specialRequests") ?? "") || undefined,
      consent: true,
    }).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "We could not submit your booking request.");
      return null;
    });

    if (!result) {
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    const ref = String((result as { bookingId?: string; reference?: string }).reference ?? "");
    router.push(`/booking/success?reference=${encodeURIComponent(ref)}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-brand border border-border bg-white p-5 shadow-editorial md:p-7">
      {packageImage && (
        <div className="-mx-5 -mt-5 overflow-hidden rounded-t-brand border-b border-border md:-mx-7 md:-mt-7">
          <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${packageImage})` }} />
          <div className="bg-mist px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[.5px] text-river">REQUESTING</span>
            <strong className="mt-1 block font-display text-lg text-pine">{packageTitle}</strong>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-stone">
          Full name
          <input required name="fullName" className="field mt-1 w-full" placeholder="Your name" />
        </label>
        <CountryPhoneField />
        <label className="text-xs font-semibold text-stone">
          Email address
          <input required type="email" name="email" className="field mt-1 w-full" placeholder="you@example.com" />
        </label>
        <CustomSelect
          label="Preferred call language"
          name="preferredLanguage"
          value="English"
          options={[
            { label: "English", value: "English" },
            { label: "Urdu", value: "Urdu" },
            { label: "Chinese", value: "Chinese" },
          ]}
        />
        <CustomSelect
          label="Travelers"
          name="travelers"
          value="2"
          options={[
            { label: "1 traveler", value: "1" },
            { label: "2 travelers", value: "2" },
            { label: "3 travelers", value: "3" },
            { label: "4+ travelers", value: "4+" },
          ]}
        />
        <CustomSelect
          label="Traveler type"
          name="travelerType"
          value=""
          options={[
            { label: "Select type", value: "" },
            { label: "Solo", value: "Solo" },
            { label: "Couple", value: "Couple" },
            { label: "Family", value: "Family" },
            { label: "Group", value: "Group" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker label="Travel start date" name="travelStartDate" />
        <DatePicker label="Return date" name="travelEndDate" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CustomSelect
          label="Destination"
          name="destination"
          value="Kalam"
          options={[
            { label: "Kalam", value: "Kalam" },
            { label: "Malam Jabba", value: "Malam Jabba" },
            { label: "Bahrain", value: "Bahrain" },
            { label: "Anywhere in Swat", value: "all" },
          ]}
        />
        <CustomSelect
          label="Stay level"
          name="tier"
          value="standard"
          options={[
            { label: "Basic", value: "Basic" },
            { label: "Standard", value: "Standard" },
            { label: "Premium", value: "Premium" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PickupCityField defaultValue="Mingora" />
        <CustomSelect
          label="Payment preference"
          name="paymentMethod"
          value="call"
          options={[
            { label: "Discuss on confirmation call", value: "BANK_TRANSFER" },
            { label: "Advance payment", value: "ADVANCE" },
            { label: "Full payment", value: "FULL" },
          ]}
        />
      </div>

      <label className="text-xs font-semibold text-stone">
        Special requests
        <textarea
          name="specialRequests"
          rows={4}
          className="mt-1 w-full rounded-brand border border-border p-3 outline-none focus:border-river focus:ring-1 focus:ring-river"
          placeholder="Food preferences, accessibility, room needs, or anything important..."
        />
      </label>

      <div className="rounded-brand border border-border bg-mist p-4">
        <p className="flex gap-2 text-xs leading-5 text-stone">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-river" />
          A team member will call to confirm availability, details, and payment before anything is booked.
        </p>
        <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-stone">
          Cancellation depends on provider policy and booking date. The GFix team confirms refund rules during the call.
          Weather and road changes may require rescheduling. Read the{" "}
          <Link href="/terms" className="font-semibold text-river">
            final terms
          </Link>
          .
        </p>
      </div>

      <label className="flex items-start gap-3 text-xs leading-5 text-stone">
        <input
          required
          name="legalAgreement"
          type="checkbox"
          checked={legalAccepted}
          onChange={(event) => {
            setLegalAccepted(event.target.checked);
            if (event.target.checked) setLegalError("");
          }}
          className="mt-1 h-4 w-4 accent-[#12372A]"
        />
        I agree to the{" "}
        <Link href="/terms" className="font-semibold text-river">
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-semibold text-river">
          Privacy Policy
        </Link>
        .
      </label>

      {legalError && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {legalError}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <a
        href="https://wa.me/92946000000"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-river"
      >
        <MessageCircle size={15} />
        Prefer WhatsApp? Ask on WhatsApp
      </a>

      <button
        disabled={submitted || submitting}
        className="button min-h-12 bg-pine text-white hover:bg-[#0e2c22] disabled:opacity-70"
      >
        {submitted ? "Request submitted" : submitting ? "Submitting request..." : "Submit booking request"}{" "}
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
