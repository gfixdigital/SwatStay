import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Car, Check, Clock3, Hotel, MapPin, Mountain, Route, ShieldCheck, Utensils } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ItinerarySection } from "@/components/ItinerarySection";
import { PackageActions } from "@/components/PackageActions";
import { PackageBookingModal } from "@/components/PackageBookingModal";
import { PackageViewTracker } from "@/components/PackageViewTracker";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { InteractiveServiceBadges } from "@/components/InteractiveServiceBadges";
import { PageEnter } from "@/components/Animated";
import { getPackage } from "@/lib/api";
import type { PackageServiceDetail, Service, TourPackage } from "@/types/package";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPackage(slug);
  return {
    title: item ? `${item.title} | SwatStay` : "Swat Package | SwatStay",
    description: item ? `${item.description} Call-confirmed booking support across Swat Valley.` : "Compare call-confirmed Swat tour packages.",
    openGraph: item ? { title: item.title, description: item.description, images: [{ url: item.image }] } : undefined,
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPackage(slug);
  if (!item) notFound();

  return <>
    <PackageViewTracker slug={item.slug}/>
    <Header/>
    <PageEnter>
      <main className="pb-24 print:hidden lg:pb-0">
        <div className="border-b border-border bg-white">
          <div className="container flex min-h-12 items-center gap-2 text-xs text-stone">
            <Link href="/packages" className="inline-flex items-center gap-1 font-semibold text-river hover:text-pine"><ArrowLeft size={14}/> Packages</Link>
            <span>/</span>
            <span className="truncate">{item.destination}</span>
          </div>
        </div>

        <section className="py-7 md:py-10">
          <div className="container grid gap-7 lg:grid-cols-[1.12fr_.88fr] lg:items-center">
            <div className="relative aspect-[16/10] max-h-[430px] overflow-hidden rounded-brand border border-border bg-mist">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}/>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent px-5 pb-5 pt-16 text-white">
                <span className="text-xs font-semibold">{item.destination} · {item.duration}</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-river"><span>{item.type} trip</span><span className="h-1 w-1 rounded-full bg-border"/><span>{item.tier} plan</span></div>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-pine sm:text-4xl md:text-5xl">{item.title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-stone md:text-base">{item.description}</p>
              <div className="mt-5 grid gap-3 border-y border-border py-4 sm:grid-cols-2">
                <OverviewItem icon={<Route/>} label="Route" value={item.route}/>
                <OverviewItem icon={<Clock3/>} label="Duration" value={item.duration}/>
              </div>
              <div className="mt-5"><InteractiveServiceBadges details={item.serviceDetails}/></div>
              <p className="mt-5 text-xs leading-5 text-stone"><ShieldCheck size={15} className="mr-1 inline text-river"/>This is a booking request. Dates, provider availability, and final price are confirmed by phone.</p>
              <PackageActions slug={item.slug} title={item.title}/>
            </div>
          </div>
        </section>

        <nav className="border-y border-border bg-white" aria-label="Package sections">
          <div className="container flex gap-6 overflow-x-auto py-3 text-xs font-semibold text-stone">
            <a href="#itinerary" className="whitespace-nowrap hover:text-pine">Itinerary</a>
            <a href="#providers" className="whitespace-nowrap hover:text-pine">Stay and providers</a>
            <a href="#pricing" className="whitespace-nowrap hover:text-pine">Pricing</a>
            <a href="#cancellation" className="whitespace-nowrap hover:text-pine">Cancellation</a>
          </div>
        </nav>

        <section className="py-10 md:py-14">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="min-w-0 space-y-12">
              <section id="itinerary" className="scroll-mt-32">
                <SectionHeading eyebrow="TRIP PLAN" title="Day-by-day itinerary" text="A clear route with enough flexibility for weather, roads, and local availability."/>
                <div className="mt-6 rounded-brand border border-border bg-white p-5 md:p-6"><ItinerarySection itinerary={item.itinerary}/></div>
              </section>

              <section id="providers" className="scroll-mt-32">
                <SectionHeading eyebrow="STAY AND PROVIDERS" title="Current service plan" text="These sample frontend assignments show what the package includes. The operations team can replace a provider after checking availability."/>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">{item.serviceDetails.map((detail) => <ProviderCard key={`${detail.service}-${detail.providerName}`} detail={detail}/>)}</div>
              </section>

              <section id="pricing" className="scroll-mt-32">
                <SectionHeading eyebrow="PACKAGE PRICE" title="Simple price summary" text="Your confirmation call covers any date, room, vehicle, or group-size changes."/>
                <div className="mt-6"><PriceBreakdown price={item.price}/></div>
              </section>

              <section id="cancellation" className="scroll-mt-32 border-t border-border pt-8">
                <div className="eyebrow mb-1">CANCELLATION SUMMARY</div>
                <h2 className="font-display text-2xl font-bold text-pine">Know the conditions before payment</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone sm:grid-cols-2">
                  <PolicyItem>Cancellation depends on provider policy and booking date.</PolicyItem>
                  <PolicyItem>GFix confirms refund rules during the confirmation call.</PolicyItem>
                  <PolicyItem>Weather and road changes may require rescheduling.</PolicyItem>
                  <PolicyItem>Final terms are available in the <Link href="/terms" className="font-semibold text-river">Terms and Conditions</Link>.</PolicyItem>
                </ul>
              </section>
            </div>

            <PackageBookingModal packageTitle={item.title} packageImage={item.image} price={item.price} duration={item.duration} packageSlug={item.slug} destination={item.destination}/>
          </div>
        </section>
      </main>
    </PageEnter>
    <div className="print:hidden"><Footer/></div>
    <PrintItinerary item={item}/>
  </>;
}

