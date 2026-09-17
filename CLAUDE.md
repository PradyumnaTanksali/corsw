# CLAUDE.md — Operating Instructions for Corsw

> Read `PRODUCT.md` (what is true), then `BRIEF.md` (structure, copy, rules), then `DESIGN.md` (visual system). `BRIEF.md` is the source of truth for copy.

## What this is

corsw.in — the site of Corner Software (Corsw), a software company with industry platforms (Arogyam, StreamLine, Ordio) and an engineering practice (SSC is an engagement). Product pages live at /products/<slug>, engagements at /engineering/<slug>. A /demo page also serves every unassigned *.corsw.in subdomain. One identity in three scroll chapters: **bone** (paper, Garamond), **ink** (the products) and **carbon** (platform, engineering, diagrams).

Modlio (`modlio.corsw.in`) and Scene (`scenestudio.corsw.in`) are archived sites in their own repos. They are not built here and are not divisions.

## How we work

1. **Copy is banked.** Change it in the component and in `BRIEF.md` §4 together. Don't invent claims; if a fact isn't in `PRODUCT.md`, ask. Product copy names only shipped capabilities; check PRODUCT.md's Not claimable list.
2. **Dependencies are fixed:** next, react, react-dom, gsap, @gsap/react, lenis. No others.
3. **Every chapter, every change.** Check bone, ink and carbon, desktop and phone, and reduced motion (DevTools → Rendering).
4. **Conventional Commits**, one concern per commit.
5. **Done means** `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green. A green dev server is not done.

## Code style

- TypeScript strict. No `any`.
- Server Components by default. `"use client"` only where a hook runs.
- Motion lives in `components/motion/*` and client sections, always inside `useGSAP` with `gsap.matchMedia()` gating (`prefers-reduced-motion: no-preference`). Import gsap only from `@/lib/gsap`.
- Colours only via tokens (`text-accent`, `var(--ink-rule)`). Never hex in JSX, except brand marks and `app/opengraph-image.tsx`.
- Emphasis and ordinals: `font-accent` (Garamond italic) and `<Ordinal />`. Never `font-serif italic` directly.
- Colours come from `lib/tones.ts` roles; a section declares `data-tone`, a page's `main` declares `data-tone-start`.
- Square edges. `rounded-*` is banned.

## Never

- Icons from a library; arrows are `→`.
- Gradients (except the column and dot grid textures), rounded corners, shadows or glows.
- A contact form or a nav menu. The fixed bar holds the mark and one call to action only.
- Headcount, "Pvt. Ltd.", team or investor language, dates/issues/versions, external links, or a project on the site that isn't shipped or in build.
- Hinglish, exclamation marks, emoji.
- "transform", "innovative", "cutting-edge", "world-class", "next-generation", "leading", "best-in-class", "seamless".
- Captures that show a client's name, contact details, personal names, revenue or a payment screen. Captures come from public pages, demo accounts, or owner-supplied screenshots put through `scripts/crop-captures.mjs`.

## Always

- `text-balance` on headings, `tabular-nums` on figures.
- `aria-hidden` on decorative ordinals, arrows and marks.
- Check contrast in every chapter when touching a token (text under 18px ≥ 4.5:1).
- Keep `lib/host.test.mjs` passing when touching `lib/host.ts` or `proxy.ts`.
- Hidden start states only in `gsap.from()` on hydration, never in CSS, so content survives without JS.
- Keep `lib/tones.test.mjs`, `lib/diagrams.test.mjs` and `lib/projects.test.mjs` passing.

## Commands

```bash
pnpm dev          # local dev server
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # node --test (host routing, tones, diagrams, projects)
pnpm build        # production build
```
