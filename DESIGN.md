---
name: Corner Software
description: One identity in three scroll chapters — bone paper, ink press, carbon drawing — over a single token set.
colors:
  bone-bg: "#ece6da"
  bone-bg-card: "#e3dccf"
  bone-ink: "#141310"
  bone-ink-muted: "#45423c"
  bone-ink-faint: "#5f5b54"
  bone-ink-rule: "#d3cbbd"
  bone-accent: "#a8341e"
  ink-bg: "#0e0e0e"
  ink-bg-card: "#161513"
  ink-ink: "#f5f1e8"
  ink-ink-muted: "#a8a39a"
  ink-ink-faint: "#847f76"
  ink-ink-rule: "#2a2825"
  ink-accent: "#d7543d"
  carbon-bg: "#0a0b0f"
  carbon-bg-card: "#111317"
  carbon-ink: "#e8eaed"
  carbon-ink-muted: "#9ca3af"
  carbon-ink-faint: "#767d8c"
  carbon-ink-rule: "#1f2228"
  carbon-accent: "#d7543d"
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
    fontFamily: "EB Garamond, Georgia, serif"
    fontStyle: italic
    fontSize: "clamp(3.25rem, 12.5vw, 12rem)"
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: "-0.035em"
  section-head:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 7.5rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  case-hero:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 13vw, 12rem)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontSizeRange: "15px–17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.22em"
  mono-data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12.5px"
    fontSizeRange: "12px–13px"
    fontWeight: 400
    fontFeature: "tabular-nums"
  mono-tag:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontSizeRange: "10.5px–12px"
    fontWeight: 400
    letterSpacing: "0.12em"
rounded:
  none: "0px"
---

# Design System: Corner Software

Read `PRODUCT.md` for what is true and `BRIEF.md` for structure, copy and hard rules. This file owns the visual system only.

## Overview

**Creative North Star: "The Issue, the Press and the Drawing"**

corsw.in is one identity, told in three chapters the page scrolls through in order: **bone**, the paper issue (warm off-white, near-black ink, vermillion, EB Garamond italic, a faint column grid); **ink**, the press proof of the same work (near-black ground, bone ink, the work itself, no grid); and **carbon**, the engineering drawing (cool near-black, a dot grid, system diagrams). The three chapters are one register in three states, not three brands: layout, copy and components carry through unchanged, and only the role tokens and the active texture change as the visitor scrolls. Motion is the proof of craft here — reveals, scrubs and pins carry the weight that used to sit in a visitor-controlled toggle.

The former Paper/Schematic switch is gone. There is no theme control anywhere on the site; both incumbent looks survive only as scroll chapters (`PRODUCT.md`, Brand Commitments), in a fixed order, driven by scroll position instead of a click.

The page is sparse and editorial. Sections sit on a 3/9 folio split: the section number and name in the first three columns, the content in the last nine. Structure comes from 1px hairlines, not boxes. Anything that is a fact (a figure, a table, a stack name, a status) is set in mono with tabular figures. Headlines are Schibsted Grotesk, weighted by hand for each role; the counterpoint face is Garamond italic on bone and ink.

**Key Characteristics:**
- One token set, three chapters: role variables crossfaded on `<html>` as the page scrolls (`lib/tones.ts`).
- One saturated accent per chapter. It marks things and never fills surfaces at rest, except a button's hover fill.
- Schibsted Grotesk variable weight for everything large, JetBrains Mono for everything factual, and a face-swapped accent word through `font-accent` on bone and ink.
- Square corners, 1px hairlines, flat surfaces, one tonal step for cards.
- A print stylesheet that ignores all three chapters and sets a white Garamond document.

## Chapters

Every component reads only the nine role names below; it never knows which chapter it is in. The values live once, in `lib/tones.ts`, and are asserted equal in shape across chapters by `lib/tones.test.mjs`.

