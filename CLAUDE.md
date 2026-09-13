# CLAUDE.md — Operating Instructions for Corsw

> Read `PRODUCT.md` (what is true), then `BRIEF.md` (structure, copy, rules), then `DESIGN.md` (visual system). `BRIEF.md` is the source of truth for copy.

## What this is

corsw.in — the single site of Corner Software (Corsw), a one-person company run by Pradyumna Tanksali. Four projects so far (Arogyam, StreamLine, Ordio, SSC) and a section inviting new clients, a `/demo` page that also serves every unassigned `*.corsw.in` subdomain, and two switchable themes: **Paper** (vermillion, Garamond italic) and **Schematic** (electric blue, mono).

Modlio (`modlio.corsw.in`) and Scene (`scenestudio.corsw.in`) are archived sites in their own repos. They are not built here and are not divisions.

## How we work

1. **Copy is banked.** Change it in the component and in `BRIEF.md` §4 together. Don't invent claims; if a fact isn't in `PRODUCT.md`, ask.
2. **No new dependencies.**
3. **Both themes, every change.** Toggle in the masthead, or set `localStorage["corsw-theme"]`.
4. **Conventional Commits**, one concern per commit.
5. **Done means** `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green. A green dev server is not done.

## Code style

- TypeScript strict. No `any`.
- Server Components by default. `"use client"` only for hooks (`useReducedMotion`, `useSyncExternalStore`) or Framer motion components.
- Section motion uses `lib/motion.ts` variants; diagrams use its `drawPath` / `fadeIn` / `fadeUpSm`.
- Colours only via tokens (`text-accent`, `var(--ink-rule)`). Never hex in JSX, except brand marks and `app/opengraph-image.tsx`.
- Emphasis and ordinals: `font-accent` and `<Ordinal />`. Never `font-serif italic` directly — Schematic would keep the serif.
- Per-theme content: the `schematic:` variant.
- Square edges. `rounded-*` is banned.

## Never

- Icons from a library; arrows are `→`.
- Gradients, rounded corners, `font-bold`.
- A contact form, nav menu or sticky header.
- "Pvt. Ltd.", team or investor language, or a project on the site that isn't shipped or in build.
- Hinglish, exclamation marks, emoji.
- "transform", "innovative", "cutting-edge", "world-class", "next-generation".
- Translate more than 8px in a reveal.

## Always

- `text-balance` on headings, `tabular-nums` on figures.
- `aria-hidden` on decorative ordinals, arrows and marks.
- Check contrast in both themes when touching a token (text under 18px ≥ 4.5:1).
- Keep `lib/host.test.mjs` passing when touching `lib/host.ts` or `proxy.ts`.

## Commands

```bash
pnpm dev          # local dev server
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # node --test (host routing)
pnpm build        # production build
```
