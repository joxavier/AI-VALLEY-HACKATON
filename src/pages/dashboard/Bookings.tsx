import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  parseISO,
} from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { PaymentBadge } from "@/components/bookings/PaymentBadge";
import { BookingDrawer } from "@/components/bookings/BookingDrawer";
import { ManualBookingDialog } from "@/components/bookings/ManualBookingDialog";
import { BlockTimeDialog } from "@/components/bookings/BlockTimeDialog";
import { BOOKING_STATUSES, PAYMENT_STATUSES, statusLabel, paymentLabel } from "@/lib/bookings";
import { Search, Plus, CalendarOff, CalendarX2 } from "lucide-react";

type DateRange = "all" | "today" | "tomorrow" | "week" | "month";

export default function BookingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateRange>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: services } = useQuery({
    queryKey: ["services-all", bookings?.map((b) => b.id)],
    queryFn: async () => {
      if (!bookings?.length) return [];
      const { data, error } = await supabase
        .from("booking_services")
        .select("*")
        .in(
          "booking_id",
          bookings.map((b) => b.id)
        );
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!bookings?.length,
  });

  const serviceOptions = useMemo(() => {
    const s = new Set<string>();
    services?.forEach((sv) => sv.service_id && s.add(sv.service_id));
    return Array.from(s);
  }, [services]);

  const rows = useMemo(() => {
    if (!bookings) return [];
    const q = search.trim().toLowerCase();
    return bookings
      .map((b) => {
        const svc = services?.filter((s) => s.booking_id === b.id) ?? [];
        const first = svc[0];
        return { booking: b, service: first, allServices: svc };
      })
      .filter(({ booking, service, allServices }) => {
        if (statusFilter !== "all" && booking.status !== statusFilter) return false;
        if (paymentFilter !== "all" && booking.payment_status !== paymentFilter) return false;
        if (serviceFilter !== "all" && !allServices.some((s) => s.service_id === serviceFilter))
          return false;
        if (dateFilter !== "all" && service?.scheduled_time) {
          const d = parseISO(service.scheduled_time);
          if (dateFilter === "today" && !isToday(d)) return false;
          if (dateFilter === "tomorrow" && !isTomorrow(d)) return false;
          if (dateFilter === "week" && !isThisWeek(d)) return false;
          if (dateFilter === "month" && !isThisMonth(d)) return false;
        } else if (dateFilter !== "all") {
          return false;
        }
        if (q) {
          const hay = [
            booking.customer_name,
            booking.customer_email,
            booking.customer_phone,
            booking.booking_id,
          ]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
  }, [bookings, services, search, statusFilter, paymentFilter, dateFilter, serviceFilter]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings-all"] });
    queryClient.invalidateQueries({ queryKey: ["services-all"] });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-sans">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage appointments, statuses, and payments in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBlockOpen(true)}>
            <CalendarOff className="mr-2 h-4 w-4" /> Block time
          </Button>
          <Button onClick={() => setManualOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client, email, phone, or booking ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {BOOKING_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateRange)}>
          <SelectTrigger><SelectValue placeholder="Date" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any date</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any payment</SelectItem>
            {PAYMENT_STATUSES.map((p) => (
              <SelectItem key={p} value={p}>{paymentLabel[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {serviceOptions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Service:</span>
          <Button
            variant={serviceFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setServiceFilter("all")}
          >
            All
          </Button>
          {serviceOptions.map((s) => (
            <Button
              key={s}
              variant={serviceFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setServiceFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading bookings…</div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <CalendarX2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="font-medium">No bookings yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                When customers book your services, appointments will appear here.
              </p>
            </div>
            <Button onClick={() => setManualOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create booking
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ booking, service }) => {
                  const initials = booking.customer_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const dt = service?.scheduled_time ? parseISO(service.scheduled_time) : null;
                  return (
                    <TableRow
                      key={booking.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => setOpenId(booking.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                              {initials || "—"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{booking.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{service?.service_id ?? "—"}</TableCell>
                      <TableCell className="text-sm">{dt ? format(dt, "dd MMM yyyy") : "—"}</TableCell>
                      <TableCell className="text-sm">{dt ? format(dt, "HH:mm") : "—"}</TableCell>
                      <TableCell className="text-sm">
                        {service?.duration ? `${service.duration} min` : "—"}
                      </TableCell>
                      <TableCell><StatusBadge status={booking.status} /></TableCell>
                      <TableCell><PaymentBadge status={booking.payment_status} /></TableCell>
                      <TableCell className="text-right font-medium">
                        R{Number(booking.total_amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {rows.map(({ booking, service }) => {
              const dt = service?.scheduled_time ? parseISO(service.scheduled_time) : null;
              return (
                <Card
                  key={booking.id}
                  className="cursor-pointer active:opacity-70"
                  onClick={() => setOpenId(booking.id)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{service?.service_id ?? "—"}</p>
                      </div>
                      <p className="text-sm font-semibold">R{Number(booking.total_amount).toFixed(2)}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dt ? format(dt, "dd MMM yyyy · HH:mm") : "Unscheduled"}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={booking.status} />
                      <PaymentBadge status={booking.payment_status} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <BookingDrawer
        bookingId={openId}
        onClose={() => setOpenId(null)}
        onChange={invalidate}
      />
      <ManualBookingDialog
        open={manualOpen}
        onOpenChange={setManualOpen}
        onCreated={() => {
          invalidate();
          toast.success("Booking created");
        }}
      />
      <BlockTimeDialog
        open={blockOpen}
        onOpenChange={setBlockOpen}
        onCreated={() => toast.success("Time blocked")}
      />
    </div>
  );
}
