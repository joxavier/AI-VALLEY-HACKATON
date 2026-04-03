-- Add unique constraint on booking_id for upsert support
ALTER TABLE public.bookings ADD CONSTRAINT bookings_booking_id_unique UNIQUE (booking_id);

-- Allow service role to insert bookings (RLS bypass via service role, but ensure policies allow insert for admin sync)
CREATE POLICY "Service role can manage bookings"
ON public.bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage booking_services"
ON public.booking_services
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage booking_participants"
ON public.booking_participants
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
