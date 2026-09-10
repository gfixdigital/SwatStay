"use client";

import { Bookmark } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSavedPackages } from "@/hooks/useSavedPackages";

export function SavedPackageButton({ slug, compact = false, minimal = false, className = "" }: { slug: string; compact?: boolean; minimal?: boolean; className?: string }) {
  const { loaded, isSaved, toggleSaved } = useSavedPackages();
  const { t } = useLanguage();
  const saved = loaded && isSaved(slug);
  const quiet = compact || minimal;
  return <button type="button" onClick={() => toggleSaved(slug)} aria-pressed={saved} aria-label={saved ? "Remove saved package" : "Save package"} className={`inline-flex items-center justify-center gap-1.5 rounded-brand font-semibold transition ${compact ? "min-h-8 px-1 text-xs" : minimal ? "min-h-10 px-3 text-sm" : "min-h-11 border px-4 text-sm"} ${quiet ? saved ? "text-river" : "text-stone hover:bg-mist hover:text-pine" : saved ? "border-pine bg-mist text-pine" : "border-border bg-white text-pine hover:border-river hover:bg-mist"} ${className}`}><Bookmark size={compact ? 14 : 17} fill={saved ? "currentColor" : "none"}/>{saved ? t("savedLabel") : t("save")}</button>;
}
