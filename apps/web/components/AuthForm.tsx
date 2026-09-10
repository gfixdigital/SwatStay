"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { CountryPhoneField, Country } from "./CountryPhoneField";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [country, setCountry] = useState<Country>({ name: "Pakistan", code: "+92", flag: "PK" });
  const [cnic, setCnic] = useState("");
  const isPakistan = country.name === "Pakistan";
  function formatCnic(value: string) { const digits = value.replace(/\D/g, "").slice(0, 13); if (digits.length <= 5) return digits; if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`; return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`; }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); if (signup) { const data = new FormData(event.currentTarget); if (data.get("password") !== data.get("confirmPassword")) { setError("Passwords do not match."); return; } } setSubmitted(true); }
  return <form onSubmit={submit} className="grid gap-4 rounded-brand border border-border bg-white/95 p-5 shadow-editorial backdrop-blur-sm sm:p-7">
    {signup ? <div className="grid gap-4 sm:grid-cols-2"><Field label="First name"><input required name="firstName" className="field mt-1 w-full" placeholder="Ayesha"/></Field><Field label="Last name"><input required name="lastName" className="field mt-1 w-full" placeholder="Khan"/></Field></div> : null}
    <Field label="Email address"><span className="relative mt-1 block"><Mail size={17} className="absolute left-3 top-3 text-stone"/><input required name="email" type="email" className="field w-full pl-10" placeholder="you@example.com"/></span></Field>
    {signup && <CountryPhoneField onCountryChange={setCountry}/>} 
    {signup && isPakistan ? <Field label="CNIC number"><span className="relative mt-1 block"><input required name="cnic" value={cnic} onChange={(event) => setCnic(formatCnic(event.target.value))} inputMode="numeric" pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}" title="Enter 13 CNIC digits, for example 15602-6883076-1" className="field w-full" placeholder="15602-6883076-1"/><span className="pointer-events-none absolute right-3 top-3 text-[10px] text-stone">{cnic.replace(/\D/g, "").length}/13</span></span><span className="mt-1 block text-[11px] font-normal text-stone">Your CNIC is formatted automatically as you type.</span></Field> : signup ? <div className="grid gap-4 sm:grid-cols-2"><Field label="Passport number"><input required name="passportNumber" inputMode="text" pattern="[A-Za-z0-9 -]{5,20}" className="field mt-1 w-full uppercase" placeholder="Passport number"/></Field><Field label="Passport expiry"><input required name="passportExpiry" type="date" className="field mt-1 w-full"/></Field></div> : null}
    {signup && <div className="grid gap-4 sm:grid-cols-2"><Field label="Date of birth"><input required name="dateOfBirth" type="date" className="field mt-1 w-full"/></Field><Field label="Preferred language"><select name="language" className="field mt-1 w-full"><option>English</option><option>Urdu</option><option>Chinese</option></select></Field></div>}
    {signup && <Field label="Home address"><textarea required name="address" rows={3} className="mt-1 w-full rounded-brand border border-border p-3 outline-none focus:border-river focus:ring-1 focus:ring-river" placeholder="Street, city, country"/></Field>}
    <div className={signup ? "grid gap-4 sm:grid-cols-2" : ""}><Field label="Password"><span className="relative mt-1 block"><LockKeyhole size={17} className="absolute left-3 top-3 text-stone"/><input required name="password" type={showPassword ? "text" : "password"} minLength={8} className="field w-full pl-10 pr-11" placeholder="At least 8 characters"/><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-2.5 text-stone" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span></Field>{signup && <Field label="Confirm password"><input required name="confirmPassword" type={showPassword ? "text" : "password"} minLength={8} className="field mt-1 w-full" placeholder="Repeat your password"/></Field>}</div>
    {!signup && <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-stone"><input type="checkbox" className="h-4 w-4 accent-[#12372A]"/> Remember me</label><button type="button" className="font-semibold text-river">Forgot password?</button></div>}
    {signup && <label className="flex items-start gap-2 text-xs leading-5 text-stone"><input required name="terms" type="checkbox" className="mt-1 h-4 w-4 accent-[#12372A]"/> I agree to the <Link href="/terms" className="font-semibold text-river">Terms and Conditions</Link> and <Link href="/privacy" className="font-semibold text-river">Privacy Policy</Link>.</label>}
    {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
    <button disabled={submitted} className="button min-h-12 bg-pine text-white hover:bg-[#0e2c22] disabled:opacity-70">{submitted ? (signup ? "Account request saved" : "Demo login complete") : signup ? "Create my account" : "Log in"} <ArrowRight size={16}/></button>
    <div className="flex items-center gap-3 text-xs text-stone"><span className="h-px flex-1 bg-border"/> {signup ? "Already registered?" : "New to SwatStay?"} <span className="h-px flex-1 bg-border"/></div><p className="text-center text-sm text-stone"><Link className="font-semibold text-river" href={signup ? "/login" : "/signup"}>{signup ? "Log in instead" : "Create an account"}</Link></p>
  </form>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-xs font-semibold">{label}{children}</label>; }
