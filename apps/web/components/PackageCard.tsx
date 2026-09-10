"use client";

import { motion } from "framer-motion";
import { Hotel, Route } from "lucide-react";
import Link from "next/link";
import type { TourPackage } from "@/types/package";
import { useLanguage } from "@/hooks/useLanguage";
import { CurrencyPrice } from "./CurrencyPrice";
import { InteractiveServiceBadges } from "./InteractiveServiceBadges";
import { SavedPackageButton } from "./SavedPackageButton";

export function PackageCard({ item, arc = false, position = "center" }: { item: TourPackage; arc?: boolean; position?: "left" | "center" | "right" }) {
  const arcClass = arc ? { left: "lg:-rotate-1 lg:translate-y-2", center: "", right: "lg:rotate-1 lg:translate-y-2" }[position] : "";
  const hotel = item.serviceDetails.find((detail) => detail.service === "Hotel");
  const { t } = useLanguage();

  return <motion.article
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .2 }}
    whileHover={{ y: -3 }}
    transition={{ duration: .3, ease: "easeOut" }}
    className={`group relative rounded-brand border border-border bg-white shadow-[0_1px_0_rgba(18,55,42,.04)] transition-shadow hover:z-30 hover:shadow-editorial focus-within:z-30 ${arcClass}`}
  >
    <div className="relative overflow-hidden rounded-t-brand"><div className="relative h-52 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]" style={{ backgroundImage: `url(${item.image})` }}/><SavedPackageButton slug={item.slug} compact className="absolute right-3 top-3 z-10 bg-white/95 shadow-editorial"/></div>
    <div className="p-[18px]">
      <div className="flex justify-between text-xs text-stone"><span className="font-bold text-river">{item.type} · {item.tier}</span><span>{item.duration}</span></div>
      <h3 className="mt-3 font-display text-xl font-bold">{item.title}</h3>
      <p className="mt-2 flex items-center gap-1 text-xs text-stone"><Route size={15} className="text-river"/> {item.route}</p>
      {hotel && <p className="mt-2 text-xs text-stone"><Hotel size={14} className="mr-1 inline text-river"/>Stay: <strong className="text-charcoal">{hotel.providerName}</strong></p>}
      <div className="mt-5 border-t border-border pt-3"><InteractiveServiceBadges details={item.serviceDetails} compact/></div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4"><CurrencyPrice amountPkr={item.price} className="font-display text-xl text-amber"/><Link href={`/packages/${item.slug}`} className="button min-h-[38px] shrink-0 border-border bg-white px-3 text-xs text-pine hover:bg-mist">{t("viewDetails")}</Link></div>
    </div>
  </motion.article>;
}
