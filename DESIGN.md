# DESIGN.md

## Purpose

This document is the design source of truth for the buyer-first MVP of `Tracer`.

It exists to keep implementation coherent across the homepage, marketplace, listing detail, and buyer purchases surfaces. If a design choice is not specified elsewhere, default to the principles and tokens in this file instead of improvising.

## Product Mood

This product should feel like an editorial technical marketplace, not a generic SaaS dashboard and not a neon crypto landing page.

The emotional arc:
- First visit: skeptical -> intrigued -> reassured -> motivated to inspect listings
- Purchase flow: intent -> controlled friction -> reassurance while waiting -> clarity on success -> confidence that access is durable
- Post-purchase: ownership -> confidence -> reusable library

Design goal: serious, inspectable, trustworthy, and calm.

## Hard Rules

- No purple or blue-to-purple gradient branding.
- No generic 3-column feature grid.
- No centered-everything layouts.
- No decorative cards unless the card is the interaction.
- No body text under `16px`.
- No placeholder-as-label form fields.
- No color-only status communication.
- No hover-only affordances for important actions.
- No vague marketing copy like "unlock the power of" or "all-in-one solution."

## Typography

Use two typefaces max.

- Display type: a serif or semi-serif with editorial authority.
  Purpose: homepage thesis, section headlines, important listing titles.
- Body/UI type: a restrained sans serif.
  Purpose: navigation, metadata, controls, filters, body copy.

Type scale:
- Display hero: `48-64px` desktop, `36-44px` mobile
- Section headline: `28-36px`
- Page title: `28-32px`
- Listing title: `20-24px`
- Body: `16-18px`
- Small metadata: `14-15px`, only for secondary information

Copy rules:
- One job per section.
- Default section pattern: headline + one supporting sentence.
- Delete 30% of homepage copy before shipping.
- Avoid centered paragraphs except short hero lockups.

## Color System

Use CSS variables from day one.

Core palette direction:
- Base background: parchment, mineral, or light stone
- Primary text: near-black charcoal
- Secondary text: muted graphite
- Surface accent: subtle warm-gray or cool-stone tint
- Accent color: one sharp accent only, used sparingly for CTA, focus, and active states
- Success/error/warning colors: functional and readable, never neon

Suggested token model:

```css
:root {
  --bg: #f5f1e8;
  --surface: #ece7dc;
  --surface-2: #e3ddd0;
  --text: #161616;
  --text-muted: #5a5a55;
  --border: #c8c1b4;
  --accent: #0f766e;
  --accent-strong: #115e59;
  --success: #1f7a45;
  --warning: #9a6700;
  --error: #b42318;
  --focus: #0f766e;
}
```

These exact hex values can change, but the palette family should not drift into glossy web3 styling.

## Spacing Scale

Use a simple 4px base scale.

- `4, 8, 12, 16, 24, 32, 48, 64, 96`

Rules:
- Dense app surfaces should use `8/12/16/24`.
- Marketing sections should breathe with `32/48/64`.
- Related items should be visibly grouped.
- Trust blocks and purchase blocks need extra breathing room relative to generic metadata.

## Border Radius and Surface Style

Border radius rules:
- Buttons, inputs, pills: `8-10px`
- Panels, drawers, purchase boxes: `12-16px`
- Avoid bubbly large-radius-on-everything styling

Surface style:
- Prefer contrast, spacing, and typography over heavy shadows
- Use subtle borders more than dramatic elevation
- If removing shadows makes the interface fall apart, the composition is too weak

## Navigation and Page Structure

Persistent nav must always answer:
- What site is this?
- What page am I on?
- What can I do next?

Expected top-level buyer-first nav:
- Brand / logo
- Browse marketplace
- Purchases
- Wallet/session status

Avoid novelty navigation patterns. Use recognizable conventions.

## Homepage Composition Rules

Homepage hierarchy:
1. Brand thesis
2. Concrete example listing or trace preview
3. Factual trust strip
4. Primary CTA to browse marketplace
5. Secondary supplier CTA below the fold

Hero composition rules:
- Full-bleed or composition-first, not inset dashboard cards
- No cards in the hero
- Brand/product must be unmistakable in the first screen
- One strong visual anchor only
- One headline, one supporting sentence, one CTA group

Trust strip contents:
- Clear synthetic-labeling promise
- Wallet-based access control
- Base/x402-ready architecture
- Structured trace schema

Trust strip should use factual product truths, not partner-logo theater.

## Marketplace Listing Anatomy

Marketplace page hierarchy:
1. Framing sentence
2. Filters
3. Results
4. Card trust signals
5. Preview hook

