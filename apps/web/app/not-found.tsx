import Link from "next/link";
import { FileQuestion, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() { return <><Header/><main className="grid min-h-[60vh] place-items-center px-4 py-20"><div className="max-w-lg text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mist text-pine"><FileQuestion size={28}/></span><div className="eyebrow mt-6">PAGE NOT FOUND</div><h1 className="font-display text-4xl font-bold text-pine">That route is not available.</h1><p className="mt-4 text-sm leading-6 text-stone">The page may have moved or the package link may be incomplete. Start from the main travel options or contact the team.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/" className="button bg-pine text-white">Go to homepage</Link><Link href="/packages" className="button border-border bg-white text-pine">Browse packages</Link><Link href="/contact" className="button border-border bg-white text-pine"><MessageCircle size={15}/> Contact</Link></div></div></main><Footer/></> }
