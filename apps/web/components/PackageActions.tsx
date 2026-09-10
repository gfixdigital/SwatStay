"use client";

import { Check, MessageCircle, Printer, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { SavedPackageButton } from "./SavedPackageButton";

export function PackageActions({ slug, title }: { slug: string; title: string }) {
  const [pageUrl, setPageUrl] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useLanguage();
  useEffect(() => setPageUrl(window.location.href), []);

  async function sharePackage() {
    const url = pageUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `View ${title} on SwatStay.`, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Package link copied.");
    } catch {
      setMessage("Copy the package link from your browser address bar.");
    }
    window.setTimeout(() => setMessage(""), 2600);
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`View ${title} on SwatStay: ${pageUrl}`)}`;
  return <div className="relative mt-5 flex w-fit max-w-full flex-wrap items-center gap-1 rounded-brand border border-border bg-white p-1 shadow-[0_2px_10px_rgba(18,55,42,.05)]">
    <SavedPackageButton slug={slug} minimal/>
    <button type="button" onClick={sharePackage} className="inline-flex min-h-10 items-center gap-2 rounded-brand px-3 text-sm font-semibold text-stone hover:bg-mist hover:text-pine"><Share2 size={17}/>{t("share")}</button>
    <button type="button" onClick={() => window.print()} className="inline-flex min-h-10 items-center gap-2 rounded-brand px-3 text-sm font-semibold text-stone hover:bg-mist hover:text-pine"><Printer size={17}/>{t("print")}</button>
    <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-brand px-3 text-sm font-semibold text-river hover:bg-mist hover:text-pine"><MessageCircle size={17}/>WhatsApp</a>
    {message && <div role="status" className="fixed right-4 top-24 z-[100] flex items-center gap-2 rounded-brand border border-border bg-white px-4 py-3 text-sm font-semibold text-pine shadow-editorial"><Check size={16} className="text-river"/>{message}</div>}
  </div>;
}
