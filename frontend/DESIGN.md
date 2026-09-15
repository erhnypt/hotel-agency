---
name: Travel Sites — Operator App
description: A B2B hotel-reservation operations tool styled as a split-flap departure board
colors:
  bg: "#f2efe9"
  bg-panel: "#fbfaf7"
  bg-panel-2: "#eae6dd"
  bg-elevated: "#e1dccf"
  border: "#dad4c7"
  border-strong: "#988d76"
  text: "#57534a"
  text-dim: "#726c5c"
  text-h: "#23211d"
  board-bg: "#1d2220"
  board-bg-2: "#262b28"
  board-line: "#3a4340"
  board-ink: "#f3efe6"
  board-ink-dim: "#9aa39e"
  board-brass: "#a9895a"
  signal: "#1f6f6a"
  signal-hover: "#17544f"
  signal-ink: "#f3fbf9"
  status-ok: "#3d7a52"
  status-warn: "#8a5b1e"
  danger: "#a13a34"
typography:
  display:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontWeight: 500
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, 'Segoe UI', sans-serif"
    fontWeight: 400
    fontSize: "15px"
    lineHeight: 1.5
  label:
    fontFamily: "Space Mono, ui-monospace, 'SFMono-Regular', Consolas, monospace"
rounded:
  sm: "3px"
  md: "6px"
  lg: "10px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.sm}"
    padding: "9px 15px"
  button-primary-hover:
    backgroundColor: "{colors.signal-hover}"
  button-secondary:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-h}"
    rounded: "{rounded.sm}"
    padding: "9px 15px"
---

# Design System: Travel Sites — Operator App

## Overview

**Creative North Star: "The Split-Flap Departure Board"**

This is the internal operations tool a travel agency and its partner hotels use all day to book and manage reservations. The system's governing idea: hotel operations read like the arrivals/departures board of the industry's own airports and stations — not like a generic admin dashboard. A dark, matte "board" material (near-black, hairline rules, tabular mono glyphs) is reserved for the parts of the app that function as a live board — the nav rail, table headers, status indicators — while the working surface itself stays a warm, legible stone/ivory so long sessions of reading reservation data stay comfortable. One signal color, a deep vintage-airline teal, carries every actionable and active state; nothing else in the UI competes for that role.

This system explicitly rejects the prior "Rota" theme (warm-ivory editorial-journal aesthetic, 8-color categorical accent system, gradient signal color) and the generic SaaS defaults it was asked to avoid: no KPI-card grids, no purple/blue, no glassmorphism, no gradients as a dominant device, no "welcome back" framing, minimal icons and pills.

**Key Characteristics:**
- Warm stone/ivory working surface; charcoal "board" material for chrome, not content
- One signal accent (deep teal) — no competing hues
- Three-typeface system: serif display for hotel/destination names, geometric sans for UI, tabular mono for data and status
- Dashboards are a live "board" of today's operations, not stat-card grids
- Status is always icon + label, never color alone

## Colors

A restrained neutral-plus-one-accent strategy: warm stone/ivory carries the working surface, charcoal carries the "board" chrome, and teal is the only accent.

### Primary
- **Signal Teal** (`#1f6f6a`): the one accent. Primary buttons, active nav indicator, focus rings, links, the revealed-card face. Used sparingly — never as a background wash.

### Neutral
- **Warm Ivory** (`#f2efe9` page / `#fbfaf7` panel): the working surface — page background and content panels.
- **Stone** (`#dad4c7` border / `#988d76` border-strong): dividers and input borders on the ivory surface.
- **Charcoal Ink** (`#57534a` body text / `#23211d` headings / `#726c5c` secondary text): all text on the ivory surface.
- **Board Charcoal** (`#1d2220` / `#262b28` hover / `#3a4340` line): the dark "board" material — nav rail, table headers, status chips, modal headers.
- **Board Ink** (`#f3efe6` / `#9aa39e` dim): text on the board material.
- **Brass** (`#a9895a`): a desaturated hardware nuance only — the sidebar's rivet-line edge and one status tone. Never a second competing hue.

### Status (icon + label, never color alone — see StatusBadge)
- **Ok / Live** (`#3d7a52` on ivory, `#5fcf9a` on board): confirmed/active.
- **Warn / Hold** (`#8a5b1e` on ivory, `#e0ac54` on board): pending.
- **Danger / Break** (`#a13a34` on ivory, `#e0716a` on board): rejected/cancelled.

### Named Rules
**The One Voice Rule.** Teal is the only hue that means "act on this" or "this is active." Status colors are a separate semantic system (paired with a distinct icon shape) and never substitute as a second brand accent.

**The Board-Is-Chrome Rule.** The dark board material marks *interface structure* (nav, table headers, status, modal headers) — never a content container. A content card is never rendered in board-charcoal.

## Typography

**Display Font:** Fraunces (serif), self-hosted via Fontsource
**Body Font:** Plus Jakarta Sans, self-hosted via Fontsource
**Label/Mono Font:** Space Mono, self-hosted via Fontsource

**Character:** A confident geometric-humanist sans carries every UI surface (buttons, forms, nav labels); a warm, slightly editorial serif is reserved for the names that matter — hotel names, page titles, the login brand; a flat-cut mono carries every board-glyph value — reservation numbers, dates, prices, status labels, nav lane numbers.

