import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { format, parseISO, isToday } from "date-fns";
import { CalendarDays, ListChecks, ArrowRight } from "lucide-react";

export default function DashboardOverview() {
  const { user } = useAuth();

  const { data: bookings } = useQuery({
    queryKey: ["overview-bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: services } = useQuery({
    queryKey: ["overview-services", bookings?.map((b) => b.id)],
    queryFn: async () => {
      if (!bookings?.length) return [];
      const { data } = await supabase
        .from("booking_services")
        .select("*")
        .in("booking_id", bookings.map((b) => b.id));
      return data ?? [];
    },
    enabled: !!bookings?.length,
  });

  const todaysAppts = services?.filter(
    (s) => s.scheduled_time && isToday(parseISO(s.scheduled_time))
  ) ?? [];

  const revenueToday = todaysAppts.reduce((sum, s) => sum + Number(s.price), 0);
  const pending = bookings?.filter((b) => b.status === "pending").length ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-sans">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of today's activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
              Today's appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todaysAppts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
              Revenue today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R{revenueToday.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
              Pending confirmations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pending}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 font-sans">
            <CalendarDays className="h-5 w-5 text-primary" /> Today
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/bookings">All bookings <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {todaysAppts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <ListChecks className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
              No appointments today.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {todaysAppts.map((s) => {
                const b = bookings?.find((x) => x.id === s.booking_id);
                return (
                  <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{b?.customer_name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.service_id ?? "Service"} ·{" "}
                        {s.scheduled_time ? format(parseISO(s.scheduled_time), "HH:mm") : ""}
                      </p>
                    </div>
                    {b && <StatusBadge status={b.status} />}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
