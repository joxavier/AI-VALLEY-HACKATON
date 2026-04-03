import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar, Clock, MapPin, User, Phone, Mail, CreditCard,
  Users, FileText, ArrowLeft, Building, Scissors
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  confirmed: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

const paymentColors: Record<string, string> = {
  unpaid: "bg-destructive/15 text-destructive border-destructive/30",
  paid: "bg-success/15 text-success border-success/30",
  partial: "bg-warning/15 text-warning border-warning/30",
};

const BookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { redirect: `/bookings/${bookingId}` } });
    }
  }, [user, authLoading, bookingId, navigate]);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_id", bookingId!)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Booking not found");
      return data;
    },
    enabled: !!user && !!bookingId,
  });

  const { data: services } = useQuery({
    queryKey: ["booking-services", booking?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booking_services")
        .select("*")
        .eq("booking_id", booking!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!booking?.id,
  });

  const { data: participants } = useQuery({
    queryKey: ["booking-participants", booking?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booking_participants")
        .select("*")
        .eq("booking_id", booking!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!booking?.id,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Booking Not Found</h2>
            <p className="text-muted-foreground text-sm">
              This booking doesn't exist or you don't have permission to view it.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <img src="/metaparlour-logo.svg" alt="MetaParlour" className="h-6" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Booking Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking #{booking.booking_id}</h1>
            <p className="text-muted-foreground mt-1">
              Created {format(new Date(booking.created_at), "PPP 'at' p")}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={statusColors[booking.status] || ""}>
              {booking.status}
            </Badge>
            {booking.group_booking && (
              <Badge variant="outline" className="bg-accent text-accent-foreground border-accent">
                <Users className="mr-1 h-3 w-3" /> Group
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{booking.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{booking.customer_email}</span>
              </div>
              {booking.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.customer_phone}</span>
                </div>
              )}
              {booking.customer_notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">{booking.customer_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold">R{Number(booking.total_amount).toFixed(2)}</span>
              </div>
              {services && services.length > 0 && (
                <div className="space-y-2">
                  {services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <span>{s.provider_name || "Service"}</span>
                      <div className="flex items-center gap-2">
                        <span>R{Number(s.price).toFixed(2)}</span>
                        <Badge variant="outline" className={paymentColors[s.payment_status] || ""}>
                          {s.payment_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        {services && services.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" /> Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service, idx) => (
                <div key={service.id}>
                  {idx > 0 && <Separator className="my-4" />}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{service.provider_name || "Provider"}</span>
                      </div>
                      {service.scheduled_time && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{format(new Date(service.scheduled_time), "PPP 'at' p")}</span>
                        </div>
                      )}
                      {service.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{service.duration} minutes</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {(service.parlour_name || service.address) && (
                        <div className="flex items-start gap-2">
                          {service.location_type === "parlour" ? (
                            <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                          ) : (
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          )}
                          <div>
                            {service.parlour_name && <p className="text-sm font-medium">{service.parlour_name}</p>}
                            {service.address && <p className="text-sm text-muted-foreground">{service.address}</p>}
                            {(service.city || service.postal_code) && (
                              <p className="text-sm text-muted-foreground">
                                {[service.city, service.postal_code].filter(Boolean).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {service.location_type || "parlour"}
                      </Badge>
                    </div>
                  </div>
                  {service.customization_notes && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm"><span className="font-medium">Notes:</span> {service.customization_notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Participants */}
        {participants && participants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {participants.map((p) => (
                  <div key={p.id} className="p-3 bg-muted/50 rounded-lg space-y-1">
                    <p className="font-medium text-sm">{p.name}</p>
                    {p.email && <p className="text-xs text-muted-foreground">{p.email}</p>}
                    {p.phone && <p className="text-xs text-muted-foreground">{p.phone}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Notes */}
        {booking.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{booking.notes}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BookingDetails;
