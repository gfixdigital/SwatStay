"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Headphones, MessageCircle, PhoneCall, Send, ShieldCheck, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { from: "guest" | "demo"; text: string; time: string };
const quickActions = ["Where is my booking?", "Change pickup details", "I need help at a service", "Payment question"];

export function LiveSupport() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [demoReply, setDemoReply] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: "demo", text: "This is a support request preview. Leave a message and the SwatStay team can follow up by phone or WhatsApp.", time: "Demo" }]);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = conversationRef.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [demoReply, messages, open]);

  function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { from: "guest", text, time: "Draft request" }]);
    setDraft("");
    setDemoReply(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { from: "demo", text: "Demo response: your request is ready to be routed to the support team.", time: "Prototype" }]);
      setDemoReply(false);
    }, 700);
  }

  return <>
    <AnimatePresence>{open && <motion.div
      initial={{ opacity: 0, y: 14, scale: .98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: .98 }}
      transition={{ duration: .18 }}
      className="fixed inset-x-4 bottom-20 z-[70] flex max-h-[calc(100dvh-6.5rem)] w-auto flex-col overflow-hidden rounded-brand border border-border bg-snow shadow-editorial sm:inset-x-auto sm:right-6 sm:w-[390px] sm:max-h-[calc(100dvh-7.5rem)] sm:bottom-24"
    >
      <div className="shrink-0 bg-pine p-4 text-white"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/10"><Headphones size={20}/></span><div><h2 className="font-display text-lg font-bold">Support request</h2><p className="mt-1 text-xs text-[#c3ebd8]">Need help planning? Send the team a note.</p></div></div><button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close support"><X size={18}/></button></div></div>
      <div className="shrink-0 border-b border-border bg-white px-4 py-3"><div className="flex items-center gap-2 text-xs font-semibold text-pine"><ShieldCheck size={15} className="text-river"/> Frontend support request preview</div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{quickActions.map((action) => <button type="button" key={action} onClick={() => setDraft(action)} className="shrink-0 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-stone hover:border-river hover:bg-mist hover:text-pine">{action}</button>)}</div></div>
      <div ref={conversationRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-snow p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.time}-${index}`} className={`flex ${message.from === "guest" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-brand border px-3 py-2 ${message.from === "guest" ? "border-pine bg-pine text-white" : "border-border bg-white text-charcoal"}`}><p className="text-xs leading-5">{message.text}</p><span className={`mt-1 block text-[10px] ${message.from === "guest" ? "text-[#c3ebd8]" : "text-stone"}`}>{message.time}</span></div></div>)}{demoReply && <p className="text-xs text-stone">Demo response preparing...</p>}</div>
      <form onSubmit={sendMessage} className="flex shrink-0 items-center gap-2 border-t border-border bg-white p-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} className="field h-10 min-w-0 flex-1 text-xs" placeholder="Describe what you need..." aria-label="Support request"/><button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-brand bg-pine text-white hover:bg-[#0e2c22]" aria-label="Send support request"><Send size={16}/></button></form>
      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-border bg-white p-3"><a href="tel:+92946000000" className="button min-h-9 border-border bg-white px-2 text-[11px] text-pine"><PhoneCall size={14}/> Call desk</a><a href="https://wa.me/92946000000" target="_blank" rel="noreferrer" className="button min-h-9 bg-mist px-2 text-[11px] text-pine"><MessageCircle size={14}/> WhatsApp</a></div>
    </motion.div>}</AnimatePresence>
    <button type="button" onClick={() => setOpen((value) => !value)} className="fixed bottom-4 right-4 z-[70] flex h-12 items-center gap-2 rounded-brand border border-pine bg-pine px-4 text-sm font-semibold text-white shadow-editorial transition hover:-translate-y-0.5 hover:bg-[#0e2c22]" aria-expanded={open} aria-label={open ? "Close support request" : "Open support request"}>{open ? <X size={18}/> : <MessageCircle size={18}/>}<span className="hidden sm:inline">{open ? "Close request" : "Need help?"}</span></button>
  </>;
}
