
-- Providers policies
CREATE POLICY "Providers can view own profile" ON public.providers
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Providers can update own profile" ON public.providers
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can view relevant bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    customer_email = (public.get_auth_email())
    OR public.is_booking_provider(id)
  );
CREATE POLICY "Providers can update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.is_booking_provider(id));

-- Booking services policies
CREATE POLICY "View services for accessible bookings" ON public.booking_services
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_services.booking_id
      AND (b.customer_email = (public.get_auth_email()) OR public.is_booking_provider(b.id))
    )
  );
CREATE POLICY "Providers can update their services" ON public.booking_services
  FOR UPDATE TO authenticated
  USING (
    provider_id IN (SELECT p.id FROM public.providers p WHERE p.user_id = auth.uid())
  );

-- Participants policies
CREATE POLICY "View participants for accessible bookings" ON public.booking_participants
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_participants.booking_id
      AND (b.customer_email = (public.get_auth_email()) OR public.is_booking_provider(b.id))
    )
  );