| Token | bone | ink | carbon |
|---|---|---|---|
| `--bg` | `#ece6da` | `#0e0e0e` | `#0a0b0f` |
| `--bg-card` | `#e3dccf` | `#161513` | `#111317` |
| `--ink` | `#141310` | `#f5f1e8` | `#e8eaed` |
| `--ink-muted` | `#45423c` | `#a8a39a` | `#9ca3af` |
| `--ink-faint` | `#5f5b54` | `#847f76` | `#767d8c` |
| `--ink-rule` | `#d3cbbd` | `#2a2825` | `#1f2228` |
| `--accent` | `#a8341e` | `#d7543d` | `#d7543d` |
| `--grid-opacity` | `1` | `0` | `0` |
| `--dots-opacity` | `0` | `0` | `1` |

### Named Rules

**The Role-Name Rule.** A component reads color only through a role (`bg-bg`, `text-ink-muted`, `border-ink-rule`, `var(--accent)`), never through a chapter name or a hex value. A component that is right in bone is right in ink and carbon because it cannot tell them apart.

**The Mechanism.** A section carries `data-tone="bone" | "ink" | "carbon"`; a page's `<main>` carries `data-tone-start`. `app/layout.tsx` injects the CSS `toneCss()` (`lib/tones.ts`) builds: `:root` and `html:has(main[data-tone-start=…])` set the page's opening chapter, and — until JS adds `tones-live` — `html:not(.tones-live) [data-tone=…]` paints every section in its own chapter with no JS and no flash. `ToneScroller` (`components/motion/ToneScroller.tsx`) then adds `tones-live` to `<html>` and, when a section reaches 60% of the viewport (GSAP `scrollTrigger`, `start: "top 60%"`, `end: "bottom 60%"`), crossfades the role variables to that section's chapter over 0.6s (`power2.inOut`). The change is timed, not scrubbed: a scrub can come to rest halfway, where text and ground meet near 1:1 contrast. Reduced motion never adds `tones-live`, so the static per-section painting holds.

**The Textures Rule.** `components/site/Textures.tsx` draws two fixed, `aria-hidden` layers behind the content: a twelve-column hairline grid at `--grid-opacity` (bone only) and a dot grid at `--dots-opacity * 0.45` (carbon only). Both opacities are chapter roles, so the textures cross-fade with the chapter instead of switching.

**The AA Floor Rule.** Every foreground role (`--ink`, `--ink-muted`, `--ink-faint`, `--accent`) clears 4.5:1 against both `--bg` and `--bg-card`, in all three chapters. `lib/tones.test.mjs` asserts this on every build; the lowest pairs measured are bone 4.85 (accent on card), ink 4.54 (accent on card) and carbon 4.50 (faint on card). A token may be lightened, never darkened, without re-measuring.

## Typography

Schibsted Grotesk (variable weight 400–900, `next/font/google`) is the only sans in the system: 600 for headlines, 400–500 for body copy, and a scrubbed weight jump (400 → 800) on the Work project names as the pinned stage scrolls and on the large Contact/Next-project links on hover. EB Garamond italic 400, always through the `font-accent` utility, sets the bone hero display and every accent word on bone and ink. JetBrains Mono 400/500 carries facts, tables, labels, the bar and — on carbon — the accent word itself, in place of the italic.

### Sizes in use

