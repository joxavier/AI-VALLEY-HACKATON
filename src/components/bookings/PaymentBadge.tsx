import { cn } from "@/lib/utils";
import { paymentToken, paymentLabel } from "@/lib/bookings";

export function PaymentBadge({ status, className }: { status: string; className?: string }) {
  const token = paymentToken[status] ?? "muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{
        color: `hsl(var(--${token}))`,
        borderColor: `hsl(var(--${token}) / 0.3)`,
        backgroundColor: `hsl(var(--${token}) / 0.1)`,
      }}
    >
      {paymentLabel[status] ?? status}
    </span>
  );
}
