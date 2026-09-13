---
name: Corner Software
description: One dark company issue set in two visitor-switchable proofs, Paper and Schematic, over a single token set.
colors:
  paper-bg: "#0e0e0e"
  paper-card: "#161513"
  paper-ink: "#f5f1e8"
  paper-ink-muted: "#a8a39a"
  paper-ink-faint: "#847f76"
  paper-rule: "#2a2825"
  paper-vermillion: "#d7543d"
  schematic-bg: "#0a0b0f"
  schematic-card: "#111317"
  schematic-ink: "#e8eaed"
  schematic-ink-muted: "#9ca3af"
  schematic-ink-faint: "#767d8c"
  schematic-rule: "#1f2228"
  schematic-blue: "#3b82f6"
  signal-operating: "#10b981"
  signal-in-build: "#f59e0b"
  mark-vermillion: "#D4452C"
  print-paper: "#ffffff"
  print-ink: "#141310"
  print-ink-muted: "#45423c"
  print-ink-faint: "#6e6a63"
  print-rule: "#d8d4cb"
  print-accent: "#b83a22"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  body-large:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'ss01', 'cv11'"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.22em"
  mono-caps:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.22em"
  mono-data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "'tnum'"
  mono-tag:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    letterSpacing: "0.12em"
  accent-paper:
    fontFamily: "EB Garamond, Georgia, serif"
    fontWeight: 400
    letterSpacing: "normal"
  accent-schematic:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontWeight: 500
    letterSpacing: "-0.04em"
rounded:
  none: "0px"
spacing:
  gutter: "32px"
  gutter-md: "64px"
  container: "1200px"
  section: "128px"
  section-md: "160px"
  column-gap: "40px"
  column-gap-md: "48px"
  column-gap-lg: "64px"
components:
  button-demo:
    backgroundColor: "transparent"
    textColor: "{colors.paper-vermillion}"
    typography: "{typography.mono-data}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-demo-hover:
    backgroundColor: "{colors.paper-vermillion}"
    textColor: "{colors.paper-bg}"
  theme-toggle:
    textColor: "{colors.paper-ink-faint}"
    typography: "{typography.mono-caps}"
    padding: "8px 4px"
  theme-toggle-hover:
    textColor: "{colors.paper-ink-muted}"
  theme-toggle-active:
    textColor: "{colors.paper-ink}"
  section-rule:
    textColor: "{colors.paper-ink-muted}"
    typography: "{typography.label}"
    padding: "24px 0 0"
  link-mono:
    textColor: "{colors.paper-ink-muted}"
    typography: "{typography.mono-data}"
  link-mono-hover:
    textColor: "{colors.paper-vermillion}"
  diagram-panel:
    backgroundColor: "{colors.paper-card}"
    rounded: "{rounded.none}"
    padding: "20px"
  diagram-panel-md:
    padding: "28px"
  data-row:
    textColor: "{colors.paper-ink}"
    typography: "{typography.mono-data}"
    padding: "10px 16px 10px 0"
  status-badge:
    textColor: "{colors.paper-ink-muted}"
    typography: "{typography.mono-tag}"
---

# Design System: Corner Software

Read `PRODUCT.md` for what is true and `BRIEF.md` for structure, copy and hard rules. This file owns the visual system only. Components reference the Paper tokens because Paper is the default. Every `paper-*` color has a `schematic-*` counterpart under the same CSS variable, so each component spec holds for both themes.

## Overview

**Creative North Star: "The Issue and the Drawing"**

corsw.in is one company register, printed as a dark issue and offered in two proofs. **Paper** is the issue: warm off-black, bone ink, vermillion, EB Garamond italic slipping into Inter headlines, Roman numerals, and a faint twelve-column hairline grid behind everything. **Schematic** is the engineering drawing of the same pages: carbon, cool ink, electric blue, JetBrains Mono in place of the italic, zero-padded Arabic numerals, and no grid. Layout, copy, spacing and components are identical in both. Only the role tokens and the numeral form change, and the visitor chooses the proof. Neither world was invented for this site: both are incumbent looks the owner kept (`PRODUCT.md`, Brand Commitments).

The page is sparse and editorial. Sections sit 128–160px apart on a 4/8 split: the section folio and headline on the left, the content on the right. Structure comes from 1px hairlines, not boxes. The one framed surface is the system-diagram panel, because the diagram is the evidence: the architecture as deployed. Anything that is a fact (a figure, a reference code, a stack, an address) is set in mono with tabular figures. Prose is set in Inter.

