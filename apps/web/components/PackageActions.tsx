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
  return <div className="relative mt-5 flex flex-wrap gap-2">
    <SavedPackageButton slug={slug}/>
    <button type="button" onClick={sharePackage} className="button min-h-11 border-border bg-white px-4 text-sm text-pine hover:border-river hover:bg-mist"><Share2 size={17}/>{t("share")}</button>
    <button type="button" onClick={() => window.print()} className="button min-h-11 border-border bg-white px-4 text-sm text-pine hover:border-river hover:bg-mist"><Printer size={17}/>{t("print")}</button>
    <a href={whatsappHref} target="_blank" rel="noreferrer" className="button min-h-11 border-border bg-white px-4 text-sm text-river hover:border-river hover:bg-mist"><MessageCircle size={17}/>WhatsApp</a>
    {message && <div role="status" className="fixed right-4 top-24 z-[100] flex items-center gap-2 rounded-brand border border-border bg-white px-4 py-3 text-sm font-semibold text-pine shadow-editorial"><Check size={16} className="text-river"/>{message}</div>}
  </div>;
}
