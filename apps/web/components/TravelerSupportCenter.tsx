"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, LifeBuoy, MessageCircle, PhoneCall, Send } from "lucide-react";

type Request = { id: string; topic: string; status: "Open" | "In review" | "Resolved"; updated: string; messages: { sender: "You" | "GFix team"; body: string; time: string }[] };

const initial: Request[] = [{ id: "SUP-82", topic: "Meal preference", status: "Open", updated: "35 minutes ago", messages: [{ sender: "You", body: "Please confirm vegetarian dinner with the hotel before arrival.", time: "Today, 10:15 AM" }, { sender: "GFix team", body: "We have added this to your hotel request. We will confirm it before departure.", time: "Today, 10:30 AM" }] }];

export function TravelerSupportCenter() {
  const [requests, setRequests] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0].id);
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("Booking question");
  const selected = requests.find((request) => request.id === selectedId) ?? requests[0];

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || !selected) return;
    setRequests((current) => current.map((request) => request.id === selected.id ? { ...request, status: "In review", updated: "Just now", messages: [...request.messages, { sender: "You", body: message.trim(), time: "Just now" }] } : request));
    setMessage("");
  }

  function createRequest() {
    const id = `DEMO-${Date.now().toString().slice(-4)}`;
    setRequests((current) => [{ id, topic, status: "Open", updated: "Just now", messages: [{ sender: "You", body: "New support request created in this frontend preview.", time: "Just now" }] }, ...current]);
    setSelectedId(id);
  }

  return <main className="bg-snow py-6 md:py-10"><div className="container max-w-6xl"><Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-river hover:text-pine"><ArrowLeft size={15}/> Back to trip dashboard</Link><div className="mt-4 flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end"><div><div className="eyebrow">BOOKING SUPPORT · SS-2048</div><h1 className="font-display text-2xl font-bold text-pine md:text-3xl">Help and support</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-stone">Send booking questions, review the request history, or contact the GFix trip desk. This conversation is a frontend preview and is not live yet.</p></div><div className="flex gap-2"><a href="tel:+92946000000" className="button min-h-9 border-border bg-white px-3 text-xs text-pine hover:bg-mist"><PhoneCall size={15}/> Call</a><a href="https://wa.me/92946000000" className="button min-h-9 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]"><MessageCircle size={15}/> WhatsApp</a></div></div><div className="mt-5 grid gap-4 lg:grid-cols-[300px_1fr]"><aside className="rounded-brand border border-border bg-white p-3"><label className="text-xs font-semibold text-stone">New request topic<select value={topic} onChange={(event) => setTopic(event.target.value)} className="field mt-1.5 w-full"><option>Booking question</option><option>Payment question</option><option>Pickup timing</option><option>Hotel</option><option>Transport</option><option>Guide or activity</option><option>Documents</option></select></label><button type="button" onClick={createRequest} className="button mt-2 min-h-9 w-full bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]"><LifeBuoy size={15}/> Create request</button><div className="mt-4 space-y-2">{requests.map((request) => <button key={request.id} type="button" onClick={() => setSelectedId(request.id)} className={`w-full rounded-md border p-3 text-left ${request.id === selected?.id ? "border-pine bg-mist" : "border-border hover:bg-snow"}`}><div className="flex items-center justify-between gap-2"><strong className="text-xs text-river">{request.id}</strong><span className="text-[11px] text-stone">{request.status}</span></div><span className="mt-1 block text-sm font-semibold text-charcoal">{request.topic}</span><span className="mt-1 block text-xs text-stone">{request.updated}</span></button>)}</div></aside><section className="rounded-brand border border-border bg-white"><div className="border-b border-border p-4"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-lg font-bold text-charcoal">{selected?.topic}</h2><p className="mt-1 text-xs text-stone">{selected?.id} · {selected?.status}</p></div><span className="inline-flex items-center gap-1 rounded-md bg-mist px-2 py-1 text-xs font-semibold text-pine"><CheckCircle2 size={13}/> Request history</span></div></div><div className="min-h-64 space-y-3 p-4">{selected?.messages.map((item, index) => <div key={`${item.time}-${index}`} className={`max-w-[85%] rounded-md p-3 text-sm leading-5 ${item.sender === "You" ? "ml-auto bg-mist text-charcoal" : "bg-snow text-charcoal"}`}><strong className="block text-xs text-river">{item.sender}</strong><p className="mt-1">{item.body}</p><span className="mt-1 block text-[11px] text-stone">{item.time}</span></div>)}</div><form onSubmit={send} className="border-t border-border p-3"><label className="sr-only" htmlFor="support-message">Message</label><div className="flex gap-2"><input id="support-message" value={message} onChange={(event) => setMessage(event.target.value)} className="field min-w-0 flex-1" placeholder="Write a message for GFix support" required/><button className="button min-h-10 bg-pine px-3 text-xs text-white hover:bg-[#0e2c22]"><Send size={15}/> Send</button></div><p className="mt-2 text-xs text-stone">Frontend-only preview. Messages are not delivered to the admin panel until the support API is connected.</p></form></section></div></div></main>;
}
