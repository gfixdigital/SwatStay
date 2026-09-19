import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./Animated";
import { promotionBanner } from "@/data/siteContent";

export function PromotionBanner() {
  const banner = promotionBanner;
  if (!banner.isActive) return null;

  return (
    <section className="!py-10 md:!py-12">
      <div className="container">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-5 rounded-brand border border-border bg-mist p-5 shadow-editorial sm:flex-row sm:items-center md:p-7">
            <div className="min-w-0">
              <div className="eyebrow">{banner.eyebrow}</div>
              <h2 className="font-display text-xl font-bold text-charcoal sm:text-2xl">{banner.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone">{banner.description}</p>
            </div>
            <Link
              href={banner.ctaHref}
              className="button min-h-11 w-full shrink-0 gap-2 bg-pine px-4 text-sm text-white hover:bg-[#0e2c22] sm:w-auto"
            >
              {banner.ctaLabel} <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