Motion is quiet. Content fades up at most 8px on one ease curve, diagram connectors draw once, and a 1px accent line grows once down the masthead. Under `prefers-reduced-motion`, all of it snaps. The owner has ruled out rounded corners, gradients, decorative shadows, icon libraries, bold weights, nav menus and sticky headers.

**Key Characteristics:**
- Two dark themes, one token set: role variables under `:root` (Paper) and `[data-theme="schematic"]`.
- One saturated accent per theme. It marks things and never fills surfaces at rest.
- Inter 500 for everything large, JetBrains Mono for everything factual, and a face-swapped accent word through `font-accent`.
- Roman ordinals on Paper and `01.` ordinals on Schematic, both rendered by `<Ordinal>`.
- Square corners, 1px hairlines, flat surfaces, one tonal step for cards.
- A print stylesheet that ignores both themes and sets a white Garamond document.

## Colors

Two near-black palettes that share one set of role names. Paper is warm and almost chroma-free, Schematic is cool and faintly blue. Each has exactly one saturated accent.

### Primary
- **Vermillion** (`paper-vermillion`, Paper's `--accent`) and **Electric Blue** (`schematic-blue`, Schematic's `--accent`): the accent role. It carries the masthead line, the ordinals on project cards and in the Approach list, one emphasis word per section headline, link hovers and the drawn underline, diagram connectors and the core diagram box, the bordered call-to-action buttons (Contact and `/demo`), the selection highlight, and the focus outline on every link and button.

### Tertiary
- **Signal Green** (`signal-operating`) and **Signal Amber** (`signal-in-build`): shared by both themes and used only as the 6px square in the status badge. They are never text, never borders, and never a second accent.

### Neutral
- **Ground** (`paper-bg` / `schematic-bg`, `--bg`): the page, and the browser chrome (`themeColor` follows Paper). The hover fill of the demo button reverses to Ground text.
- **Card** (`paper-card` / `schematic-card`, `--bg-card`): the diagram panel and every diagram box. It is the only tonal step above Ground.
- **Ink** (`paper-ink` / `schematic-ink`, `--ink`): headlines, principle lines, table values, the active toggle state, and the lead paragraphs in Foundation and Contact.
- **Muted Ink** (`paper-ink-muted` / `schematic-ink-muted`, `--ink-muted`): body paragraphs, the nameplate row, section-folio labels and their ordinals, secondary link text.
- **Faint Ink** (`paper-ink-faint` / `schematic-ink-faint`, `--ink-faint`): table row labels, reference metadata, diagram sub-labels and annotations, the `·` and `/` separators, inactive toggle buttons, the footer line.
- **Rule** (`paper-rule` / `schematic-rule`, `--ink-rule`): every hairline, including section folios, card separators, table and list rows, the diagram panel border, the masthead action row and the footer.

### Print
- **Print Paper, Print Ink, Print Muted, Print Faint, Print Rule, Print Accent** (`print-*`): under `@media print`, both themes are overridden with these values and the accent font resets to Garamond italic. The grid, the masthead line and the theme toggle are `print:hidden`.

### Brand Mark
- **Mark Vermillion** (`mark-vermillion`): the original brand red. It appears only in `app/icon.svg`, `app/apple-icon.svg`, the `public/brand` SVGs and the Open Graph image. It stays out of the UI because it measures 4.3:1, below the small-text floor.

### Named Rules
**The Role-Name Rule.** A component reads color only through a role (`bg-bg`, `text-ink-muted`, `border-ink-rule`, `var(--accent)`), never through a theme name or a hex value. A component that is right in Paper is right in Schematic because it cannot tell the two apart.

**The Accent Marks, Never Fills Rule.** The accent is a 1px line, a word, a numeral, a code or a border. The only accent area is a call-to-action button's hover fill.

**The AA Floor Rule.** Faint Ink and the accent sit at the small-text floor on Card (Paper: faint 4.6:1, accent 4.5:1; Schematic: faint 4.5:1, accent 5.1:1, all measured 2026-09-13). Either may be lightened, never darkened. Any token change is re-measured in both themes.

## Typography

**Display Font:** Inter 500 (with ui-sans-serif, system-ui)
**Body Font:** Inter 400, with `ss01` and `cv11` set on `body`
**Label/Mono Font:** JetBrains Mono 400
**Accent Face:** EB Garamond italic 400 on Paper, JetBrains Mono 500 at -0.04em on Schematic, always through the `font-accent` utility

