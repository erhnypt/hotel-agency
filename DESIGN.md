# Design

<!-- impeccable:design-schema 2 -->

## World

**Modern Minimal + Türk Anı** — a clean, spacious operational interface with subtle Turkish geometric and cultural references. The foundation is contemporary minimalism (negative space, typographic hierarchy, restraint), but character comes from selective geometric accents: octagon and star motifs from Ottoman tilework, warm earthy palette grounded in Anatolian ceramics, and delicate kaligrafi-inspired line details at key moments (headings, dividers, focus states).

Dark earth ground (not black, but warm charcoal) reflects both contemporary dark-mode practice and the rich clay of Anatolian ceramics. Ottoman blue (azurite-inspired) anchors the action vocabulary, paired with terracotta warmth, keeping the interface both modern and rooted.

Direction: assigned grounded direction #12 (minimal + cultural geometry) from the new-work concept roll. Seed key `8f3c2a1e`. Full contract in the opening comment of `frontend/src/index.css`.

## Color

Modern + Warm Ethnic: wide neutral space (cream/ivory/charcoal) + one primary action accent (Ottoman azurite), plus a status traffic-light trio. Dark/warm is the only theme — no light variant, by deliberate identity choice.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#1a1614` | page ground (warm charcoal, clay-inspired) |
| `--bg-panel` | `#2a2622` | cards, tables, inputs, modal |
| `--bg-panel-2` | `#323028` | sidebar, header, table headers (second neutral layer) |
| `--border` / `--border-strong` | `#4a4640` / `#605a52` | hairlines / interactive-element borders |
| `--text-dim` / `--text` / `--text-h` | `#8b8680` / `#a09a92` / `#f5f3f0` | tertiary → primary ink (cream white) |
| `--signal` | `#2563eb` | primary action, focus, nav-active (Ottoman azurite blue) |
| `--status-ok` | `#10b981` (emerald) | status: confirmed / active |
| `--status-warn` | `#f59e0b` (amber) | status: pending / hold |
| `--danger` | `#dc2626` (terracotta red) | status: rejected / cancelled; destructive actions |
| `--accent-warm` | `#ea580c` | secondary accent (terracotta/burnt clay) — for hover states, decorative touches |
| `--success` | alias of `--status-ok` | inline save/success messages |

Status colors preserve conventional traffic-light semantics (green/amber/red) layered on top of icon shapes, so status reads by both color and glyph. All body/label text combinations verified ≥4.5:1 against both panel surfaces.

## Type

- `--sans`: Space Grotesk (self-hosted via `@fontsource/space-grotesk`) — all UI, body text, small form labels.
- `--display`: Space Grotesk Bold (self-hosted) — page headings, stat labels, nav labels. Larger x-height for presence.
- `--mono`: IBM Plex Mono (self-hosted via `@fontsource/ibm-plex-mono`) — status legends, lane numbers (if retained), stat figures, reservation numbers, table headers. Never used as "technical" costume elsewhere.

Headings carry subtle geometric line accents (octagon or star corner guards, kaligrafi-inspired decorative lines) — earned by being the visual entry points, not applied everywhere.

## Signature component: status badge (`StatusBadge`)

`frontend/src/components/StatusBadge.tsx` + `.css`. A tinted-ring circular icon (16px, authored SVG, one stroke weight) + mono uppercase label. Each status gets its own universally-legible mark:

- **live** (ACTIVE/CONFIRMED): checkmark, `--status-ok` emerald, animates a one-time draw-in (`stroke-dashoffset`, respects `prefers-reduced-motion`).
- **hold** (PENDING): clock hands, `--status-warn` amber.
- **break** (REJECTED): X mark, `--danger` red.
- **pulled** (CANCELLED): ban/slash through the ring, `--danger` red — distinct from REJECTED's X.

Ring fill is a 14%-opacity tint of the status color (chip look); ring stroke + mark are the full-strength color. Reused everywhere a hotel or reservation status appears.

## Brand mark

