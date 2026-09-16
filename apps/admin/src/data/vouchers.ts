import type { ServiceVoucher } from "../types/admin";

export const initialVouchers: ServiceVoucher[] = [
  {
    id: "voucher-2048",
    code: "DEMO-2048-KLM",
    bookingId: "b-2048",
    bookingReference: "SS-2048",
    touristName: "Ayesha Khan",
    touristPhone: "+92 300 1234567",
    packageName: "Couple Standard - Kalam",
    travelStartDate: "2026-10-12",
    travelEndDate: "2026-10-14",
    status: "Active",
    createdAt: "2026-10-09 10:30",
    createdBy: "Asim Khan",
    expiresAt: "2026-10-15",
    services: [
      { id: "svc-hotel-2048", serviceType: "Hotel", providerId: "p-101", providerName: "Pine View Hotel Kalam", scheduledFor: "12 Oct, 2:00 PM", location: "Kalam", status: "Ready" },
      { id: "svc-transport-2048", serviceType: "Transport", providerId: "p-102", providerName: "Swat River Transport", scheduledFor: "12 Oct, 9:00 AM", location: "Mingora", status: "Ready" },
      { id: "svc-guide-2048", serviceType: "Guide", providerId: "p-guide-1", providerName: "Ushu Valley Hiking Support", scheduledFor: "13 Oct, 8:30 AM", location: "Kalam", status: "Ready" },
      { id: "svc-meal-2048", serviceType: "Restaurant", providerId: "p-meal-1", providerName: "Kalam Family Kitchen", scheduledFor: "12 Oct, 7:30 PM", location: "Kalam", status: "Ready" },
    ],
    deliveries: [
      { id: "del-traveler-dashboard", audience: "Traveler", recipient: "Ayesha Khan", channel: "Dashboard", status: "Preview prepared", preparedAt: "2026-10-09 10:31" },
      { id: "del-traveler-email", audience: "Traveler", recipient: "ayesha@example.com", channel: "Email", status: "Not prepared" },
      { id: "del-provider-hotel", audience: "Provider", recipient: "Pine View Hotel Kalam", channel: "Provider panel", status: "Preview prepared", preparedAt: "2026-10-09 10:31" },
      { id: "del-provider-transport", audience: "Provider", recipient: "Swat River Transport", channel: "Provider panel", status: "Preview prepared", preparedAt: "2026-10-09 10:31" },
      { id: "del-provider-guide", audience: "Provider", recipient: "Ushu Valley Hiking Support", channel: "Provider panel", status: "Preview prepared", preparedAt: "2026-10-09 10:31" },
      { id: "del-provider-meal", audience: "Provider", recipient: "Kalam Family Kitchen", channel: "Provider panel", status: "Preview prepared", preparedAt: "2026-10-09 10:31" },
    ],
    events: [
      { id: "evt-2048-created", type: "Created", actor: "Asim Khan", detail: "Voucher preview created after booking and provider confirmation.", occurredAt: "9 Oct, 10:30 AM" },
      { id: "evt-2048-active", type: "Activated", actor: "Asim Khan", detail: "Voucher activated for the confirmed travel dates.", occurredAt: "9 Oct, 10:31 AM" },
      { id: "evt-2048-delivery", type: "Delivery prepared", actor: "System preview", detail: "Traveler dashboard and assigned provider panel previews prepared.", occurredAt: "9 Oct, 10:31 AM" },
    ],
  },
];

export const voucherStorageKey = "swatstay.admin.vouchers.preview";
