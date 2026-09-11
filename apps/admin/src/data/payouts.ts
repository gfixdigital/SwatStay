import type { PayoutRecord } from "../types/admin";

export const payouts: PayoutRecord[] = [
  { id: "out-1", provider: "Pine View Hotel Kalam", amount: 16200, pendingBalance: 16200, paidAmount: 0, method: "Bank transfer", status: "Pending", note: "Pay after trip completion." },
  { id: "out-2", provider: "Swat River Transport", amount: 13340, pendingBalance: 0, paidAmount: 13340, method: "JazzCash", status: "Paid", note: "Reference recorded by finance." },
  { id: "out-3", provider: "Ushu Valley Hiking Support", amount: 4950, pendingBalance: 4950, paidAmount: 0, method: "EasyPaisa", status: "Processing", note: "Provider confirmation required." },
];
