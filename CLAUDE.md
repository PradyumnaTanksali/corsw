# CLAUDE.md — Operating Instructions for Corsw

> Read `BRIEF.md` first. Then this file. Then `ASSETS.md`. Then ask which step we're on.

---

## What this is

A single-page, monolithic, architectural-feeling site for **Corner Software (Corsw)** — the parent holding company. The full spec is in `BRIEF.md` and **it is the source of truth**.

Corsw is the parent in a **family of three sites**:
- **Corsw** (this one) — institutional + architectural.
- **Modlio** — enterprise division. Built in a separate repo. Reference at `modlio.corsw.in`.
- **Scene** — indie studio. Already deployed at `scene-studio-xi.vercel.app`.

You are not building Modlio or Scene in this repo. They are siblings only.

---

## How we work together

1. **Don't improvise the copy.** §4 of the brief is the entire copy bank — masthead, foundation, divisions, index, manifesto. Use it verbatim. The seven manifesto principles are locked.
2. **Don't add dependencies.** §10 of the brief is final. No icon libraries.
3. **Build sections in the order of §4** — Masthead first, Colophon last. Don't jump around.
4. **Commit each section separately.** Conventional Commits: `feat: masthead`, `feat: divisions-card`, `feat: manifesto`.
5. **Run `pnpm typecheck && pnpm lint && pnpm build` before saying done.** A green dev server is not done.
6. **Re-read the triangulation table (BRIEF §3.7) every session.** It's the single most important rule for keeping Corsw distinct from its siblings.

---

## Code style

- TypeScript strict mode. No `any`.
- Server Components by default. `"use client"` only when a hook (`useReducedMotion`, `useState`, etc.) actually requires it.
- All animations use the shared variants from `lib/motion.ts`. Don't define motion variants inline.
- All colors come from CSS variables (`var(--ink)`, `var(--accent)`), never hex literals in JSX.
- All typography uses the type scale from BRIEF §3.3. No one-off `text-[42px]` values.
- Square edges everywhere. `rounded-*` is banned.

---

## Things to never do

- Never add icons. Site is type-and-line driven.
- Never use a gradient. Anywhere. (Gradients belong to Scene.)
- Never use electric blue, schematic diagrams, or `tabular-nums`-heavy layouts. (Those belong to Modlio.)
- Never use a font that isn't Inter, EB Garamond, or JetBrains Mono.
- Never use `font-bold`. The heaviest weight is `font-medium` (500).
- Never use rounded corners >0px on cards or borders.
- Never add a hamburger menu, sticky nav, or a contact form.
- Never use Hinglish. (Hinglish is Scene's voice.)
- Never use the words "transform," "innovative," "cutting-edge," "world-class," "next-generation."
- Never let vermillion `#D4452C` appear in more than the four places specified in BRIEF §3.2.
- Never animate distances >8px.
- Never write your own manifesto, division descriptions, or index data. Banks are banks.

---

## Things to always do

- Always start with: "Reading `BRIEF.md`. Re-reading the triangulation table. We're at section X."
- Always wrap motion components with `useReducedMotion()` checks.
- Always use `text-balance` on headings.
- Always render the column-grid overlay at the layout root.
- Always use serif italic numerals (EB Garamond italic) for ordinals — `I.`, `II.`, `III.`, not `01.`, `02.`, `03.` (those belong to Modlio).
- Always use `tabular-nums` on the Index and Ledger mono tables.
- Always test the section in mobile Safari before moving on.
- Always cross-check against `https://scene-studio-xi.vercel.app/` to confirm Corsw is *visually distinct*. If they look the same, redesign.

---

## When in doubt

- Triangulation question: re-read `BRIEF.md` §3.7. Are you using vermillion + serif italic + column-grid? If you're reaching for blue or gradients, stop.
- Copy question: re-read `BRIEF.md` §4. Use what's there. Don't invent.
- Animation question: re-read `BRIEF.md` §3.5. 8px max.
- Style question: re-read this file.
- Still stuck: ask. Don't guess on the brand-family.

---

## First message template

When the user says "let's build Corsw," your first response should be exactly this structure:

> Reading `BRIEF.md`. Re-reading the triangulation table in §3.7. The plan:
>
> 1. Bootstrap (Next.js + Tailwind + Framer + fonts via `next/font`)
> 2. Tokens, fonts, column-grid overlay in `app/layout.tsx`
> 3. `<VermillionLine>` + `<Numeral>` + `<SectionRule>` primitives
> 4. Masthead
> 5. Foundation
> 6. Divisions (the centerpiece)
> 7. Index
> 8. Coordinates
> 9. Manifesto
> 10. Provenance
> 11. Ledger
> 12. Colophon
> 13. Polish (a11y, perf, OG, monogram SVG)
>
> Starting on step 1. Ready?

Then wait for confirmation before running setup commands.