function PrintItinerary({ item }: { item: TourPackage }) {
  return <article className="hidden bg-white p-8 text-black print:block">
    <header className="border-b border-black pb-5"><p className="text-sm font-semibold">SwatStay itinerary</p><h1 className="mt-2 text-3xl font-bold">{item.title}</h1><p className="mt-2">Destination: {item.destination}</p><p>Duration: {item.duration}</p><p>Route: {item.route}</p></header>
    <section className="mt-6"><h2 className="text-xl font-bold">Included services</h2><ul className="mt-3 list-disc space-y-1 pl-5">{item.serviceDetails.map((detail) => <li key={`${detail.service}-${detail.providerName}`}><strong>{detail.service}:</strong> {detail.title}, {detail.providerName}</li>)}</ul></section>
    <section className="mt-7"><h2 className="text-xl font-bold">Day-by-day itinerary</h2><div className="mt-3 space-y-4">{item.itinerary.map((day) => <div key={day.day} className="border-t border-gray-400 pt-3"><strong>{day.day}: {day.title}</strong><p className="mt-1">{day.description}</p></div>)}</div></section>
    <section className="mt-7"><h2 className="text-xl font-bold">Cancellation summary</h2><ul className="mt-3 list-disc space-y-1 pl-5"><li>Cancellation depends on provider policy and booking date.</li><li>GFix confirms refund rules during the confirmation call.</li><li>Weather and road changes may require rescheduling.</li><li>Final terms are available on the SwatStay Terms and Conditions page.</li></ul></section>
    <footer className="mt-8 border-t border-black pt-4 text-sm"><strong>Contact note:</strong> Contact the SwatStay team by phone or WhatsApp to confirm current providers, availability, and final pricing before payment.</footer>
  </article>;
}

function OverviewItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex min-w-0 gap-3"><span className="mt-0.5 shrink-0 text-river [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wide text-stone">{label}</span><strong className="mt-1 block text-sm font-semibold text-charcoal">{value}</strong></div></div>;
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="max-w-2xl"><div className="eyebrow mb-1">{eyebrow}</div><h2 className="font-display text-2xl font-bold text-pine md:text-3xl">{title}</h2><p className="mt-2 text-sm leading-6 text-stone">{text}</p></div>;
}

function ProviderCard({ detail }: { detail: PackageServiceDetail }) {
  return <article className="rounded-brand border border-border bg-white p-4">
    <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-brand bg-mist text-river">{serviceIcon(detail.service)}</span><div className="min-w-0"><span className="text-[10px] font-bold uppercase tracking-wide text-river">{detail.service}</span><h3 className="mt-0.5 font-display text-base font-bold text-charcoal">{detail.title}</h3></div></div>
    <div className="mt-4 border-t border-border pt-3"><p className="text-sm font-semibold text-pine">{detail.providerName}</p><p className="mt-1 text-xs leading-5 text-stone">{detail.description}</p>{detail.location && <p className="mt-2 flex items-center gap-1 text-xs text-stone"><MapPin size={13} className="text-river"/>{detail.location}</p>}</div>
    <span className="mt-3 inline-block rounded-md border border-border bg-mist px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-stone">{detail.assignmentStatus === "sample" ? "Sample assignment" : "To be confirmed"}</span>
  </article>;
}

function PolicyItem({ children }: { children: ReactNode }) {
  return <li className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-river"/><span>{children}</span></li>;
}

function serviceIcon(service: Service) {
  if (service === "Hotel") return <Hotel size={18}/>;
  if (service === "Transport") return <Car size={18}/>;
  if (service === "Meals") return <Utensils size={18}/>;
  return <Mountain size={18}/>;
}
