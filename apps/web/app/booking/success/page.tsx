import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageEnter } from "@/components/Animated";
export default function BookingSuccessPage() { return <><Header/><PageEnter><main className="grid min-h-[60vh] place-items-center px-4 py-20"><div className="max-w-xl text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mist text-pine"><CheckCircle2 size={32}/></span><div className="eyebrow mt-6">REQUEST RECEIVED</div><h1 className="font-display text-4xl font-bold">We will call you to confirm your trip</h1><p className="mt-4 text-stone">Your request has been recorded for this prototype. Our team will confirm your dates, travelers, and provider availability before anything is booked.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/packages" className="button bg-pine text-white">Browse more packages</Link><Link href="/" className="button border-border bg-white text-pine">Return home</Link></div></div></main></PageEnter><Footer/></>; }
