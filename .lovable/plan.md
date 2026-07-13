## Booking Management Module v1.0 — Build Plan

A focused first version of the Bookings workspace at `/dashboard/bookings`, built on the existing `bookings` / `booking_services` / `providers` schema. Keeps today's `BarberDashboard` intact and adds a new, richer bookings experience alongside it.

### Scope (v1)
In:
- Sidebar shell with routes: Dashboard, Calendar, **Bookings**, Clients, Payments, Services, Settings (only Dashboard + Bookings functional; others are placeholder pages).
- Bookings list: search, filters (status, date range, service, payment), responsive table on desktop / stacked cards on mobile.
- Status + payment badges with distinct colors.
- Right‑hand slide‑over drawer with customer info, appointment details, notes, timeline, quick actions (Confirm, Reschedule, Cancel, Mark Complete, Mark No Show, Refund, Message Client — with confirm dialogs on destructive ones).
- Manual booking creation dialog.
- Availability blocking (vacation / lunch / personal / training) stored as a new table.
- Empty state with CTA.

Out (v2, deferred but schema‑friendly): calendar drag/drop views, notifications system, recurring bookings, waitlist, messaging, external calendar sync, analytics, deposits/refund logic beyond status field, photo uploads.

### Data model changes
Existing `bookings.status` values are free text. To match PRD I'll:
- Add extended status support by using `bookings.status` with new allowed values (`pending`, `confirmed`, `checked_in`, `in_progress`, `completed`, `cancelled`, `rejected`, `no_show`). No enum change needed — it's already text.
- Add columns to `bookings`: `payment_status text default 'unpaid'`, `deposit_amount numeric default 0`, `provider_notes text`.
- New table `public.availability_blocks` (id, provider_id, start_time, end_time, reason, note, timestamps) with RLS: provider can CRUD own rows.
- New table `public.booking_events` (id, booking_id, event_type, message, created_at, created_by) for the timeline. RLS: readable by booking's provider; insertable by same.

Grants + RLS + service_role included per project rules.

### Routes & files
```
src/pages/dashboard/
  Layout.tsx           // SidebarProvider shell + Outlet
  Overview.tsx         // simple KPIs (reuses stats logic)
  Bookings.tsx         // list + filters + drawer
  Calendar.tsx         // placeholder ("Coming soon")
  Clients.tsx          // placeholder
  Payments.tsx         // placeholder
  Services.tsx         // placeholder
  Settings.tsx         // placeholder
src/components/bookings/
  BookingsTable.tsx
  BookingCard.tsx      // mobile
  BookingFilters.tsx
  BookingDrawer.tsx
  BookingTimeline.tsx
  StatusBadge.tsx
  PaymentBadge.tsx
  ManualBookingDialog.tsx
  BlockTimeDialog.tsx
src/components/AppSidebar.tsx
src/lib/bookings.ts    // status/payment maps, helpers
```

Routing: nest under `/dashboard` in `App.tsx`. Existing `/dashboard` (`BarberDashboard`) becomes `/dashboard/legacy` so we don't break current users; new `/dashboard` renders the shell → Overview.

### UX details
- Desktop: sidebar (shadcn Sidebar, `collapsible="icon"`), sticky header with search + "New booking" + "Block time".
- Search debounced 150ms; filters combined client‑side over already‑fetched bookings for instant feel.
- Drawer: `Sheet` from shadcn, right side, 480px.
- Destructive actions wrapped in `AlertDialog`.
- Mobile (<768px): filters collapse into a Sheet; table swaps to stacked cards.
- Design tokens only — extend `index.css` with semantic tokens for each status/payment color; no hardcoded hex in components. Keep existing warm-orange primary; add muted status hues (amber, emerald, sky, rose, slate) as HSL tokens.

### Actions → DB effects
- Confirm → `status = confirmed` + insert `booking_events` row.
- Check In / In Progress / Complete / No Show / Cancel / Reject → same pattern.
- Reschedule → opens dialog to pick new date/time; updates first `booking_services.scheduled_time` + event.
- Refund → `payment_status = refunded` + event.
- Message Client → `mailto:` link (real messaging is v2).

### Acceptance criteria mapping
- One place for all appointments ✅ Bookings page.
- Search+filter <1s ✅ client‑side over React Query cache.
- Single‑click status changes ✅ row action menu + drawer buttons.
- Detail without leaving page ✅ Sheet drawer.
- Manual bookings ✅ dialog inserts into `bookings` + `booking_services`.
- Block time ✅ `availability_blocks`.
- Calendar/list sync — deferred; blocks + bookings share source of truth so v2 calendar just reads them.
- Responsive desktop/tablet/mobile ✅ table → cards breakpoint.

### Order of operations
1. Migration: add columns to `bookings`, create `availability_blocks` and `booking_events` with GRANTs + RLS.
2. Build sidebar shell + nested routes; move current dashboard to `/dashboard/legacy`.
3. Build Bookings page (list, filters, badges, drawer, actions).
4. Manual booking + block time dialogs.
5. Placeholder pages for the other sidebar entries.
6. Verify with build + a Playwright smoke pass on `/dashboard/bookings`.

Approve and I'll start with the migration.