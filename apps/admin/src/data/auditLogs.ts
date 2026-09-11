import type { AuditLog } from "../types/admin";

export const auditLogs: AuditLog[] = [
  { id: "log-1", adminName: "Asim", action: "Updated booking status", entityType: "Booking", entityId: "SS-2048", time: "11 Sep 2026 · 10:42 AM", ip: "Future backend field" },
  { id: "log-2", adminName: "Ahmed", action: "Reviewed provider application", entityType: "Provider", entityId: "p-101", time: "11 Sep 2026 · 10:18 AM", ip: "Future backend field" },
  { id: "log-3", adminName: "Sana", action: "Added call note", entityType: "Booking", entityId: "SS-2053", time: "11 Sep 2026 · 9:54 AM", ip: "Future backend field" },
  { id: "log-4", adminName: "Adnan", action: "Changed commission setting", entityType: "Settings", entityId: "commission-default", time: "10 Sep 2026 · 5:22 PM", ip: "Future backend field" },
];
