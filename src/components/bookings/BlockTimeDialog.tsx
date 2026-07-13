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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}

const REASONS = [
  { value: "vacation", label: "Vacation" },
  { value: "lunch", label: "Lunch" },
  { value: "personal", label: "Personal time" },
  { value: "training", label: "Training" },
  { value: "unavailable", label: "Unavailable" },
];

export function BlockTimeDialog({ open, onOpenChange, onCreated }: Props) {
  const { user } = useAuth();
  const [reason, setReason] = useState("unavailable");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: provider } = useQuery({
    queryKey: ["provider-me-block", user?.id],
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

  const submit = async () => {
    if (!provider) {
      toast.error("Provider profile not found");
      return;
    }
    if (!start || !end) {
      toast.error("Start and end times are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("availability_blocks").insert({
      provider_id: provider.id,
      start_time: new Date(start).toISOString(),
      end_time: new Date(end).toISOString(),
      reason,
      note: note || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setStart(""); setEnd(""); setNote(""); setReason("unavailable");
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block time</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start</Label>
              <Input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End</Label>
              <Input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Note (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Saving…" : "Block time"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
