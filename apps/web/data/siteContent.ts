// apps/web/data/siteContent.ts
//
// Static, frontend-only content for the admin-manageable public slots:
// announcement ticker, homepage promotion banner, optional popup promotion,
// footer copy, and legal content references.
//
// Every type below mirrors the shape an Admin API record will eventually
// have (id, isActive, plain fields) so this file can later be replaced by
// a fetch() call to the Admin API without changing any component that
// consumes it. Until then, edit the values below directly.

export type AnnouncementTicker = {
  id: string;
  isActive: boolean;
  message: string;
  linkLabel?: string;
  linkHref?: string;
};

export type PromotionBanner = {
  id: string;
  isActive: boolean;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export type PromotionPopup = {
  id: string;
  isActive: boolean;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  dismissLabel: string;
  /** Delay before the popup is shown, in milliseconds. */
  showAfterMs: number;
};

export type FooterAttribution = {
  label: string;
  name: string;
  href: string;
};

export type FooterContent = {
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  attribution: FooterAttribution;
};

export type LegalContentReference = {
  slug: "terms" | "privacy";
  title: string;
  lastUpdatedLabel: string;
  sourceNote: string;
};

export const announcementTicker: AnnouncementTicker = {
  id: "ticker-2026-10",
  isActive: true,
  message: "Every SwatStay booking is confirmed by a phone call before any provider is booked.",
  linkLabel: "See how it works",
  linkHref: "/onboarding",
};

export const promotionBanner: PromotionBanner = {
  id: "banner-kalam-autumn",
  isActive: true,
  eyebrow: "PLAN AHEAD",
  title: "Kalam midweek dates are open through October",
  description:
    "Weekday travel means shorter drive times and easier hotel confirmation. Mention midweek availability when you submit a request.",
  ctaLabel: "View Kalam packages",
  ctaHref: "/packages?destination=kalam",
};

export const promotionPopup: PromotionPopup = {
  id: "popup-custom-trip-2026-q4",
  isActive: true,
  eyebrow: "NOT SEEING THE RIGHT FIT",
  title: "Build a custom Swat itinerary",
  description:
    "Tell us your dates, group size, and pace. Our team will call you back with a plan instead of a generic package.",
  ctaLabel: "Start a custom trip",
  ctaHref: "/custom-trip",
  dismissLabel: "Not now",
  // Kept above ~1.25s so the popup doesn't fire while OnboardingGate's
  // entry splash is still covering the screen.
  showAfterMs: 2200,
};

export const footerContent: FooterContent = {
  tagline: "A local-first way to plan and confirm travel across Swat Valley.",
  supportEmail: "hello@swatstay.example",
  supportPhone: "+92 000 0000000",
  attribution: {
    label: "Built by",
    name: "GFix Digital",
    href: "https://gfixdigital.com",
  },
};

// Referenced by /terms and /privacy so those pages can show a consistent
// "managed by admin" note without hardcoding copy in two places. The
// actual legal body text is not duplicated here — it stays in each page.
export const legalContentReferences: LegalContentReference[] = [
  {
    slug: "terms",
    title: "Terms and Conditions",
    lastUpdatedLabel: "Managed by the SwatStay team",
    sourceNote:
      "This page will be editable from the Admin panel's legal content tool. Static copy is shown until that connection is made.",
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    lastUpdatedLabel: "Managed by the SwatStay team",
    sourceNote:
      "This page will be editable from the Admin panel's legal content tool. Static copy is shown until that connection is made.",
  },
];
