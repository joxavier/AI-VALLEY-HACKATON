import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "./StatusBadge";
import { PaymentBadge } from "./PaymentBadge";
import { eventLabel, statusLabel } from "@/lib/bookings";
import {
  Check,
  X,
  CalendarClock,
  CheckCircle2,
  UserX,
  Undo2,
  MessageCircle,
  Phone,
  Mail,
  Save,
} from "lucide-react";

interface Props {
  bookingId: string | null;
  onClose: () => void;
  onChange: () => void;
}

export function BookingDrawer({ bookingId, onClose, onChange }: Props) {
  const { user } = useAuth();
  const open = !!bookingId;

  const { data: booking, refetch: refetchBooking } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const { data: services, refetch: refetchServices } = useQuery({
    queryKey: ["booking-services", bookingId],
    queryFn: async () => {
      if (!bookingId) return [];
      const { data, error } = await supabase
        .from("booking_services")
        .select("*")
        .eq("booking_id", bookingId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: open,
  });

  const { data: events, refetch: refetchEvents } = useQuery({
    queryKey: ["booking-events", bookingId],
    queryFn: async () => {
      if (!bookingId) return [];
      const { data, error } = await supabase
        .from("booking_events")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: open,
  });

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | {
    label: string;
    status?: string;
    payment?: string;
    eventType: string;
  }>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleAt, setRescheduleAt] = useState("");

  useEffect(() => {
    if (booking) setNotes(booking.provider_notes ?? "");
  }, [booking]);

  if (!open) return null;

  const svc = services?.[0];
  const remaining =
    booking ? Number(booking.total_amount) - Number(booking.deposit_amount ?? 0) : 0;

  const logEvent = async (type: string, message?: string) => {
    if (!bookingId) return;
    await supabase.from("booking_events").insert({
      booking_id: bookingId,
      event_type: type,
      message,
      created_by: user?.id ?? null,
    });
  };

  const applyAction = async () => {
    if (!confirmAction || !booking) return;
    const patch: Record<string, string> = {};
    if (confirmAction.status) patch.status = confirmAction.status;
    if (confirmAction.payment) patch.payment_status = confirmAction.payment;
    const { error } = await supabase.from("bookings").update(patch).eq("id", booking.id);
    if (error) {
      toast.error(error.message);
    } else {
      await logEvent(confirmAction.eventType);
      toast.success(confirmAction.label);
      refetchBooking();
      refetchEvents();
      onChange();
    }
    setConfirmAction(null);
  };

  const saveNotes = async () => {
    if (!booking) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from("bookings")
      .update({ provider_notes: notes })
      .eq("id", booking.id);
    setSavingNotes(false);
    if (error) return toast.error(error.message);
    await logEvent("note_added");
    toast.success("Notes saved");
    refetchBooking();
    refetchEvents();
  };

  const doReschedule = async () => {
    if (!svc || !rescheduleAt) return;
    const iso = new Date(rescheduleAt).toISOString();
    const { error } = await supabase
      .from("booking_services")
      .update({ scheduled_time: iso })
      .eq("id", svc.id);
    if (error) return toast.error(error.message);
    await logEvent("rescheduled", `Moved to ${format(new Date(iso), "dd MMM yyyy HH:mm")}`);
    toast.success("Booking rescheduled");
    setRescheduleOpen(false);
    setRescheduleAt("");
    refetchServices();
    refetchEvents();
    onChange();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-sans">
              {booking?.booking_id ?? "Booking"}
            </SheetTitle>
          </SheetHeader>

          {!booking ? (
            <div className="py-16 text-center text-muted-foreground">Loading…</div>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Customer */}
              <section className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {booking.customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{booking.customer_name}</p>
                  <div className="text-xs text-muted-foreground space-y-1 mt-1">
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> {booking.customer_email}
                    </p>
                    {booking.customer_phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> {booking.customer_phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <StatusBadge status={booking.status} />
                  <PaymentBadge status={booking.payment_status} />
                </div>
              </section>

              <Separator />

              {/* Appointment */}
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Appointment
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="font-medium">{svc?.service_id ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {svc?.duration ? `${svc.duration} min` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {svc?.scheduled_time
                        ? format(parseISO(svc.scheduled_time), "dd MMM yyyy")
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {svc?.scheduled_time
                        ? format(parseISO(svc.scheduled_time), "HH:mm")
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="font-medium">{svc?.provider_name ?? "Unassigned"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium capitalize">
                      {svc?.parlour_name || svc?.location_type || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">R{Number(booking.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit</span>
                    <span>R{Number(booking.deposit_amount ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-semibold">R{remaining.toFixed(2)}</span>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Notes */}
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Provider notes
                </h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any internal notes about this booking…"
                  rows={4}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={saveNotes}
                  disabled={savingNotes}
                >
                  <Save className="mr-2 h-3.5 w-3.5" />
                  {savingNotes ? "Saving…" : "Save notes"}
                </Button>
                {booking.customer_notes && (
                  <div className="mt-3 rounded-md border border-border bg-muted/20 p-3 text-sm">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Customer note
                    </p>
                    {booking.customer_notes}
                  </div>
                )}
              </section>

              <Separator />

              {/* Timeline */}
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Timeline
                </h3>
                <ol className="space-y-2">
                  <li className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p>Booked</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(booking.created_at), "dd MMM yyyy · HH:mm")}
                      </p>
                    </div>
                  </li>
                  {events?.map((e) => (
                    <li key={e.id} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-muted-foreground/60" />
                      <div className="flex-1">
                        <p>{eventLabel(e.event_type)}</p>
                        {e.message && (
                          <p className="text-xs text-muted-foreground">{e.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(e.created_at), "dd MMM yyyy · HH:mm")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <Separator />

              {/* Actions */}
              <section className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmAction({
                      label: `Marked as ${statusLabel.confirmed}`,
                      status: "confirmed",
                      eventType: "confirmed",
                    })
                  }
                >
                  <Check className="mr-2 h-4 w-4" /> Confirm
                </Button>
                <Button variant="outline" onClick={() => setRescheduleOpen(true)}>
                  <CalendarClock className="mr-2 h-4 w-4" /> Reschedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmAction({
                      label: "Marked complete",
                      status: "completed",
                      eventType: "completed",
                    })
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmAction({
                      label: "Marked no-show",
                      status: "no_show",
                      eventType: "no_show",
                    })
                  }
                >
                  <UserX className="mr-2 h-4 w-4" /> No show
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setConfirmAction({
                      label: "Refunded",
                      payment: "refunded",
                      eventType: "refunded",
                    })
                  }
                >
                  <Undo2 className="mr-2 h-4 w-4" /> Refund
                </Button>
                <Button variant="outline" asChild>
                  <a href={`mailto:${booking.customer_email}`}>
                    <MessageCircle className="mr-2 h-4 w-4" /> Message
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  className="col-span-2"
                  onClick={() =>
                    setConfirmAction({
                      label: "Booking cancelled",
                      status: "cancelled",
                      eventType: "cancelled",
                    })
                  }
                >
                  <X className="mr-2 h-4 w-4" /> Cancel booking
                </Button>
              </section>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the booking and record it in the timeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={applyAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reschedule-at">New date & time</Label>
            <Input
              id="reschedule-at"
              type="datetime-local"
              value={rescheduleAt}
              onChange={(e) => setRescheduleAt(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={doReschedule} disabled={!rescheduleAt}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
