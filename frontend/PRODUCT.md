# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **travel agency staff and admins** (roles `AGENCY_ADMIN`, `AGENCY_STAFF`) who work inside the operator app all day — creating and managing reservations for their own customers across many partner hotels, reviewing inbound booking requests, and managing their customer/staff records. This is the busiest role and has the most screens; the redesign should optimize for their daily workflow first.

Secondary: **hotel-side admins** (`HOTEL_ADMIN`) who manage a single property's own room types, prices, services, and reservations, and handle support with the agency.

Tertiary: anonymous **prospective travelers/leads** on the separate public marketing site (landing page, hotel catalog, contact) — out of scope for this redesign; that "lp" visual world is intentionally left untouched.

## Product Purpose

A B2B hotel-agency operations platform ("Travel Sites", travellsites.com): a travel agency books rooms on behalf of its customers directly against partner hotels' live room inventory and nightly pricing, while each hotel independently manages its own rooms/pricing/availability and reservation confirmations through the same system. Success = fast, low-error reservation creation and clear day-to-day operational visibility (who's checking in/out, what needs action) for agency staff, and low-friction inventory/reservation management for hotel admins.

## Positioning

Not a consumer OTA and not a generic hotel-PMS — it is the operational layer connecting one travel agency to many independent partner hotels: agency staff can book across all partner hotels' real-time room availability and pricing from one place, hotels retain control of their own inventory/pricing/services, and a moderated public lead-intake flow feeds new hotel and customer relationships into the same system.

## Operating Context

- Three authenticated app shells (Agency Admin, Agency Staff, Hotel Admin), each with its own left-nav menu, sharing one component/token system.
- Core operator workflows: create/manage reservations (new reservation flow is multi-step: hotel → room type → dates/guests → customer → payment card → confirm), review/act on inbound public booking requests ("Talepler"), manage customers, manage per-hotel staff, manage a hotel's room types/services/nightly pricing, view reservation history/status, hotel-to-agency support chat threads.
- Payment card numbers are captured for reservations but **masked** in the UI by default everywhere except a deliberate reveal-via-popup action (which notifies the agency when a hotel views it) — this security/trust affordance must be preserved and should read as intentional, not accidental, in any redesigned card-details UI.
- Hotels have real uploaded photography for their room types (via an image upload/gallery component), so hotel/room imagery in the redesign should be sourced from actual uploaded photos, not decorative stock/placeholder imagery.
- Room pricing model is nightly base price per room type, with derived availability — not per-date grids.
- Booking status, payment status, and reservation status are distinct, meaningful fields that operators scan tables for constantly.
- The public landing/marketing site is a structurally and visually separate "lp" world (own CSS) and is explicitly out of scope for this pass.
- App supports i18n (Turkish is the primary operating language; RTL/Arabic support exists) — text expansion/contraction and RTL must keep working.

## Capabilities and Constraints

- Frontend: React 19 + Vite + React Router, plain per-page/component CSS (no Tailwind/CSS-in-JS), shared root tokens in `src/index.css` plus a shared `crud.css` used by most list/CRUD pages.
- Backend, API, database, routing, and business logic are fixed for this engagement — this pass is visual/layout/CSS only; no functional, data-model, or API changes.
- Must preserve all existing functionality; no fake/placeholder functionality may be introduced.
- Must remain responsive across desktop, laptop, tablet, and mobile, and preserve existing i18n/RTL behavior.

## Brand Commitments

Product/brand name: **Travel Sites** (travellsites.com). No existing logo/mark constraints beyond the current `BrandMark` component; no other binding visual identity carried over from prior themes ("Aurora Operations", "Rota") — those are prior visual attempts, not brand commitments, and this pass supersedes them.

## Evidence on Hand

- Real hotel room-type photos exist via an in-app upload/gallery feature (`ImageUploadField`, `HotelRoomImagesModal`) — usable as real imagery once hotels have uploaded some; no photo library to fabricate content from beyond that.
- No customer testimonials, case studies, or press to reference (none needed for this operator-facing surface).

## Product Principles

1. Agency staff's reservation-creation and daily-ops workflow is the primary design target; hotel-admin and settings/CRUD screens follow the same system but are secondary.
2. Real operational data (status, dates, prices, guest/hotel identity) must stay scannable and trustworthy at a glance — never sacrificed for decoration.
3. The card-masking/reveal security affordance is a trust signal, not an inconvenience to hide — it should read as deliberate.
4. This is an internal operator tool, not a marketing surface: restraint and information density outrank persuasion or delight-for-its-own-sake.
5. The public "lp" landing world is a separate, already-settled visual system and stays untouched by this pass.

## Accessibility & Inclusion

No formally required standard confirmed; existing RTL (Arabic) and i18n support must continue to work through the redesign.