**Character:** A plain, tightly tracked grotesque with a counterpoint word. On Paper the counterpoint is an old-style italic, which reads as a printed issue. On Schematic it is a heavier, condensed-tracking mono, which reads as a drawing annotation. The mono runs underneath both worlds as the voice of record.

### Hierarchy
- **Display** (500, `clamp(2.5rem, 7vw, 5.5rem)`, 0.95, -0.02em): the page `<h1>` only. It sits in 24ch on home and 18ch on `/demo` and rises in with CSS before hydration. Its emphasis words take the accent face in Ink on home; on `/demo` the emphasis word is also accent-colored.
- **Headline** (500, `clamp(1.75rem, 4vw, 3rem)`, 1.05, -0.015em): section `<h2>`. It sits in a `max-w-xs` column under the folio, or across the 8-column content side in Foundation. It carries exactly one accent word in accent color.
- **Title** (500, `clamp(1.375rem, 2.4vw, 1.75rem)`, 1.18, -0.02em): the project card tagline.
- **Body Large** (400, 18px, 1.45–1.5): Approach lines in Ink, with ordinals at 24px, or 30px from `md`; the lead paragraphs in Foundation and Contact.
- **Body** (400, 15px, rising to 16px from `md`, line-height 1.6; 1.65 in project cards): paragraphs in Muted Ink, capped at `max-w-prose` (65ch), or 52ch in the `/demo` closer.
- **Label** (Inter 500, 11px, 0.22em, uppercase): the section-folio label.
- **Mono Caps** (400, 11px, 0.22em, uppercase; 0.16em below `sm` in the masthead): the nameplate row, theme toggle and the footer line on both pages.
- **Mono Data** (400, 13px, 1.7, tabular): Company rows, the masthead action row, call-to-action links and the contact address. It drops to 12.5px for project data tables and the project name row, and to 12px for card links.
- **Mono Tag** (400, 10.5–11px, 0.12em, uppercase): the diagram panel header and the status badge. The same 0.12em caps run at 12.5px for project data-table row labels and the project name, and the Company row labels use 13px at 0.18em.

### Named Rules
**The Face-Swap Emphasis Rule.** Emphasis is a change of typeface through `font-accent`, never bold, never a plain italic, never `font-serif italic` (Schematic would keep the serif). Upright Garamond does not appear on screen; it is the print body only.

**The Medium Ceiling Rule.** Inter, Garamond and Mono are loaded at 400 and 500 only. Nothing is heavier than 500.

**The Two Numerals Rule.** Every ordinal is `<Ordinal n>`, which renders both a Roman and a zero-padded Arabic form and lets the `schematic:` variant show one. Ordinals are `aria-hidden`, so the adjacent label carries the meaning.

**The Figures Are Mono Rule.** Figures, reference codes, stacks, hostnames and addresses are set in JetBrains Mono with `tabular-nums`. Mono enters a heading only as Schematic's accent word. Headings use `text-balance`.

## Layout

A single centered column: `max-width` 1200px with 32px side gutters, rising to 64px from `md` (the `Container` primitive). There is no navigation chrome. The page is a vertical sequence of sections, each padded 128px top and bottom (160px from `md`).

From `md`, each section is a 12-column grid with a 40/48/64px gap (base/`md`/`lg`). Columns 1–4 hold the section folio and, below it, the headline. Columns 5–12 hold the content. Below `md`, everything stacks in source order. Project cards use their own split from `lg`: the diagram panel spans 7 columns on the left and sticks at 96px from the top while the text column (5 columns) scrolls. Below `lg`, the text comes first and the diagram follows.

The masthead is a nameplate row, a display headline 64–96px below it, and an action row (`Start a project →`, `See a platform running →`) 64–96px further down behind a hairline. There is no dateline, issue number or version. A 1px accent line hangs at the right edge (16px in, 64px from `md`) and grows to 60vh.

Paper draws a fixed twelve-column hairline grid at 4% Ink opacity from `md`, inside the same container and gutters as the content. Schematic sets its opacity to 0.

Breakpoints are Tailwind defaults as used: `sm` 640px (masthead headline break, table reference column appears, wider nameplate tracking), `md` 768px (12-column grid, SVG diagrams replace the mobile stack, grid texture appears) and `lg` 1024px (project card split, sticky diagram).

### Named Rules
**The 4/8 Folio Rule.** A section's identity (folio and headline) lives in the first four columns and its substance in the last eight. Content does not cross into the folio column.

**The Hairline Rhythm Rule.** Separation is a 1px `--ink-rule` top border: folios, card boundaries, table rows, list rows, the masthead action row, the footer. Sections are never boxed, and the Approach list and data rows never alternate background colors.