### Hierarchy
- **Display** (Fraunces, 500, 20–26px): page titles (`.app-shell__title`, `.page-header h2`), hotel names, dashboard headings.
- **Body** (Plus Jakarta Sans, 400, 13.5–15px): all running UI text, table cells, form labels.
- **Label** (Space Mono, 700, 10–12px, uppercase, tracked): table headers, status labels, section headers (`.board-section__title`), nav lane numbers, reservation/booking codes.

### Named Rules
**The No-Inter Rule.** Never fall back to Inter or a bare system sans as the UI voice; Plus Jakarta Sans is self-hosted specifically to avoid the default AI-generated-SaaS look.
**The Board-Glyph Rule.** Any value a reservations clerk would read off a physical board — a number, a date, a status word, a price — renders in Space Mono with tabular figures. Prose never does.

## Layout

The app shell is a fixed charcoal board-rail (≈246px) beside a flexible ivory content pane. Content uses generous top-level padding (32px desktop / 16px mobile) with no centered max-width container — sections run edge-to-edge within the pane, which lets dense tables and the dashboard board breathe without a floating-card frame. Dashboards replace the KPI-card grid with a single dark metrics strip (hairline-divided, not individually accented) followed by titled board sections (mono uppercase label + hairline rule), each holding a real data table rather than a stat tile. Below 760px the nav rail collapses into a header-anchored disclosure; below 640px the metrics strip stacks vertically. Tables scroll horizontally in their own wrapper rather than forcing the page to reflow.

## Elevation & Depth

Mostly flat: the board material and the ivory surface are distinguished by color and hairline rule, not shadow. Shadows are used sparingly and only where a surface truly floats above the page (modals, the login card) — never as ambient decoration on inline content.

### Shadow Vocabulary
- **`--shadow-board`** (`0 20px 40px -20px rgba(10,12,11,0.5)`): floating surfaces that read as sitting on the board world — the login card, modals.
- **`--shadow`** (`0 14px 28px -18px rgba(29,34,32,.28), 0 4px 12px -6px rgba(29,34,32,.14)`): general elevated panels.
- **`--shadow-sm`**: minor lift (search dropdowns).

### Named Rules
**The Flat-By-Default Rule.** Table rows, board sections, and info-grids carry no shadow at rest. Depth is reserved for things that genuinely overlay the page.

## Shapes

Small, restrained radii throughout (`--radius-sm` 3px / `--radius` 6px / `--radius-lg` 10px) — enough to soften edges without the generic "16px + shadow" SaaS-card look the brief explicitly rejects. The board rail, table headers, and status chips are drawn as flat rectangles or minimally-rounded chips; nothing in the board material uses the large radius. The nav's active state is a 2px solid teal border on the inline-start edge — a rail/tab indicator, not a colored card border.

## Components

### Buttons
- **Shape:** 3px radius, 1px border.
- **Primary:** solid teal fill (`--signal`), signal-ink text, darkens on hover — no gradient.
- **Secondary:** ivory panel fill, stone border, teal border + text on hover.
- **Danger:** transparent, danger-colored border/text, fills with danger-tint on hover.

### Cards / Containers
Used only where content truly needs grouping (the login card, modals, the revealed card-details face, room-option picker). Never the default page structure. Corner radius 6–10px; background is ivory panel, never board-charcoal, except modal headers.

### Inputs / Fields
Ivory background, 1px stone border, 3px radius; focus state is a teal border plus a 3px teal-tint ring (`box-shadow: 0 0 0 3px var(--signal-bg)`).

### Tables (signature component)
The board's clearest expression: header row in board-charcoal with mono uppercase labels, body rows on ivory panel with hairline dividers (no zebra striping), row hover tints to `--bg-panel-2`, numeric/date/code columns use `font-variant-numeric: tabular-nums`. Status renders via `StatusBadge` — a small board-charcoal chip holding a hand-drawn SVG glyph (check / pending / cross) plus a mono uppercase label, so status is never color-only.

### Navigation (signature component)
Charcoal board rail. Each item is numbered with a mono lane number (`01`, `02`, …) via CSS counters — a wayfinding device native to the board world, not a decorative kicker. The active item gets a 2px solid teal inline-start border plus a brighter ink color and heavier weight; hover lightens to `--board-bg-2`. Below 760px the rail collapses behind a header hamburger and the numbered list reappears as a full-width disclosure.

### Dashboard "Board" (signature component)
`BoardStrip` (a hairline-divided row of plain numeric/label pairs, no per-item accent or icon) followed by one or more `BoardSection`s (mono uppercase title + hairline rule + a real `ReservationMiniTable`). Replaces the KPI-card-grid pattern entirely.

## Do's and Don'ts

### Do:
- **Do** keep teal as the only hue that signals interactivity or "active."
- **Do** render every reservation-relevant number, date, code, or status word in Space Mono with tabular figures.
- **Do** reserve the board-charcoal material for interface chrome (nav, table headers, status, modal headers) — never for a content card.
- **Do** pair a status color with its own icon shape; never rely on color alone to communicate status.
- **Do** use the numbered nav lane device (`01`, `02`, …) — it is load-bearing to the board metaphor, not decorative.

### Don't:
- **Don't** reintroduce a stat-card / KPI-grid dashboard pattern (`icon + big number + label`, repeated).
- **Don't** use a second saturated hue alongside teal; brass stays a desaturated hardware nuance only.
- **Don't** use a gradient as a background or as clipped "gradient text."
- **Don't** put a colored left border on a content card, list item, or callout (the nav rail's active-indicator border is the one earned exception).
- **Don't** fall back to Inter or a bare system sans; Plus Jakarta Sans, Fraunces, and Space Mono are self-hosted specifically to avoid it.
