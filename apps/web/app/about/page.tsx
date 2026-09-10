import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CheckCircle2, Globe2, Handshake, PhoneCall } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageEnter } from "@/components/Animated";

export const metadata: Metadata = { title: "About SwatStay | Local Swat Travel Support", description: "Learn how SwatStay helps Pakistani and international tourists arrange practical, call-confirmed travel across Swat Valley." };

const stories = [
  { icon: <Handshake/>, title: "Built by GFix for local travel", text: "GFix is building SwatStay to make local tourism easier to coordinate for travelers and service providers." },
  { icon: <PhoneCall/>, title: "Call-confirmed, not instant", text: "The team confirms dates, availability, pickup, payment preferences, and provider arrangements by phone." },
  { icon: <CheckCircle2/>, title: "A local provider network", text: "Hotels, transport operators, restaurants, guides, and activity providers share services for review." },
  { icon: <Globe2/>, title: "Support for more travelers", text: "The experience supports Pakistani and international tourists, with English, Urdu, and Chinese planned." },
];

export default function AboutPage() {
  return <><Header/><PageEnter><main className="py-10 md:py-14"><div className="container max-w-5xl"><div className="max-w-3xl"><div className="eyebrow">ABOUT SWATSTAY</div><h1 className="font-display text-3xl font-bold leading-tight text-pine sm:text-4xl md:text-5xl">A clearer way to arrange travel across Swat Valley.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-stone md:text-base">SwatStay helps tourists compare travel packages and send one request for hotels, transport, meals, guides, and activities.</p></div><div className="mt-8 grid gap-3 md:grid-cols-2">{stories.map((story) => <Story key={story.title} {...story}/>)}</div><section className="mt-9 border-t border-border pt-6"><div className="eyebrow">HOW THE MODEL WORKS</div><div className="mt-4 grid gap-3 sm:grid-cols-4">{["Choose a package or custom plan", "Send your travel details", "Confirm practical details by call", "Providers are arranged after confirmation"].map((item, index) => <div key={item} className="border-t border-border pt-3"><span className="text-xs font-bold text-amber">0{index + 1}</span><p className="mt-2 text-sm font-semibold leading-5 text-charcoal">{item}</p></div>)}</div></section></div></main></PageEnter><Footer/></>;
}

function Story({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="flex gap-3 rounded-brand border border-border bg-white p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-mist text-river [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span><div><h2 className="font-display text-base font-bold text-charcoal md:text-lg">{title}</h2><p className="mt-1 text-sm leading-5 text-stone">{text}</p></div></article>;
}
