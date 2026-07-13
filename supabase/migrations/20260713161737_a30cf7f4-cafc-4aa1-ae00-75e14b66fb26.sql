
-- 1. Extend bookings with payment + notes fields
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS deposit_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS provider_notes text;

-- 2. Availability blocks
CREATE TABLE public.availability_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  reason text NOT NULL DEFAULT 'unavailable',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_blocks TO authenticated;
GRANT ALL ON public.availability_blocks TO service_role;

ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers manage their own blocks"
  ON public.availability_blocks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.providers p WHERE p.id = provider_id AND p.user_id = auth.uid())
  );

CREATE TRIGGER availability_blocks_updated_at
  BEFORE UPDATE ON public.availability_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Booking events (timeline)
CREATE TABLE public.booking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  message text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.booking_events TO authenticated;
GRANT ALL ON public.booking_events TO service_role;

ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers read events on their bookings"
  ON public.booking_events
  FOR SELECT
  TO authenticated
  USING (public.is_booking_provider(booking_id));

CREATE POLICY "Providers insert events on their bookings"
  ON public.booking_events
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_booking_provider(booking_id));

CREATE INDEX booking_events_booking_id_idx ON public.booking_events(booking_id, created_at DESC);
CREATE INDEX availability_blocks_provider_idx ON public.availability_blocks(provider_id, start_time);
