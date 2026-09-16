import type { Booking } from "../types/admin";

export type WorkflowStep = "inbox" | "call" | "payment" | "providers" | "voucher" | "support";

export function workflowBlockReason(booking: Booking, step: WorkflowStep) {
  if (booking.status === "Cancelled") return "This booking is cancelled and cannot move through the workflow.";
  if (step === "payment" && booking.status === "Call pending") return "Complete the confirmation call before Finance reviews payment.";
  if (step === "providers" && booking.paymentStatus !== "Verified") return "Finance must verify payment before Operations can assign providers.";
  if (step === "voucher" && booking.status !== "Active") return "Complete provider assignment before creating the active-trip voucher.";
  if (step === "support" && !["Active", "Completed"].includes(booking.status)) return "Trip support opens after providers are assigned and the trip becomes active.";
  return null;
}

export function canAdvanceToProviders(booking: Booking) { return !workflowBlockReason(booking, "providers"); }
