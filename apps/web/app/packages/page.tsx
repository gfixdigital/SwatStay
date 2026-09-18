import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageEnter, Reveal } from "@/components/Animated";
import { PackageCatalog } from "@/components/PackageCatalog";
import Link from "next/link";
import { PackageComparison } from "@/components/PackageComparison";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Swat Tour Packages | SwatStay", description: "Compare call-confirmed Swat tour packages with hotels, transport, meals, guides, and local provider support." };
export default function PackagesPage() { return <><Header/><PageEnter><main className="section"><div className="container"><Reveal><div className="max-w-2xl"><div className="eyebrow">PLAN YOUR STAY</div><h1 className="font-display text-4xl font-bold md:text-5xl">Swat tour packages</h1><p className="mt-4 text-stone">Compare practical itineraries and request a call-confirmed booking with local operators.</p></div></Reveal><div className="mt-8 flex flex-col gap-4 border-y border-border bg-mist px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><span className="eyebrow mb-1 block">NOT SURE WHICH ROUTE FITS?</span><h2 className="font-display text-xl font-bold text-pine">Build a trip around your own pace.</h2><p className="mt-1 text-sm text-stone">Share your dates, budget, interests, and stay preference with our local planning team.</p></div><Link href="/custom-trip" className="button shrink-0 bg-pine text-white hover:bg-[#0e2c22]">Plan a custom trip <span aria-hidden="true">↗</span></Link></div><div className="mt-8"><PackageCatalog/></div><PackageComparison/></div></main></PageEnter><Footer/></>; }
