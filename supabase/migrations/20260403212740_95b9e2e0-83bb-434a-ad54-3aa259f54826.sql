
-- Helper: get current user's email
CREATE OR REPLACE FUNCTION public.get_auth_email()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email::text FROM auth.users WHERE id = auth.uid()
$$;

-- Helper: check if user is a provider on any service in a booking
CREATE OR REPLACE FUNCTION public.is_booking_provider(_booking_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.booking_services bs
    JOIN public.providers p ON p.id = bs.provider_id
    WHERE bs.booking_id = _booking_uuid AND p.user_id = auth.uid()
  )
$$;
