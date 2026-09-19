"use client";

import { Megaphone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { announcementTicker } from "@/data/siteContent";

export function AnnouncementTicker() {
  const [dismissed, setDismissed] = useState(false);
  const ticker = announcementTicker;

  if (!ticker.isActive || dismissed) return null;

  return (
    <div className="border-b border-[#0e2c22] bg-pine text-white" role="region" aria-label="Site announcement">
      <div className="container flex min-h-9 items-center gap-3 py-1.5 text-[12px] sm:text-[13px]">
        <Megaphone size={14} className="shrink-0 text-[#9bd6b6]" aria-hidden="true" />
        <p className="min-w-0 flex-1 truncate">
          {ticker.message}
          {ticker.linkHref && ticker.linkLabel && (
            <Link
              href={ticker.linkHref}
              className="ml-2 whitespace-nowrap font-semibold text-[#9bd6b6] underline underline-offset-2 hover:text-white"
            >
              {ticker.linkLabel}
            </Link>
          )}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
