"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Menu, MessageCircle, Mountain, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { TranslationKey } from "@/hooks/useLanguage";
import { useLanguage } from "@/hooks/useLanguage";
import { MobileTravelPreferences, TravelPreferencesMenu } from "./TravelPreferencesMenu";
import { LoginModal } from "./LoginModal";

const links: { key: TranslationKey; href: string }[] = [
  { key: "packages", href: "/packages" },
  { key: "destinations", href: "/#destinations" },
  { key: "customTrip", href: "/custom-trip" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const isActive = (href: string) => href.startsWith("/#") ? false : pathname.startsWith(href);

  return <>
    <header className="sticky top-0 z-40 border-b border-border bg-snow/95 backdrop-blur-sm print:hidden">
      <div className="container flex h-[72px] items-center gap-4 md:h-[84px] md:gap-5">
        <Link href="/" onClick={closeMenu} className="group flex min-w-0 shrink-0 items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-pine sm:text-xl">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-brand bg-pine text-white transition-transform duration-300 group-hover:-rotate-6"><Mountain size={19}/><span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border-2 border-snow bg-amber"/></span>
          <span>Swat<span className="text-river">Stay</span></span>
        </Link>
        <div className="hidden h-7 w-px bg-border lg:block"/>
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {links.map(({ key, href }) => <Link key={href} href={href} className={`group relative px-2.5 py-3 text-[13px] font-semibold transition-colors ${isActive(href) ? "text-pine" : "text-stone hover:text-pine"}`}>
            {t(key)}<span className={`absolute bottom-1.5 left-2.5 right-2.5 h-px origin-left bg-river transition-transform duration-300 ${isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
          </Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <TravelPreferencesMenu/>
          <button type="button" className="hidden px-2 text-[13px] font-semibold text-stone hover:text-pine md:block" onClick={() => setLogin(true)}>{t("login")}</button>
          <a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-xs font-semibold text-river hover:text-pine 2xl:flex"><MessageCircle size={15}/>{t("whatsapp")}</a>
          <Link href="/packages" className="hidden h-11 items-stretch overflow-hidden rounded-brand bg-pine text-sm font-semibold text-white shadow-[0_5px_16px_rgba(18,55,42,.16)] hover:bg-[#0e2c22] sm:inline-flex"><span className="flex items-center px-4">{t("bookTrip")}</span><span className="grid w-10 place-items-center border-l border-white/20"><ArrowRight size={16}/></span></Link>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-brand border border-border bg-white text-pine transition hover:border-river hover:bg-mist lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">
            {open ? <X size={22}/> : <Menu size={22}/>}<span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 top-[72px] z-10 bg-charcoal/25 lg:hidden" onClick={closeMenu}/>
          <motion.nav id="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .2, ease: "easeOut" }} className="relative z-20 border-t border-border bg-snow shadow-editorial lg:hidden" aria-label="Mobile navigation">
            <div className="container max-h-[calc(100dvh-72px)] overflow-y-auto py-5">
              <div className="mb-4"><MobileTravelPreferences/></div>
              <div className="grid gap-1">{[...links, { key: "saved" as TranslationKey, href: "/saved-packages" }].map(({ key, href }, index) => <Link key={href} href={href} onClick={closeMenu} className={`flex items-center justify-between border-b border-border/70 px-1 py-3 font-display text-lg font-bold ${isActive(href) ? "text-pine" : "text-charcoal"}`}><span><span className="mr-3 text-[10px] font-semibold text-amber">0{index + 1}</span>{t(key)}</span><ArrowUpRight size={17} className="text-river"/></Link>)}</div>
              <div className="mt-5 grid grid-cols-2 gap-3"><a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="button border-border bg-white text-river hover:bg-mist"><MessageCircle size={15}/>{t("whatsapp")}</a><Link href="/packages" onClick={closeMenu} className="button bg-pine text-white hover:bg-[#0e2c22]">{t("bookTrip")}<ArrowUpRight size={15}/></Link></div>
              <button type="button" onClick={() => { setLogin(true); closeMenu(); }} className="mt-4 w-full text-sm font-semibold text-stone">{t("login")}</button>
            </div>
          </motion.nav>
        </>}
      </AnimatePresence>
    </header>
    <LoginModal open={login} onClose={() => setLogin(false)}/>
  </>;
}
