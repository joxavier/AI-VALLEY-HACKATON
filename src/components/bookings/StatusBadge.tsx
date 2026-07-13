import { cn } from "@/lib/utils";
import { statusToken, statusLabel } from "@/lib/bookings";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const token = statusToken[status] ?? "muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{
        color: `hsl(var(--${token}))`,
        borderColor: `hsl(var(--${token}) / 0.35)`,
        backgroundColor: `hsl(var(--${token}) / 0.12)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: `hsl(var(--${token}))` }}
      />
      {statusLabel[status] ?? status}
    </span>
  );
}