## Elevation & Depth

Flat. There are no shadows anywhere in the build. Depth is one tonal step (`--bg` to `--bg-card`) plus a 1px Rule border, used for the diagram panel and its boxes. The only stacking is the grid texture (z-0) under the content wrapper (z-10). The sticky diagram panel on `lg` is positional, not elevated.

### Named Rules
**The Flat Page Rule.** No `box-shadow`, `drop-shadow` or glow in either theme. If a surface needs to stand forward, it takes `--bg-card` and a Rule border, and that is the ceiling.

## Shapes

Every corner is square (0px). `rounded-*` does not appear in the codebase. The form language is hairlines and small squares: 1px rules, 1px borders, a 6px status square. The brand mark is the same geometry, a squared corner with an inset vermillion square. Diagram connectors are straight 1px strokes with square caps and miter joins: diagonal for direct links, right-angled elbows for routed ones. Each ends at a 1.6-unit accent dot, the only round form, and small enough to read as a terminal rather than a curve. The Paper grid is a `repeating-linear-gradient` of 1px lines, the one gradient the system permits.

### Named Rules
**The Square Rule.** Corners are 0px in every theme, at every size, including focus outlines and the status indicator.

## Components

### Nameplate Row (page header)
- **Character:** a publication nameplate, not navigation.
- **Style:** Mono Caps in Muted Ink. The segments are brand, founding year and place (home), or brand and page (`/demo`), separated by `·` in Faint Ink with 12px of space. The theme toggle sits at the far right. It wraps on phones.
- **Navigation:** none. No menu, hamburger or sticky header. On `/demo`, the brand segment links home and hovers to Ink.

### Theme Toggle
- **Character:** two words and a slash, the only control on the site.
- **Style:** a `role="group"` labelled "Theme" containing two buttons (`paper`, `schematic`) in Mono Caps, 8px × 4px padding, Faint Ink, with a Faint Ink `/` between them.
- **States:** hover shifts to Muted Ink (150ms). `aria-pressed="true"` shows Ink with an accent underline, offset 4px. Focus-visible shows a 1px accent outline offset 2px.
- **Behavior:** sets `html[data-theme]` and `localStorage["corsw-theme"]`. A pre-paint script in `app/layout.tsx` restores the choice so Schematic never flashes Paper. It is hidden in print.

### Section Folio
- **Character:** the issue's running section number.
- **Style:** a 1px Rule top border, 24px above an inline row: `— <Ordinal> —` in the accent face at 16px (Muted Ink, 0.02em), 16px gap, then the section name in Label, Muted Ink.
- **Use:** once per numbered section, always in the folio column. The ordinal and the rule are what make it a folio: the label never appears above a heading without both.

### Buttons
- **Shape:** square (0px), 1px accent border.
- **Primary (Contact `Start a project`, `/demo` `Ask for a demo`):** Mono Data at 13px in the accent, 12px × 20px padding, label followed by `→`.
- **Hover / Focus:** hover fills with the accent and reverses the text to Ground (150ms). Focus-visible shows a 1px accent outline offset 2px.
- **There is no secondary button.** Every other action is a link.

### Links
- **Style:** mono, 12–15px, in Ink or Muted Ink, followed by an `aria-hidden` `→`.
- **Hover:** color moves to the accent (150ms), and the `.link-draw` span draws a 1px accent underline from left to right with `scaleX` (200ms, `cubic-bezier(0.32, 0.72, 0, 1)`). The underline also draws on `:focus-visible`.

### Project Card (signature)
- **Layout:** an `<article>` behind a 1px Rule top border, 48px vertical padding (64px from `md`, none below the last card), with the diagram panel and the text column per Layout.
- **Text column:** a name row (the ordinal at 15px in the accent, a Faint `/`, the project name in 12.5px mono caps at 0.12em in Ink, and the status badge at the right), then the Title tagline, Body paragraphs in Muted Ink, a Data Table, and, on operating projects only, a right-aligned `Request a demo →` link in the accent. Cards carry no outbound links.
- **Diagram panel:** Card background, 1px Rule border, 20px padding (28px from `md`), with a Mono Tag header row (`System diagram` on the left, a version slug on the right) in Faint Ink.

