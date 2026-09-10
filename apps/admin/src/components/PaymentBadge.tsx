import type { PaymentStatus } from "../types/admin";

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const tone = status === "Verified" ? "border-[#bdd5c7] bg-[#e8f1ec] text-pine" : status === "Rejected" ? "border-[#e5c1ba] bg-[#fff0ed] text-[#9c3f2e]" : "border-[#ecd3ad] bg-[#fbf3e6] text-[#925d19]";
  return <span className={`inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}
