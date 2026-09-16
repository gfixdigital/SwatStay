const positive = ["Active", "Approved", "Available", "Cleared", "Completed", "Confirmed", "Paid", "Published", "Ready", "Resolved", "Scan accepted", "Source", "Tourist confirmed", "Verified"];
const warning = ["Call pending", "Draft", "In review", "Not prepared", "Partially used", "Pending", "Pending confirmation", "Pending proof", "Pending review", "Processing", "Proof submitted"];
const danger = ["Cancelled", "Expired", "Rejected", "Revoked", "Scan rejected", "Suspended", "Urgent"];
const information = ["In progress", "Invited", "Open", "Preview opened", "Preview prepared", "Provider selection", "Recorded", "Selected"];

export function StatusBadge({ status }: { status: string }) {
  const tone = positive.includes(status)
    ? "border-[#bdd5c7] bg-[#e8f1ec] text-pine"
    : warning.includes(status)
      ? "border-[#ecd3ad] bg-[#fbf3e6] text-[#925d19]"
      : danger.includes(status)
        ? "border-[#e5c1ba] bg-[#fff0ed] text-[#9c3f2e]"
        : information.includes(status)
          ? "border-[#bed7df] bg-[#eaf3f6] text-river"
          : "border-border bg-snow text-stone";

  return <span className={`inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}