Marketplace UI direction:
- Catalog/workbench, not dashboard-card mosaic
- Calm surface hierarchy
- Strong typographic scanning
- Minimal chrome
- Sparse accent color

Listing card priority order:
1. Title / use case
2. Source / provenance label
3. Verification marker
4. Price
5. Preview hook

Do not cram preview boundary into a badge. Explain it in the preview affordance or detail page.

### Listing Card Fields

Each card should make these scannable without clutter:
- Title
- Domain
- Task type
- Tool tags
- Source label
- Verification state
- Price
- Short preview cue

## Listing Detail Anatomy

Listing detail hierarchy:
1. Title + one-line use case
2. Trust block
3. Safe preview block
4. Purchase box
5. Deep metadata below the fold

### Trust Block

The trust block should contain:
- Source/provenance label
- Verification marker
- Clear statement of what is and is not included
- Any trust note about synthetic labeling or review status

### Preview Block

Preview format:
- Structured excerpt panel
- Numbered step summaries
- Step type labels
- Lightweight timestamps or tool names only when safe
- Explicit divider: `inputs/outputs withheld until purchase`

Never render preview as raw JSON by default.
Never render preview as a fluffy narrative summary paragraph.

## Purchase Box Behavior

Purchase box states must keep a stable layout and clear next action.

Required states:
- Not signed in
- Wallet connect required
- Signature rejected
- Purchase pending
- Purchase success
- Session expired

The purchase area should feel like a calm state machine, not a shape-shifting button cluster.

## Buyer Purchases Page

This page is a library, not a receipt log.

Emotional goal:
- ownership
- confidence
- reusability

Desktop:
- denser list layout
- clear status text
- grouped action area

Mobile:
- stacked library cards
- readable status blocks
- retry/download actions grouped clearly

Use plain language for status. Never rely on colored pills alone.

## Interaction States

Every user-facing feature needs explicit visible states.

### Marketplace Results

- Loading: skeleton listings plus visible filter summary
- Empty: warm no-results state, active filter summary, primary reset action, secondary action
- Error: retry state with preserved filters
- Success: results with trust cues visible at first scan
- Partial: low-inventory or narrow-results guidance

### Listing Purchase Box

- Loading: stable skeleton, disabled CTA
- Error: wallet rejected, session expired, or payment failed with one clear next action
- Success: clear purchased or ready-to-download state
- Partial: pending confirmation or purchase recorded / access still resolving

### Buyer Purchases

- Loading: entitlement skeleton rows/cards
- Empty: friendly "nothing purchased yet" state plus browse CTA
- Error: download fetch failed with retry
- Success: download ready
- Partial: purchase recorded but asset unavailable, or access expired

## Responsive Breakpoints

Use intentional breakpoints, not blind stacking.

- Mobile: `320-767px`
- Tablet: `768-1023px`
- Desktop: `1024px+`

### Mobile Rules

Marketplace:
- top summary bar
- filter drawer, not persistent side rail
- compact scan pattern

Listing detail:
- sticky purchase CTA
- no hover-dependent signals
- trust block above deep metadata

Buyer purchases:
- stacked library cards
- status text visible without expansion

### Tablet Rules

- Preserve hierarchy, not necessarily full desktop density
- Filters may shift between drawer and slim rail depending on width
- Purchase box should remain visible without crowding preview block

## Accessibility Baselines

These are non-negotiable.

- Visible labels, not placeholders
- Keyboard-reachable purchase and download flows
- ARIA landmarks for page structure
- Clear focus states on all interactive elements
- Minimum touch target size `44px`
- Body-text contrast meeting WCAG AA
- Preserve visited vs unvisited link distinction
- Headings must be visually attached to the section they introduce
- Use status text, not color alone, for verification, expiry, and errors

## Trust-Signal Components

Marketplace trust is built from repeated, consistent components.

Core trust components:
- Source label
- Verification state
- Preview boundary statement
- Access term / entitlement term
- Synthetic-labeling disclosure when relevant

Rules:
- Source label is more important than price in first scan
- Price should not visually dominate trust
- Verification should be visible but not bureaucratic
- Disclosure language should be short, factual, and consistent across pages

## Implementation Defaults

If the team must choose without a specific mockup:
- prefer left-aligned composition over centered composition
- prefer typography and spacing over decoration
- prefer factual trust language over aspirational copy
- prefer stable layouts during state changes
- prefer explicit labels over icon-only or badge-heavy UI

## Not In Scope Yet

- Supplier self-serve UI design
- Expanded provenance/reputation visualization systems
- External search UI beyond normalized filters
- Full brand system beyond this MVP document

When supplier surfaces return to scope, extend this document instead of inventing a second design language.
