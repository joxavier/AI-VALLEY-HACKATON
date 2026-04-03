import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar, Clock, MapPin, CreditCard, ArrowRight,
  LogOut, LayoutDashboard, FileText
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  confirmed: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  creating: "bg-muted text-muted-foreground border-muted",
};

const paymentColors: Record<string, string> = {
  unpaid: "bg-destructive/15 text-destructive border-destructive/30",
  paid: "bg-success/15 text-success border-success/30",
  partial: "bg-warning/15 text-warning border-warning/30",
};

const CustomerDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { redirect: "/my-bookings" } });
    }
  }, [user, authLoading, navigate]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["customer-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: allServices } = useQuery({
    queryKey: ["customer-booking-services", bookings?.map((b) => b.id)],
    queryFn: async () => {
      const ids = bookings!.map((b) => b.id);
      const { data, error } = await supabase
        .from("booking_services")
        .select("*")
        .in("booking_id", ids);
      if (error) throw error;
      return data;
    },
    enabled: !!bookings && bookings.length > 0,
  });

  const servicesByBooking = (bookingId: string) =>
    allServices?.filter((s) => s.booking_id === bookingId) || [];

  const upcoming = bookings?.filter((b) => b.status !== "completed" && b.status !== "cancelled") || [];
  const past = bookings?.filter((b) => b.status === "completed" || b.status === "cancelled") || [];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-7" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">My Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>

        {/* Stats */}
        {bookings && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Bookings", value: bookings.length, icon: LayoutDashboard },
              { label: "Upcoming", value: upcoming.length, icon: Calendar },
              { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, icon: FileText },
              {
                label: "Total Spent",
                value: `R${bookings.reduce((sum, b) => sum + Number(b.total_amount), 0).toFixed(0)}`,
                icon: CreditCard,
              },
            ].map((stat) => (
              <Card key={stat.label} className="border-border/40 bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <stat.icon className="h-4 w-4" />
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold font-display">Upcoming & Active</h2>
            <div className="space-y-3">
              {upcoming.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  services={servicesByBooking(booking.id)}
                  onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold font-display text-muted-foreground">Past Bookings</h2>
            <div className="space-y-3">
              {past.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  services={servicesByBooking(booking.id)}
                  onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {!isLoading && bookings?.length === 0 && (
          <Card className="border-border/40 bg-card/60">
            <CardContent className="py-16 text-center space-y-4">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No bookings yet</h3>
              <p className="text-muted-foreground text-sm">
                Your bookings will appear here once you make one.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

interface BookingCardProps {
  booking: any;
  services: any[];
  onClick: () => void;
}

const BookingCard = ({ booking, services, onClick }: BookingCardProps) => {
  const nextService = services
    .filter((s) => s.scheduled_time)
    .sort((a, b) => new Date(a.scheduled_time!).getTime() - new Date(b.scheduled_time!).getTime())[0];

  return (
    <Card
      className="border-border/40 bg-card/60 hover:border-primary/30 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm text-muted-foreground">{booking.booking_id}</span>
              <Badge variant="outline" className={statusColors[booking.status] || ""}>
                {booking.status}
              </Badge>
              {services.length > 0 && (
                <Badge variant="outline" className={paymentColors[services[0].payment_status] || ""}>
                  {services[0].payment_status}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              {nextService?.scheduled_time && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(nextService.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                </span>
              )}
              {nextService?.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {nextService.duration} min
                </span>
              )}
              {(nextService?.city || nextService?.address) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {nextService.city || nextService.address}
                </span>
              )}
            </div>

            {services.length > 0 && (
              <p className="text-sm">
                {services.map((s) => s.service_id || s.provider_name || "Service").join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">R{Number(booking.total_amount).toFixed(0)}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDashboard;
