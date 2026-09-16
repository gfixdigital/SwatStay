"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Heart, LayoutDashboard, LogOut, Menu, MessageCircle, Mountain, Route, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { TranslationKey } from "@/hooks/useLanguage";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { LoginModal } from "./LoginModal";
import { MobileTravelPreferences, TravelPreferencesMenu } from "./TravelPreferencesMenu";

const links: { key: TranslationKey; href: string }[] = [
  { key: "packages", href: "/packages" },
  { key: "destinations", href: "/#destinations" },
  { key: "customTrip", href: "/custom-trip" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { traveler, signOut } = useDemoAuth();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setAccountOpen(false); } };
    const closeOnOutside = (event: MouseEvent) => { if (accountRef.current && !accountRef.current.contains(event.target as Node)) setAccountOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutside);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.removeEventListener("mousedown", closeOnOutside); document.body.style.overflow = ""; };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const isActive = (href: string) => href.startsWith("/#") ? false : pathname.startsWith(href);
  const initials = traveler?.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "TR";
  const firstName = traveler?.name.split(" ")[0] || "Traveler";

  function logout() {
    signOut();
    setAccountOpen(false);
    setOpen(false);
    router.push("/");
  }

  return <>
    <header className="sticky top-0 z-40 border-b border-border bg-snow/95 backdrop-blur-sm print:hidden">
      <div className="container flex h-[72px] items-center gap-4 md:h-[84px] md:gap-5">
        <Link href="/" onClick={closeMenu} className="group flex min-w-0 shrink-0 items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-pine sm:text-xl"><span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-brand bg-pine text-white transition-transform duration-300 group-hover:-rotate-6"><Mountain size={19}/><span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border-2 border-snow bg-amber"/></span><span>Swat<span className="text-river">Stay</span></span></Link>
        <div className="hidden h-7 w-px bg-border lg:block"/>
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">{links.map(({ key, href }) => <Link key={href} href={href} className={`group relative px-2.5 py-3 text-[13px] font-semibold transition-colors ${isActive(href) ? "text-pine" : "text-stone hover:text-pine"}`}>{t(key)}<span className={`absolute bottom-1.5 left-2.5 right-2.5 h-px origin-left bg-river transition-transform duration-300 ${isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/></Link>)}</nav>

        <div className="ml-auto flex items-center gap-2">
          <TravelPreferencesMenu/>
          {traveler ? <>
            <Link href="/dashboard" className="hidden h-10 items-center gap-2 rounded-brand bg-pine px-3.5 text-sm font-semibold text-white hover:bg-[#0e2c22] md:flex"><LayoutDashboard size={16}/> My dashboard</Link>
            <div ref={accountRef} className="relative hidden md:block"><button type="button" onClick={() => setAccountOpen((value) => !value)} className="flex h-10 items-center gap-2 rounded-brand border border-border bg-white px-2.5 text-left hover:border-river hover:bg-mist" aria-expanded={accountOpen}><span className="grid h-7 w-7 place-items-center rounded-md bg-mist text-xs font-bold text-pine">{initials}</span><span className="hidden xl:block"><strong className="block max-w-24 truncate text-xs text-charcoal">{firstName}</strong><small className="block text-[10px] text-stone">Traveler account</small></span><ChevronDown size={14} className={`text-stone transition-transform ${accountOpen ? "rotate-180" : ""}`}/></button><AnimatePresence>{accountOpen && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .15 }} className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-brand border border-border bg-white shadow-editorial"><div className="border-b border-border bg-mist p-3"><strong className="block text-sm text-charcoal">{traveler.name}</strong><span className="mt-0.5 block truncate text-xs text-stone">{traveler.email}</span></div><AccountLink href="/dashboard" icon={<LayoutDashboard size={16}/>} label="My dashboard" onClick={() => setAccountOpen(false)}/><AccountLink href="/saved-packages" icon={<Heart size={16}/>} label="Saved packages" onClick={() => setAccountOpen(false)}/><AccountLink href="/packages" icon={<Route size={16}/>} label="Plan another trip" onClick={() => setAccountOpen(false)}/><button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-3 border-t border-border px-3 text-sm font-semibold text-[#9c3f2e] hover:bg-[#fff0ed]"><LogOut size={16}/> Sign out</button></motion.div>}</AnimatePresence></div>
          </> : <>
            <button type="button" className="hidden px-2 text-[13px] font-semibold text-stone hover:text-pine md:block" onClick={() => setLogin(true)}>{t("login")}</button>
            <a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-xs font-semibold text-river hover:text-pine 2xl:flex"><MessageCircle size={15}/>{t("whatsapp")}</a>
            <Link href="/packages" className="hidden h-11 items-stretch overflow-hidden rounded-brand bg-pine text-sm font-semibold text-white shadow-[0_5px_16px_rgba(18,55,42,.16)] hover:bg-[#0e2c22] sm:inline-flex"><span className="flex items-center px-4">{t("bookTrip")}</span><span className="grid w-10 place-items-center border-l border-white/20"><ArrowRight size={16}/></span></Link>
          </>}
          <button type="button" className="grid h-11 w-11 place-items-center rounded-brand border border-border bg-white text-pine transition hover:border-river hover:bg-mist lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={22}/> : <Menu size={22}/>}<span className="sr-only">{open ? "Close menu" : "Open menu"}</span></button>
        </div>
      </div>

      <AnimatePresence>{open && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 top-[72px] z-10 bg-charcoal/25 lg:hidden" onClick={closeMenu}/><motion.nav id="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .2, ease: "easeOut" }} className="relative z-20 border-t border-border bg-snow shadow-editorial lg:hidden" aria-label="Mobile navigation"><div className="container max-h-[calc(100dvh-72px)] overflow-y-auto py-5">{traveler && <div className="mb-4 flex items-center gap-3 rounded-brand border border-border bg-white p-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-mist text-sm font-bold text-pine">{initials}</span><div className="min-w-0"><strong className="block text-sm text-charcoal">{traveler.name}</strong><span className="block truncate text-xs text-stone">{traveler.email}</span></div></div>}<div className="mb-4"><MobileTravelPreferences/></div>{traveler && <div className="mb-4 grid grid-cols-2 gap-2"><Link href="/dashboard" onClick={closeMenu} className="button bg-pine text-white"><LayoutDashboard size={15}/> Dashboard</Link><Link href="/saved-packages" onClick={closeMenu} className="button border-border bg-white text-pine"><Heart size={15}/> Saved</Link></div>}<div className="grid gap-1">{[...links, ...(!traveler ? [{ key: "saved" as TranslationKey, href: "/saved-packages" }] : [])].map(({ key, href }, index) => <Link key={href} href={href} onClick={closeMenu} className={`flex items-center justify-between border-b border-border/70 px-1 py-3 font-display text-lg font-bold ${isActive(href) ? "text-pine" : "text-charcoal"}`}><span><span className="mr-3 text-[10px] font-semibold text-amber">0{index + 1}</span>{t(key)}</span><ArrowUpRight size={17} className="text-river"/></Link>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="button border-border bg-white text-river hover:bg-mist"><MessageCircle size={15}/>{t("whatsapp")}</a><Link href="/packages" onClick={closeMenu} className="button bg-pine text-white hover:bg-[#0e2c22]">{traveler ? "Plan a trip" : t("bookTrip")}<ArrowUpRight size={15}/></Link></div>{traveler ? <button type="button" onClick={logout} className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 text-sm font-semibold text-[#9c3f2e]"><LogOut size={15}/> Sign out</button> : <button type="button" onClick={() => { setLogin(true); closeMenu(); }} className="mt-4 w-full text-sm font-semibold text-stone">{t("login")}</button>}</div></motion.nav></>}</AnimatePresence>
    </header>
    {!traveler && <LoginModal open={login} onClose={() => setLogin(false)}/>}
  </>;
}

function AccountLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) { return <Link href={href} onClick={onClick} className="flex min-h-11 items-center gap-3 px-3 text-sm font-semibold text-charcoal hover:bg-mist hover:text-pine">{icon}{label}</Link>; }
