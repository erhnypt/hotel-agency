# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three internal roles sharing one authenticated app, no public-facing marketing surface:

- **Agency Admin** — runs the agency: approves/rejects hotel registrations, oversees all reservations, manages staff accounts, agency-wide settings.
- **Agency Staff** — day-to-day operator: searches availability across approved hotels, creates and cancels reservations on behalf of customers, manages customer records.
- **Hotel Admin** — represents one registered hotel: manages that hotel's profile, room types + images, services/amenities, prices, availability calendar, and confirms/rejects reservations made against their hotel. Locked out of hotel-management screens until an Agency Admin approves their hotel (PENDING → ACTIVE gate).

All three work at a desk, task-focused, in Turkish. This is a school project (okul projesi) evaluated as a portfolio piece — polish and originality matter for the grade/portfolio, not for anonymous public users.

## Product Purpose

A booking-intermediary system: an agency sits between customers and a network of hotels. It exists to coordinate hotel onboarding/approval, room/price/availability data owned by each hotel, and the reservation lifecycle (search → book → hotel confirms/rejects → cancel), with full status history.

## Positioning

Not a hotel's own booking engine and not a public OTA — it's the agency's internal operations tool for managing a multi-hotel supply network and the staff who book against it. The three-role approval/ownership model (hotels self-register but are gated by agency approval; each hotel only controls its own inventory; staff book but don't own hotel data) is the mechanism.

## Operating Context

- Reservation flow: staff search available rooms by date range across ACTIVE hotels, pick or create a customer, submit a reservation; the hotel's admin confirms or rejects it; staff can cancel a pending/confirmed reservation. Every status transition is recorded (history).
- Hotel onboarding: a hotel signs up (creates hotel + its own Hotel Admin user) in PENDING state; an Agency Admin approves or rejects; only after approval can that Hotel Admin manage rooms/services/prices/availability.
- Hotel Admin's day-to-day: maintain room types (with capacity, count, images), services, per-date prices and per-date availability counts.
- Dashboards are role-specific stat summaries (counts of hotels/reservations by status, or that hotel's room/reservation counts) — the first thing each role sees after login.
- Dense CRUD screens throughout: tables/lists, create/edit modals, filters (e.g. reservation status filter), form validation.

## Capabilities and Constraints

- Stack: React 19 + TypeScript + Vite, React Router, Axios. No CSS/UI framework currently — hand-rolled CSS with custom properties. No design system or component library to preserve; free to introduce one.
- Auth: JWT (access + refresh) via AuthContext, role-based route protection and redirect-to-own-panel (`RoleShell`).
- All UI copy is Turkish; must stay Turkish.
- Backend (Spring Boot) is out of scope for this work — this is frontend-only.
- No existing brand assets, logo, or photography — `assets/hero.png` and default Vite icons are placeholders, not brand commitments.

## Brand Commitments

None binding yet. Current placeholder name shown in the UI is literally "Hotel Agency" (English, generic) — not a confirmed brand name. The user has delegated naming and visual identity: a new name/wordmark may be proposed, or "Hotel Agency" may be kept as a plain label with a new visual system built around it — either is open.

## Evidence on Hand

No real hotel photography, logos, or customer data exists. Any imagery/photography used in the new design is illustrative and must be treated as synthetic/placeholder, not a real property claim.

## Product Principles

1. Operate mode throughout: this is a task tool for people who log in daily, not a marketing site — the interface must disappear into the task, not perform for a visitor.
2. Role clarity: the three panels share one system but should feel legible as distinct operational contexts (agency-wide oversight vs. daily booking desk vs. single-hotel back office) through wayfinding, not through breaking visual consistency.
3. Status is the core data type (hotel PENDING/ACTIVE, reservation PENDING/CONFIRMED/REJECTED/CANCELLED) — the visual system must give status a strong, consistent, scannable vocabulary.
4. Density over decoration: tables, forms, and dashboards need to hold real operational data at a glance; expression lives in details (color system, type, iconography, empty/loading states), never at the cost of scanability.
5. Despite being "just" a school project, the bar is portfolio-grade: distinctive enough to be memorable, not a generic admin template.

## Accessibility & Inclusion

No specific standard mandated by the user; standard web accessibility practice (contrast, focus states, keyboard nav) applies as baseline craft, not a special requirement.
