import type { ContentSection } from "../types/admin";

export const contentSections: ContentSection[] = [
  { id: "content-hero", title: "Homepage hero", area: "Homepage", preview: "Book verified Swat tour packages with local operators", status: "Published" },
  { id: "content-trust", title: "Trust badges", area: "Homepage", preview: "Verified providers, call confirmation, language support", status: "Published" },
  { id: "content-steps", title: "How it works", area: "Homepage", preview: "Choose, request, confirm, providers are arranged", status: "Published" },
  { id: "content-custom", title: "Custom trip CTA", area: "Homepage", preview: "Request a custom Swat plan", status: "Draft" },
  { id: "content-faq", title: "FAQ items", area: "Help", preview: "Booking, payment, providers, weather, cancellation", status: "Published" },
  { id: "content-contact", title: "Contact details", area: "Global", preview: "WhatsApp, support phone, email, office", status: "Draft" },
  { id: "content-legal", title: "Terms and privacy", area: "Legal", preview: "Booking and data handling policies", status: "Published" },
  { id: "content-footer", title: "Footer links", area: "Global", preview: "Destinations, packages, providers, legal pages", status: "Published" },
];
