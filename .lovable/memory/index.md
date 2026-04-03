# Project Memory

## Core
MetaParlour booking management app. Dark theme (black bg #0a0a0a). Gold accent primary (HSL 38 70% 60%). Inter body, Bebas Neue headings.
Lovable Cloud enabled. Uses ZAR currency (R prefix). Display-only payments (no Stripe).
Auth: email+password and magic link. RLS by customer_email match and provider relationship.
Logo: /metaparlour-logo.svg (from metaparlour.io)

## Memories
- [DB Schema](mem://features/db-schema) — Tables: providers, bookings, booking_services, booking_participants with RLS
- [Auth flow](mem://features/auth) — Email+password and magic link, AuthContext provider
