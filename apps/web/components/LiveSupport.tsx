"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Headphones, MessageCircle, PhoneCall, Send, ShieldCheck, X } from "lucide-react";
import { FormEvent, useState } from "react";

type Message = { from: "team" | "guest"; text: string; time: string };

const quickActions = ["Where is my booking?", "Change pickup details", "I need help at a service", "Payment question"];

export function LiveSupport() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: "team", text: "Hello. You are connected to the SwatStay field desk. How can we help with your trip?", time: "Now" }]);

  function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    setMessages((current) => [...current, { from: "guest", text, time: "Now" }]);
    setDraft("");
    setTyping(true);
    window.setTimeout(() => { setMessages((current) => [...current, { from: "team", text: "Thanks, we have your message. A field coordinator will review it and follow up with the trip details shortly.", time: "Now" }]); setTyping(false); }, 900);
  }
  function useQuickAction(action: string) { setDraft(action); }

  return <>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .97 }} transition={{ duration: .2 }} className="fixed bottom-20 right-4 z-[70] w-[min(390px,calc(100vw-32px))] overflow-hidden rounded-brand border border-border bg-snow shadow-editorial sm:bottom-24 sm:right-6"><div className="bg-pine p-4 text-white"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10"><Headphones size={20}/></span><div><div className="flex items-center gap-2"><h2 className="font-display text-lg font-bold">SwatStay support</h2><span className="flex items-center gap-1 text-[10px] font-semibold text-[#c3ebd8]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8fd0ae]"/> Live</span></div><p className="mt-1 text-xs text-[#c3ebd8]">Field desk · usually replies in a few minutes</p></div></div><button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close support"><X size={18}/></button></div></div><div className="border-b border-border bg-white px-4 py-3"><div className="flex items-center gap-2 text-xs font-semibold text-pine"><ShieldCheck size={15} className="text-river"/> Trip support is available during your stay</div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{quickActions.map((action) => <button type="button" key={action} onClick={() => useQuickAction(action)} className="shrink-0 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-stone hover:border-river hover:bg-mist hover:text-pine">{action}</button>)}</div></div><div className="max-h-72 space-y-3 overflow-y-auto bg-snow p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.time}-${index}`} className={`flex ${message.from === "guest" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-brand border px-3 py-2 ${message.from === "guest" ? "border-pine bg-pine text-white" : "border-border bg-white text-charcoal"}`}><p className="text-xs leading-5">{message.text}</p><span className={`mt-1 block text-[10px] ${message.from === "guest" ? "text-[#c3ebd8]" : "text-stone"}`}>{message.time}</span></div></div>)}{typing && <div className="flex items-center gap-2 text-xs text-stone"><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-river"/><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-river [animation-delay:150ms]"/><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-river [animation-delay:300ms]"/></span> Field desk is typing...</div>}</div><form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-border bg-white p-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} className="field h-10 min-w-0 flex-1 text-xs" placeholder="Write a message..." aria-label="Message support"/><button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-brand bg-pine text-white hover:bg-[#0e2c22]" aria-label="Send message"><Send size={16}/></button></form><div className="grid grid-cols-2 gap-2 border-t border-border bg-white p-3"><a href="tel:+92946000000" className="button min-h-9 border-border bg-white px-2 text-[11px] text-pine"><PhoneCall size={14}/> Call desk</a><a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="button min-h-9 bg-mist px-2 text-[11px] text-pine"><MessageCircle size={14}/> WhatsApp</a></div></motion.div>}</AnimatePresence><button type="button" onClick={() => setOpen((value) => !value)} className="fixed bottom-4 right-4 z-[70] flex h-12 items-center gap-2 rounded-brand border border-pine bg-pine px-4 text-sm font-semibold text-white shadow-editorial transition hover:-translate-y-0.5 hover:bg-[#0e2c22] sm:bottom-6 sm:right-6" aria-expanded={open} aria-label={open ? "Close live support" : "Open live support"}>{open ? <X size={18}/> : <MessageCircle size={18}/>}<span className="hidden sm:inline">{open ? "Close support" : "Live support"}</span>{!open && <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-snow bg-amber"/>}</button>
  </>;
}