### System Diagram (signature)
- **Desktop (`md`+):** an SVG on a 620 × 360 grid, set in mono, with `<title>` and `<desc>`. Boxes are 156 × 52 in Card with a 0.75px Muted Ink stroke at 55% opacity; the one core box uses a full-strength 1px accent stroke. Each box has a label (12px, 500, Ink) and a sub-label (10px, Faint Ink). Annotations are 9.5px Faint Ink. Connectors are 1px accent strokes.
- **Motion:** boxes fade up 4px (0.4s, staggered 60ms). Connectors draw with `pathLength` (1.0s, starting at 0.4s, staggered 80ms), and their tip dots fade in after the stroke lands. All of it runs once in view and is static under reduced motion.
- **Mobile (below `md`):** a stacked HTML version. The two clients sit side by side, a 1px × 20px accent connector at 60% opacity leads to the core box (1px accent border), another connector leads to the boxes the core reaches directly, and second-hand boxes follow, each labelled `via <box>` in the accent. Boxes are Card with a 1px Rule border and 12px padding. Annotations follow as a `·` list. The stack never shows an edge the desktop schematic lacks.

### Data Rows
- **Data Table (project cards):** mono 12.5px, tabular. Each row has a 1px Rule top border, and the last row also has a bottom border. Row labels are uppercase 0.12em Faint Ink in a 112px column. Values are Ink. Rows are label and value only.
- **Company:** a `<dl>` in Mono Data on the 8-column side. Rows have 12px vertical padding with a Rule top border (none on the first row): the label (uppercase 0.18em, Faint Ink) in 3 columns and the value in Ink across 9.

### Status Badge (chip)
- **Style:** Mono Tag at 11px in Muted Ink, uppercase, preceded by a 6px square: Signal Green for operating, Signal Amber for in build. No border and no fill behind the text.

### Approach List
- **Style:** an `<ol>` capped at `max-w-2xl`. Each item is a two-column grid (56px ordinal column, 64px from `md`) with 24px vertical padding and a Rule bottom border (none on the last item). The ordinal is `<Ordinal dot>` in the accent at 24–30px; the principle is Body Large in Ink.

### Masthead Line and Footer
- **Masthead line:** a 1px accent vertical line hanging from the top of the page. It grows from 0 to 60vh once on load (1.2s), is hidden in print, and is instant under reduced motion.
- **Footer:** one row behind a Rule top border with 32px vertical padding: `Corner Software` at the left and `© 2024–2026` at the right, in Mono Caps, Faint Ink. No links, no mark.

### Section Reveal
- Sections and list rows enter with opacity 0→1 and an 8px rise over 0.5s on `cubic-bezier(0.32, 0.72, 0, 1)`, once, 120px inside the viewport. Lists stagger their children by 50ms. The display headline uses the same values in CSS with a 0.2s delay. Under reduced motion, every reveal has zero duration.

## Do's and Don'ts

### Do:
- **Do** read every color through a role token (`bg-bg`, `text-ink-faint`, `border-ink-rule`, `var(--accent)`). Hex belongs only in the brand marks and `app/opengraph-image.tsx`.
- **Do** set emphasis words with `font-accent` and numerals with `<Ordinal>`, and give each section headline exactly one accent word.
- **Do** check Paper, Schematic and print for every visual change, and re-measure contrast in both themes when a token moves (text under 18px at 4.5:1 or better on `--bg-card`).
- **Do** separate with 1px `--ink-rule` hairlines and keep every corner at 0px.
- **Do** put `tabular-nums` on every figure and table and `text-balance` on every heading.
- **Do** keep reveals to opacity plus at most 8px of rise on `cubic-bezier(0.32, 0.72, 0, 1)`, and make them snap under `prefers-reduced-motion`.
- **Do** express per-theme content with the `schematic:` variant, rendering both forms in the DOM, so the pre-paint theme never causes a flash or a hydration mismatch.
- **Do** keep a diagram's mobile stack to edges its desktop schematic actually has.

### Don't:
- **Don't** use `rounded-*`, gradients (the Paper grid excepted), `box-shadow` or glows.
- **Don't** set anything heavier than `font-medium`, and don't write `font-serif italic`: Schematic would keep the serif.
- **Don't** set `mark-vermillion` (#D4452C) on UI text. At 4.3:1 it stays in the marks.
- **Don't** fill a surface with the accent at rest, and don't turn the status green or amber into a second accent.
- **Don't** add icons from a library. The arrow is the `→` character, `aria-hidden`, after its label.
- **Don't** add header chrome: no nav menu, hamburger or sticky header. The nameplate row is the header.
- **Don't** put a small uppercase label above a heading unless it is the page's nameplate row or a section folio with its ordinal and rule.
- **Don't** add a texture to Schematic or a second texture to Paper. Paper's is the 4% column grid, and Schematic's surfaces stay bare.
