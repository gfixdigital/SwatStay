import type { MediaAsset } from "../types/admin";

export const mediaAssets: MediaAsset[] = [
  { id: "media-1", name: "kalam-cover.jpg", type: "Destination cover", url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80", size: "420 KB", usedBy: "Kalam destination" },
  { id: "media-2", name: "malam-jabba-cover.jpg", type: "Package cover", url: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=900&q=80", size: "510 KB", usedBy: "Private Premium package" },
  { id: "media-3", name: "swat-river-gallery.jpg", type: "Gallery image", url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80", size: "380 KB", usedBy: "Homepage destinations" },
  { id: "media-4", name: "provider-license.pdf", type: "Provider document", url: "", size: "1.2 MB", usedBy: "Provider p-101" },
  { id: "media-5", name: "payment-proof-2048.jpg", type: "Payment proof", url: "", size: "210 KB", usedBy: "Booking SS-2048" },
];
