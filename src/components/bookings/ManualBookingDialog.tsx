import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}

export function ManualBookingDialog({ open, onOpenChange, onCreated }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("0");
  const [deposit, setDeposit] = useState("0");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: provider } = useQuery({
    queryKey: ["provider-me", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: open && !!user,
  });

  const reset = () => {
    setName(""); setEmail(""); setPhone("");
    setServiceId(""); setScheduledAt(""); setDuration("60");
    setPrice("0"); setDeposit("0"); setNotes("");
  };

  const submit = async () => {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    const bookingCode = `MP-${Date.now().toString(36).toUpperCase()}`;
    const total = Number(price) || 0;
    const dep = Number(deposit) || 0;

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        booking_id: bookingCode,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        status: "confirmed",
        payment_status: dep > 0 ? (dep >= total ? "paid" : "deposit_paid") : "unpaid",
        total_amount: total,
        deposit_amount: dep,
        customer_notes: notes || null,
      })
      .select()
      .single();

    if (error || !booking) {
      setSaving(false);
      toast.error(error?.message ?? "Failed to create booking");
      return;
    }

    await supabase.from("booking_services").insert({
      booking_id: booking.id,
      service_id: serviceId || null,
      scheduled_time: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      duration: Number(duration) || null,
      price: total,
      provider_id: provider?.id ?? null,
      provider_name: provider?.name ?? null,
    });

    await supabase.from("booking_events").insert({
      booking_id: booking.id,
      event_type: "booked",
      message: "Manually created by provider",
      created_by: user?.id ?? null,
    });

    setSaving(false);
    reset();
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New booking</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label>Customer name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Service</Label>
            <Input
              placeholder="e.g. Box Braids"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Date & time</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Duration (min)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Price (R)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Deposit (R)</Label>
            <Input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Creating…" : "Create booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
