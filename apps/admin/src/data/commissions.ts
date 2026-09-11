import type { CommissionRecord } from "../types/admin";

export const commissions: CommissionRecord[] = [
  { id: "com-1", bookingReference: "SS-2042", serviceType: "Hotel", provider: "Pine View Hotel Kalam", grossAmount: 18000, commissionRate: 10, commissionAmount: 1800, status: "Recorded", date: "2026-10-09" },
  { id: "com-2", bookingReference: "SS-2042", serviceType: "Transport", provider: "Swat River Transport", grossAmount: 14500, commissionRate: 8, commissionAmount: 1160, status: "Cleared", date: "2026-10-09" },
  { id: "com-3", bookingReference: "SS-2055", serviceType: "Guide", provider: "Ushu Valley Hiking Support", grossAmount: 5500, commissionRate: 10, commissionAmount: 550, status: "Pending", date: "2026-10-10" },
];
