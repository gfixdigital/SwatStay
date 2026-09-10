"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Languages, Menu, MessageCircle, Mountain, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoginModal } from "./LoginModal";

const links = [["Packages", "/packages"], ["Destinations", "/#destinations"], ["Custom trip", "/custom-trip"], ["About", "/about"], ["Contact", "/contact"]] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [open]);
  const closeMenu = () => setOpen(false);
  const isActive = (href: string) => href === "/packages" ? pathname.startsWith("/packages") : href === "/custom-trip" ? pathname.startsWith("/custom-trip") : href === "/about" ? pathname.startsWith("/about") : href === "/contact" ? pathname.startsWith("/contact") : false;
  return <>
    <header className="sticky top-0 z-40 border-b border-border bg-snow/95 backdrop-blur-sm">
      <div className="container flex h-[72px] items-center gap-4 md:h-[84px] md:gap-7">
        <Link href="/" onClick={closeMenu} className="group flex min-w-0 shrink-0 items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-pine sm:text-xl">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-brand bg-pine text-white transition-transform duration-300 group-hover:-rotate-6"><Mountain size={19}/><span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border-2 border-snow bg-amber"/></span>
          <span>Swat<span className="text-river">Stay</span></span>
        </Link>
        <div className="hidden h-7 w-px bg-border lg:block"/>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className={`group relative px-3 py-3 text-[13px] font-semibold transition-colors ${isActive(href) ? "text-pine" : "text-stone hover:text-pine"}`}>
            {label}<span className={`absolute bottom-1.5 left-3 right-3 h-px origin-left bg-river transition-transform duration-300 ${isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
          </Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button type="button" className="hidden h-10 items-center gap-1 border-l border-border pl-4 text-xs font-semibold text-stone transition hover:text-pine lg:flex"><Languages size={15} className="text-river"/> EN <ChevronDown size={13}/></button>
          <button type="button" className="hidden px-2 text-[13px] font-semibold text-stone hover:text-pine md:block" onClick={() => setLogin(true)}>Log in</button>
          <a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-xs font-semibold text-river hover:text-pine lg:flex"><MessageCircle size={15}/> WhatsApp</a>
          <Link href="/packages" className="button hidden min-h-10 gap-2 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22] sm:inline-flex md:px-4 md:text-sm">Book a trip <ArrowUpRight size={15}/></Link>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-brand border border-border bg-white text-pine transition hover:border-river hover:bg-mist md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">
            {open ? <X size={22}/> : <Menu size={22}/>}<span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 top-[72px] z-10 bg-charcoal/25 md:hidden" onClick={closeMenu}/>
          <motion.nav id="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .2, ease: "easeOut" }} className="relative z-20 border-t border-border bg-snow shadow-editorial md:hidden" aria-label="Mobile navigation">
            <div className="container py-5"><div className="mb-3 flex items-center justify-between border-b border-border pb-3"><span className="text-[11px] font-bold uppercase tracking-[.12em] text-river">Explore Swat</span><span className="text-xs text-stone">Local travel, clearly arranged</span></div><div className="grid gap-1">{links.map(([label, href], index) => <Link key={href} href={href} onClick={closeMenu} className={`flex items-center justify-between border-b border-border/70 px-1 py-3.5 font-display text-lg font-bold ${isActive(href) ? "text-pine" : "text-charcoal"}`}><span><span className="mr-3 text-[10px] font-semibold text-amber">0{index + 1}</span>{label}</span><ArrowUpRight size={17} className="text-river"/></Link>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="button border-border bg-white text-river hover:bg-mist"><MessageCircle size={15}/> WhatsApp</a><Link href="/packages" onClick={closeMenu} className="button bg-pine text-white hover:bg-[#0e2c22]">Book a trip <ArrowUpRight size={15}/></Link></div><button type="button" onClick={() => { setLogin(true); closeMenu(); }} className="mt-3 w-full text-sm font-semibold text-stone">Log in</button></div>
          </motion.nav>
        </>}
      </AnimatePresence>
    </header>
    <LoginModal open={login} onClose={() => setLogin(false)}/>
  </>;
}