- **Hero display** (bone, `<h1>` only): `clamp(3.25rem, 12.5vw, 12rem)`, line-height 0.84, tracking -0.035em, `font-accent`. Its lines rise out of CSS masks (`.line-mask` / `.line-rise`) before hydration, so the LCP heading needs no JS.
- **Section heads** (Work, Approach, Walkthrough "In use", Architecture): `clamp(2.75rem, 8vw, 7.5rem)`, line-height 0.9, tracking -0.04em, weight 600. Contact's "Start a project." runs the same family larger, at `clamp(3rem, 10vw, 9rem)`. The `/demo` and 404 headlines sit nearby, at `clamp(3rem, 9vw, 8rem)` and `clamp(3rem, 10vw, 8rem)`.
- **Case hero** (`/work/[slug]` project name): `clamp(3.5rem, 13vw, 12rem)`, line-height 0.85, tracking -0.05em, weight 800 — Schibsted, not Garamond; the case hero is carried by weight, the home hero by the face swap.
- **Title** (project card tagline, `/demo`): `clamp(1.375rem, 2.4vw, 1.75rem)`, line-height 1.18, tracking -0.02em, weight 500.
- **Body**: 17px, line-height 1.6, weight 400, used for the lead/intro/description paragraphs across Foundation, Work, Business, Architecture and Contact; drops to 15px, line-height 1.65, in the `/demo` project-card description. Capped at `max-w-prose` (65ch).
- **Label**: JetBrains Mono, 11px, 0.22em, uppercase — the section folio, the bar wordmark, the footer and the 404/`/demo` eyebrows.
- **Mono data**: JetBrains Mono, 12–13px, tabular — data-table values, the Company `<dl>`, call-to-action links (the bar's `Start a project`, the Hero and Architecture CTAs, the Contact `/demo` link and email).
- **Mono tag**: JetBrains Mono, 10.5–12px, 0.12–0.14em, uppercase — the status badge, diagram panel captions, case-hero and rail eyebrows.

### Named Rules

**The Face-Swap Emphasis Rule.** On bone and ink, emphasis is a change of typeface to Garamond italic through `font-accent` (Work "work.", Walkthrough "runs."), never bold, never a plain italic. On carbon, the same emphasis role is a mono face at a tighter tracking (Approach "works.", Architecture "built.", Contact "project."), never Garamond. A third emphasis, distinct from both, is a pure weight jump on Schibsted itself (the Hero subline's "runs", the scrubbed Work project names, the Contact/Next-project link hovers) — a weight change, not a face change.

**The Balance and Figures Rule.** `text-balance` sits on every heading. `tabular-nums` sits on every table, data row and figure.

## Layout

A fixed 56px bar (`components/site/Bar.tsx`, `h-14`) holds only the mark (links home) on the left and `Start a project →` on the right. There is no menu, hamburger or second row. `Container` (`components/primitives/Container.tsx`) centers content at `max-width` 1200px with 32px side gutters, rising to 64px from `md`.

From `md`, a section is a 12-column grid: the section folio (`SectionRule`) takes columns 1–3, the content takes columns 4–12 — a 3/9 split, not a 4/8 one. Below `md` everything stacks in source order. Sections are padded 128px top and bottom, rising to 176px from `md` (`py-32 md:py-44` and its `pt`/`pb` equivalents); the Hero and case-study hero are their own shapes and sit outside this rhythm.

Two sections are staged rather than simply stacked: **Work** (`components/home/Work.tsx`) pins on desktop and plays its four projects through a single scroll region the height of the viewport times the project count, and **Walkthrough** (`components/work/Walkthrough.tsx`) sticks one device frame at `top-24` while the steps beside it scroll past and swap its screen. Both fall back to an ordinary stacked layout below `md` or under reduced motion.

Breakpoints are Tailwind defaults as used: `md` 768px (the pin/sticky/SVG-diagram/grid-texture threshold throughout `matchMedia`) and `lg` 1024px (`Built`/`Architecture` figure-plus-list grid).

### Named Rules

**The 3/9 Folio Rule.** A section's identity (folio number and name) lives in the first three columns; its substance lives in the last nine. Content does not cross into the folio column.

**The Hairline Rhythm Rule.** Separation is a 1px `--ink-rule` top border: folios, the bar, data rows, the diagram panel, the footer. Sections are never boxed.

## Motion

The stack is GSAP (`ScrollTrigger`, `SplitText`, `MotionPathPlugin`, registered once in `lib/gsap.ts`) plus `@gsap/react`'s `useGSAP`, and Lenis smooth scroll (`components/motion/SmoothScroll.tsx`) — Lenis runs only `(pointer: fine) and (prefers-reduced-motion: no-preference)`; touch and reduced motion keep native scrolling. Lenis is driven by `gsap.ticker` so `ScrollTrigger` reads the same position every frame.

### Primitives

- **`Reveal`** — descendants marked `data-reveal` rise 48px and fade in once, `expo.out`, as each crosses 88% of the viewport.
- **`SplitReveal`** — a heading (`SplitText`, `type: "lines"`, `mask: "lines"`, `autoSplit`) whose lines rise out of masks once, `expo.out`, staggered 0.08s, at 85% of the viewport. `SplitText` re-splits on resize and font load and keeps an `aria-label` with the full sentence.
- **`ScrubText`** — a paragraph's lines (`SplitText`, `type: "lines"`) brighten from 0.15 to full opacity as the paragraph crosses the viewport, `ease: "none"`, scrubbed between 80% and 50%.
- **`Drift`** — moves its content by a given `y` (and optionally fades it to 0.15) over the first screen of scrolling, scrubbed, `ease: "none"`. Lifts the Hero mark and headline away as the page leaves bone.
- **`Marquee`** — a duplicated word list drifting left on `gsap.ticker`, base 60px/s plus a factor of scroll velocity, paused via `ScrollTrigger` while off screen. Screen readers get the list once, `sr-only`.
- **`Diagram`** (`components/site/Diagram.tsx`) — the SVG system diagram on `md`+: boxes fade up and connectors draw (`strokeDashoffset`) on one scrubbed timeline (80%–60%, `scrub: 1`), then accent dots loop along every connector (`MotionPathPlugin`) while the diagram stays in view, paused via `ScrollTrigger.onToggle` when it leaves. Below `md`, a stacked HTML version (`MobileStack`) replaces it and never shows an edge the desktop schematic lacks (`lib/diagrams.ts` `mobileLayout`, asserted by `lib/diagrams.test.mjs`).
- **`Work`** (`components/home/Work.tsx`) — on desktop with motion, the stage pins and a scrubbed timeline opens each project's capture from an inset `clip-path` to full frame, scrubs its name's weight 400 → 800, and cross-fades to the next; a rail tracks progress. Below `md` with motion enabled, the same articles sit in normal flow with just the capture's `clip-path` reveal scrubbed per item as it enters. Under reduced motion, on any viewport, every article sits fully revealed in normal flow with no motion.
- **`Walkthrough`** (`components/work/Walkthrough.tsx`) — on desktop with motion, one sticky device frame swaps screens (opacity) as each step's caption crosses the viewport's middle, tracked by per-step `ScrollTrigger`s. Otherwise every step renders its own inline device.
- **`ToneScroller`** — see Chapters. Adds `tones-live` and crossfades the role variables on `<html>` between chapters; does nothing under reduced motion.

### Eases

`expo.out` for one-shot entrances (`Reveal`, `SplitReveal`). `ease: "none"` for every scrubbed or ticker-driven motion (`ScrubText`, `Drift`, `Marquee`, the `Diagram` and `Work` scroll timelines). `power2.inOut` for the `ToneScroller` chapter crossfade. CSS `cubic-bezier(0.16, 1, 0.3, 1)` for the two motions that must run without JS — the hero's `.line-rise` and `.mark-stamp` keyframes — and for `::view-transition-group` (the shared `capture-<slug>` element between a Work card and its case-study hero).

### The `data-live` Pattern

`[data-rail]`, `[data-walk-stage]` and the absolute stacking of `[data-work-item]` are `display: none` (or in-flow) by default in `globals.css`; a section only gets `data-live` — and only then do the pinned rail, the sticky device stage and the absolute-stacked work items appear — once its `useGSAP` branch actually matches `(min-width: 768px) and (prefers-reduced-motion: no-preference)` and runs. The `data-live` swaps — including `[data-live] [data-inline-device]`, which hides the walkthrough's inline device once the sticky stage takes over, and the 0.35 dim on non-active `[data-step]`s — are progressive-enhancement layout toggles that apply only while JS motion is actually running, not animation-hidden start states: without JS or under reduced motion, every caption and a device for every step sits visible in normal document flow.

### Rules

Every animation is created inside `useGSAP` and gated by `gsap.matchMedia()` (`(prefers-reduced-motion: no-preference)`, extended to `(min-width: 768px)` for pins and sticky stages). Under reduced motion every element sits in its final visible state — nothing plays. No CSS hides real content as an animation start state — entrance hidden states come only from `gsap.from()` once GSAP hydrates; the only CSS-only entrances are `.line-rise` and `.mark-stamp`, both snapped to zero duration by the global `prefers-reduced-motion: reduce` rule. The hero headline is the one element that must animate without JS, so it animates in CSS.

## Components

- **Bar** (`components/site/Bar.tsx`) — fixed, 56px, `border-b border-ink-rule bg-bg`: the mark plus "Corner Software" (home link) on the left, `Start a project →` in the accent on the right. No menu.
- **Section folio** (`SectionRule`) — a 1px `--ink-rule` top border above an inline row: the ordinal (`<Ordinal dot>`) sets in the accent face, EB Garamond italic (`font-accent`) at 16px, normal case, no tracking, in the accent colour; the section name follows in Label (mono, 11px, 0.22em, uppercase, muted ink).
- **Buttons** — square, 1px accent border, Mono data text in the accent (`Ask for a demo`, the `/demo` CTA). Hover and focus fill the accent and reverse the text to `--bg` (150ms `transition-colors`). There is no secondary button; every other action is a link.
- **Links** (`.link-draw`, `globals.css`) — mono text, `aria-hidden` `→`. Hover and focus draw a 1px accent underline left to right (`scaleX`, 200ms, `cubic-bezier(0.32, 0.72, 0, 1)`).
- **Capture and Device** (`components/site/Capture.tsx`, `components/site/Device.tsx`) — `Capture` fills its positioned parent with a `next/image`; until `shot.src` exists it shows a labelled placeholder frame ("Capture pending · …") over a block grid, so pages build and review end to end before real captures land. `Device` frames a `Capture` as the screen it was taken on: `aspect-[390/844]` for a phone, `aspect-[16/10]` for a laptop.
- **System diagram** (`Diagram`) — desktop SVG plus mobile stack; see Motion. The mobile stack is generated from the same schematic data (`lib/diagrams.ts`) and can never show a connection the desktop version doesn't have.
- **Data rows** — `DataTable` (project SECTOR/MODULES/DELIVERY tables): mono 12.5px, tabular, a 1px rule top border per row, uppercase Faint-Ink labels in a 112px (`w-28`) column. The Company `<dl>` (`components/home/Contact.tsx`) follows the same pattern in the 3/9 grid.
- **Status badge** (`StatusBadge`) — Mono tag, 11px, uppercase, 0.12em, preceded by a 6px (`size-1.5`) square: `bg-success` for operating, `bg-warning` for in build. No border, no fill behind the text.
- **Footer** (`Footer`) — one row behind a rule top border: `Corner Software` and `© 2024–2026` in Label. It takes a `tone` prop from its page so the last chapter on screen closes the page in one color.

## Do's and Don'ts

### Do:
- **Do** read every color through a role token (`bg-bg`, `text-ink-faint`, `border-ink-rule`, `var(--accent)`). Hex belongs only in `lib/tones.ts`, the brand marks, the `globals.css` print block, the status-signal colors and `app/opengraph-image.tsx`.
- **Do** keep `mark-vermillion` (`#D4452C`), the original brand red, out of UI text — it measures 4.3:1, below the small-text AA floor — and use it only in the brand marks (`app/icon.svg`, `components/primitives/Monogram.tsx`, `public/brand/*.svg`).
- **Do** set emphasis with `font-accent` (bone/ink) or the carbon mono variant, and give each section headline exactly one accent word.
- **Do** check bone, ink and carbon — and print — for every visual change, and re-run `lib/tones.test.mjs` when a token moves.
- **Do** separate with 1px `--ink-rule` hairlines and keep every corner at 0px.
- **Do** put `tabular-nums` on every figure and table and `text-balance` on every heading.
- **Do** wrap every animation in `useGSAP` + `gsap.matchMedia()`, and make sure the page is correct with none of it running.

### Don't:
- **Don't** use `rounded-*`, `box-shadow` or glows.
- **Don't** add a gradient anywhere except the bone column grid and the carbon dot grid in `Textures`.
- **Don't** add icons from a library. The arrow is the `→` character, `aria-hidden`, after its label.
- **Don't** fill a surface with the accent at rest — the only exception is a button's hover fill — and don't turn the status green or amber into a second accent.
- **Don't** add header chrome: no nav menu or hamburger. The bar is the mark and one call to action.
- **Don't** capture a screen from production Arogyam, StreamLine or Ordio. Captures come only from public pages (SSC) or a local instance running seeded demo data.
