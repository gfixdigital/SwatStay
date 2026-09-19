import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { ItinerarySection } from "@/components/ItinerarySection";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { ServiceBadge } from "@/components/ServiceBadge";
import { ReviewSection } from "@/components/ReviewSection";
import { getPackage, packages } from "@/data/packages";
import { PageEnter } from "@/components/Animated";
export function generateStaticParams() { return packages.map((item) => ({ slug: item.slug })); }
export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = getPackage(slug); if (!item) notFound(); return <><Header/><PageEnter><main><section className="relative h-[420px] overflow-hidden text-white"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}/><div className="absolute inset-0 bg-gradient-to-r from-pine/85 to-pine/20"/><div className="container relative flex h-full items-end pb-12"><div><div className="eyebrow text-[#d9eee4]">{item.destination} · {item.duration}</div><h1 className="max-w-3xl font-display text-4xl font-bold md:text-6xl">{item.title}</h1><p className="mt-3 text-[#e9f3ed]">{item.route}</p></div></div></section><section className="section"><div className="container grid gap-12 lg:grid-cols-[1.3fr_.7fr]"><div><div className="eyebrow">PACKAGE OVERVIEW</div><h2 className="font-display text-3xl font-bold">A practical itinerary for a memorable valley stay</h2><p className="mt-4 text-stone">{item.description}</p><div className="my-8 flex flex-wrap gap-2">{item.services.map((service) => <ServiceBadge key={service} service={service}/>)}</div><div className="eyebrow mt-10">DAY-BY-DAY ITINERARY</div><ItinerarySection itinerary={item.itinerary}/><div className="eyebrow mt-10">PRICING</div><PriceBreakdown price={item.price}/></div><div id="booking"><div className="eyebrow">REQUEST THIS TRIP</div><h2 className="mb-4 font-display text-3xl font-bold">Let us confirm the details</h2><BookingForm packageTitle={item.title} packageImage={item.image}/></div></div></section><ReviewSection/></main></PageEnter><Footer/></>; }
