import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Scissors, DollarSign, TrendingUp, Calendar, Users,
  LogOut, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw
} from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

const BarberDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-google-sheets");
      if (error) throw error;
      toast.success(`Synced ${data.synced} of ${data.total} bookings`);
      if (data.errors?.length > 0) {
        console.warn("Sync errors:", data.errors);
        toast.warning(`${data.errors.length} rows had issues`);
      }
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-services"] });
    } catch (err) {
      console.error("Sync failed:", err);
      toast.error("Failed to sync from Google Sheets");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { redirect: "/dashboard" } });
    }
  }, [user, authLoading, navigate]);

  // Get provider profile
  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ["provider", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Get all bookings visible to this provider
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Get all services for these bookings
  const { data: allServices } = useQuery({
    queryKey: ["provider-services", bookings?.map(b => b.id)],
    queryFn: async () => {
      if (!bookings || bookings.length === 0) return [];
      const { data, error } = await supabase
        .from("booking_services")
        .select("*")
        .in("booking_id", bookings.map(b => b.id));
      if (error) throw error;
      return data || [];
    },
    enabled: !!bookings && bookings.length > 0,
  });

  const stats = useMemo(() => {
    if (!allServices) return { total: 0, thisMonth: 0, thisWeek: 0, paid: 0, unpaid: 0, totalBookings: 0 };
    
    const now = new Date();
    const monthInterval = { start: startOfMonth(now), end: endOfMonth(now) };
    const weekInterval = { start: startOfWeek(now), end: endOfWeek(now) };

    const total = allServices.reduce((sum, s) => sum + Number(s.price), 0);
    const thisMonth = allServices
      .filter(s => s.scheduled_time && isWithinInterval(new Date(s.scheduled_time), monthInterval))
      .reduce((sum, s) => sum + Number(s.price), 0);
    const thisWeek = allServices
      .filter(s => s.scheduled_time && isWithinInterval(new Date(s.scheduled_time), weekInterval))
      .reduce((sum, s) => sum + Number(s.price), 0);
    const paid = allServices.filter(s => s.payment_status === "paid").reduce((sum, s) => sum + Number(s.price), 0);
    const unpaid = allServices.filter(s => s.payment_status === "unpaid").reduce((sum, s) => sum + Number(s.price), 0);

    return { total, thisMonth, thisWeek, paid, unpaid, totalBookings: bookings?.length || 0 };
  }, [allServices, bookings]);

  const isLoading = authLoading || providerLoading || bookingsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Scissors className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Not a Provider</h2>
            <p className="text-muted-foreground text-sm">
              Your account is not registered as a service provider. Contact admin to get set up.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">{provider.name}</h1>
              <p className="text-xs text-muted-foreground">{provider.business_name || "Service Provider"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing…" : "Sync Sheets"}
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Earnings</p>
                  <p className="text-2xl font-bold mt-1">R{stats.total.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary/40" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">This Month</p>
                  <p className="text-2xl font-bold mt-1">R{stats.thisMonth.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">R{stats.paid.toFixed(2)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Unpaid</p>
                  <p className="text-2xl font-bold mt-1 text-destructive">R{stats.unpaid.toFixed(2)}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unassigned Bookings */}
        {(() => {
          const unassignedBookings = bookings?.filter(b => {
            const services = allServices?.filter(s => s.booking_id === b.id) || [];
            return services.some(s => !s.provider_id);
          }) || [];
          
          if (unassignedBookings.length === 0) return null;
          
          const handleClaim = async (bookingUuid: string) => {
            const servicesToClaim = allServices?.filter(
              s => s.booking_id === bookingUuid && !s.provider_id
            ) || [];
            
            for (const svc of servicesToClaim) {
              await supabase
                .from("booking_services")
                .update({ provider_id: provider!.id, provider_name: provider!.name })
                .eq("id", svc.id);
            }
            toast.success("Booking claimed!");
            queryClient.invalidateQueries({ queryKey: ["provider-services"] });
            queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
          };
          
          return (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Unassigned Bookings ({unassignedBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedBookings.map((booking) => {
                      const svc = allServices?.find(s => s.booking_id === booking.id && !s.provider_id);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">{booking.booking_id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{booking.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{svc?.service_id || "—"}</TableCell>
                          <TableCell className="text-sm">
                            {svc?.scheduled_time ? format(new Date(svc.scheduled_time), "dd MMM, HH:mm") : "—"}
                          </TableCell>
                          <TableCell className="font-medium">R{Number(booking.total_amount).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleClaim(booking.id)}>
                              Claim
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })()}

        {/* All Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              All Bookings ({stats.totalBookings})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{booking.booking_id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{booking.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-xs">
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">R{Number(booking.total_amount).toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(booking.created_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No bookings yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payouts Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Earnings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allServices && allServices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{service.service_id || "—"}</p>
                          <p className="text-xs text-muted-foreground">{service.parlour_name || service.location_type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {service.scheduled_time
                          ? format(new Date(service.scheduled_time), "dd MMM, HH:mm")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {service.duration ? `${service.duration} min` : "—"}
                      </TableCell>
                      <TableCell className="font-medium">R{Number(service.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs ${
                            service.payment_status === "paid"
                              ? "bg-success/10 text-success border-success/30"
                              : service.payment_status === "unpaid"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : ""
                          }`}
                        >
                          {service.payment_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No service records</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BarberDashboard;
