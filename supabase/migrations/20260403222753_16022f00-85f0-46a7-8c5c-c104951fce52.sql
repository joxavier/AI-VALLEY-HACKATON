
-- Function to check if current user is a provider
CREATE OR REPLACE FUNCTION public.is_provider()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.providers WHERE user_id = auth.uid()
  )
$$;

-- Providers can view ALL bookings (for dashboard)
CREATE POLICY "Providers can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.is_provider());

-- Providers can view ALL booking services
CREATE POLICY "Providers can view all booking services"
ON public.booking_services
FOR SELECT
TO authenticated
USING (public.is_provider());

-- Providers can view ALL booking participants
CREATE POLICY "Providers can view all booking participants"
ON public.booking_participants
FOR SELECT
TO authenticated
USING (public.is_provider());
