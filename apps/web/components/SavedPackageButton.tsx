"use client";

import { Bookmark } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSavedPackages } from "@/hooks/useSavedPackages";

export function SavedPackageButton({ slug, compact = false, className = "" }: { slug: string; compact?: boolean; className?: string }) {
  const { loaded, isSaved, toggleSaved } = useSavedPackages();
  const { t } = useLanguage();
  const saved = loaded && isSaved(slug);
  return <button type="button" onClick={() => toggleSaved(slug)} aria-pressed={saved} aria-label={saved ? "Remove saved package" : "Save package"} className={`inline-flex items-center justify-center gap-2 rounded-brand border font-semibold transition ${compact ? "h-9 w-9" : "min-h-11 px-4 text-sm"} ${saved ? "border-pine bg-pine text-white" : "border-border bg-white text-pine hover:border-river hover:bg-mist"} ${className}`}><Bookmark size={compact ? 16 : 17} fill={saved ? "currentColor" : "none"}/>{!compact && (saved ? t("savedLabel") : t("save"))}</button>;
}
