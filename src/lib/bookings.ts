export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "checked_in",
  "in_progress",
  "completed",
  "cancelled",
  "rejected",
  "no_show",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "unpaid",
  "deposit_paid",
  "paid",
  "refunded",
  "partial_refund",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const statusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  no_show: "No Show",
};

export const paymentLabel: Record<string, string> = {
  unpaid: "Unpaid",
  deposit_paid: "Deposit Paid",
  paid: "Paid",
  refunded: "Refunded",
  partial_refund: "Partial Refund",
};

export const statusToken: Record<string, string> = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  checked_in: "status-checked-in",
  in_progress: "status-in-progress",
  completed: "status-completed",
  cancelled: "status-cancelled",
  rejected: "status-rejected",
  no_show: "status-no-show",
};

export const paymentToken: Record<string, string> = {
  unpaid: "pay-unpaid",
  deposit_paid: "pay-deposit",
  paid: "pay-paid",
  refunded: "pay-refunded",
  partial_refund: "pay-partial",
};

export function eventLabel(type: string) {
  const map: Record<string, string> = {
    booked: "Booked",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    rejected: "Rejected",
    checked_in: "Checked in",
    in_progress: "Service started",
    completed: "Completed",
    no_show: "Marked no-show",
    refunded: "Refunded",
    rescheduled: "Rescheduled",
    note_added: "Note added",
    reminder_sent: "Reminder sent",
    deposit_paid: "Deposit paid",
  };
  return map[type] ?? type;
}