`frontend/src/components/BrandMark.tsx` — three stacked signal lines (live / hold / disconnected) in the same glyph vocabulary as StatusBadge, anchored in the login/register/gate "front panel" card and sidebar nameplate. Subtle, recognizable, monochromatic.

## Geometric Language

Strategic use of Ottoman/Turkish geometric patterns:

- **Octagon motif** (8-sided): appears as:
  - Subtle corner guards on major headings (thin lines forming octagon corners, `--signal` colored)
  - Background pattern fills on stat tiles (low opacity, 40x40px tiles)
  - Focus ring enhancement on interactive elements

- **Star accent** (4/8-pointed):
  - Bullet point replacement in lists (small, 8-pointed star)
  - Decorative divider between sections (centered star with lines)

- **Geometric borders**:
  - Title/heading underlines use a stepped/geometric pattern instead of plain rules
  - Modal and card borders: 1px solid + subtle corner accents (mini octagons at 3 corners)

All geometric details are rendered with `--signal` or `--accent-warm` at reduced opacity (20-40%), appearing as decorative scaffolding, not dominant features.

## Layout patterns

- **Heading marker**: `.page-header h2::before` — a small octagon corner guard (4 thin lines forming top-left and top-right corners) inline before the heading text, `--signal` colored. Consistent across every CRUD page. Not uppercase; full sentence readability.
- **Stat tiles** (`StatCard`): hairline-seam grid (1px gaps filled with `--border`) with subtle octagon background pattern (20% opacity). Tiles read as one physical panel, not floating cards.
- **Sidebar nav**: numbered lanes (if retained from prior work) via CSS `counter()`, mono, `--text-dim`; current nav item underlined with a stepped/geometric rule.
- **AppShell responsive**: below 760px the sidebar becomes a horizontal top bar with a scrollable nav row, rather than overlapping content.

## Components

- **Buttons**: `--radius` (6px), `--border-strong` outline by default; `.btn--primary` = `--signal` fill with `--text-h` text; `.btn--danger` = `--danger` outline, no fill until hover. Focus ring is a 2px solid `--signal` halo + subtle geometric corner guards.
- **Tables**: `--bg-panel-2` header row, mono uppercase tracked header labels (4-6% letter-spacing), row hover tints `--signal` at 3% opacity. Header row has a decorative 1px geometric-step underline in `--signal` (20% opacity).
- **Forms**: `--bg-panel` fields, `--border-strong` outline, signal focus ring (`box-shadow` halo + geometric corner guards). Field labels set in `--display` weight (slightly heavier) for scanning.
- **Modal**: `--bg-panel` body, `--bg-panel-2` header strip, `--radius` (6px). Header has a subtle top decorative line (stepped geometric pattern, `--signal` at 30% opacity).
- **Login/register/pending-gate "front panel"** (`LoginPage.css`, shared by `HotelAccessGate`): centered panel on a faint azurite radial glow, `BrandMark` + mono-uppercase `.login-card__brand` for the wordmark (if retained), normal-weight `.login-card__title` for status/confirmation headings (full sentences, never uppercase).

## Spacing & Rhythm

- **Generous white space**: minimum 24px gutters on large screens, 16px on tablet/mobile. Lists and tables breathe.
- **Vertical rhythm**: headings followed by 12-16px breathing room before content; section dividers are 32px margins + a decorative star/line (centered, 1px geometric step).
- **Component spacing**: card padding 20px (large screens), 16px (tablet), 12px (mobile). Form field gaps 16px.

## What not to reintroduce

- Colored pill status badges (`StatusBadge` is the only status vocabulary).
- A light theme / `prefers-color-scheme` branch — dark warm earth is the committed identity.
- Icon fonts, emoji, or unicode glyphs standing in for the icon system — author SVG in the established 1.6px stroke weight.
- A second display typeface — Space Grotesk carries all typographic roles.
- Overuse of geometric patterns — they are accents (20-40% opacity, corner guards, dividers), not dominant visual elements. The interface remains 80% clean space.
- Kaligrafi-style full letterforms — only line-based accent details (decorative rules, corner guards, dividers).
