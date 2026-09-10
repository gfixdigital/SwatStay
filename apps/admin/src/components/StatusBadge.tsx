import type { BookingStatus, ProviderApprovalStatus, TicketStatus } from "../types/admin";

type Status = BookingStatus | ProviderApprovalStatus | TicketStatus | "Available" | "Pending" | "Selected" | "Confirmed";

export function StatusBadge({ status }: { status: Status }) {
  const tone = ["Tourist confirmed", "Active", "Approved", "Resolved", "Available", "Confirmed"].includes(status)
    ? "border-[#bdd5c7] bg-[#e8f1ec] text-pine"
    : ["Call pending", "Pending review", "Pending"].includes(status)
      ? "border-[#ecd3ad] bg-[#fbf3e6] text-[#925d19]"
      : ["Cancelled", "Rejected"].includes(status)
        ? "border-[#e5c1ba] bg-[#fff0ed] text-[#9c3f2e]"
        : ["Provider selection", "In progress", "Open", "Selected"].includes(status)
          ? "border-[#bed7df] bg-[#eaf3f6] text-river"
          : "border-border bg-snow text-stone";
  return <span className={`inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}
