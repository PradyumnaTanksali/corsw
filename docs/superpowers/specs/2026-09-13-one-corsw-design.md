# One Corsw — design

Date: 2026-09-13 · Branch: `rebrand/one-corsw` (worktrees in `/Users/apple/Personal/.worktrees/<repo>`)

## Why

Corner Software was written as a holding company with two divisions (Modlio, Scene).
It is one person — Pradyumna Tanksali — shipping everything. The division system is
overhead and the copy that describes it is untrue ("a small group of people", "one
accountant", "Pvt. Ltd.", "does not take outside work"). Fold everything into one
entity: **Corsw**.

## Decisions (from the owner, 2026-09-13)

| Topic | Decision |
|---|---|
| Entity | One company, Corner Software (Corsw). Named solo: Pradyumna Tanksali. No "Pvt. Ltd." anywhere. Builds its own products and takes selective client work. |
| Themes | Visitor toggle on corsw.in: **Paper** (current corsw) ⇄ **Schematic** (Modlio's look). Paper is default. Choice remembered. |
| Demo site | Modlio's `/showcase` becomes `corsw.in/demo`. |
| Wildcard | `*.corsw.in` moves from the `modlio` Vercel project to `corsw`; unassigned subdomains land on `/demo`. |
| Sibling sites | `modlio.corsw.in` and `scenestudio.corsw.in` stay up, unchanged except contact email. Revisit later. |
| Projects | Four on the site: Arogyam, StreamLine, Ordio, SSC. Lokey, Queue, Budgety and Second Brain are not listed. (owner, second review) |
| Contact | `tanksalipradyumna@gmail.com` is the only contact address across all projects. |
| Isolation | All edits in worktrees on `rebrand/one-corsw`; the uncommitted SEO pass (`seo/technical-pass`) is carried into the corsw worktree verbatim. |

## 1. Theme system

One token set, two values. Components already read tokens (`bg-bg`, `text-ink`,
`text-accent`, `var(--accent)` inside the schematics), so a theme is only a block of
CSS variables under `html[data-theme]`.

| Token | Paper (default) | Schematic |
|---|---|---|
| `--bg` | `#0e0e0e` | `#0a0b0f` |
| `--bg-card` | `#161513` | `#111317` |
| `--ink` | `#f5f1e8` | `#e8eaed` |
| `--ink-muted` | `#a8a39a` | `#9ca3af` |
| `--ink-faint` | `#5c5852` | `#6b7280` |
| `--ink-rule` | `#2a2825` | `#1f2228` |
| `--accent` | `#d4452c` vermillion | `#3b82f6` electric blue |
| `--success` / `--warning` | `#10b981` / `#f59e0b` | same |
| `--font-accent` | EB Garamond, italic | JetBrains Mono, upright |
| `--grid-opacity` | `0.04` | `0` (Schematic's texture is the diagrams) |

- **Emphasis words and ordinals** use one utility, `font-accent`, instead of
  `font-serif italic`. Paper renders Garamond italic; Schematic renders mono.
- **Numerals** differ in content, not only style: Paper shows Roman (`II.`), Schematic
  shows Arabic (`02`). `Numeral` and `SectionRule` render both, and CSS hides the one
  the active theme doesn't use. Both are `aria-hidden`; the section label carries meaning.
- **Toggle**: `ThemeToggle` (client) in the masthead eyebrow row — two buttons,
  `Paper` / `Schematic`, `aria-pressed`, 120ms colour transition only. Writes
  `localStorage["corsw-theme"]`. A blocking inline script in `<head>` sets
  `data-theme` before first paint (no flash); `<html suppressHydrationWarning>`.
  Storage failure → Paper.
- **Motion**: one system for both themes — corsw's 8px reveals plus Modlio's
  `pathLength` diagram draws. `prefers-reduced-motion` snaps both.
- **Print**: existing print stylesheet stays and overrides either theme.
- `VermillionLine` is renamed `AccentLine` (it already paints `var(--accent)`).
- Static surfaces (favicon, monogram, OG image, `themeColor`) stay Paper.

## 2. corsw.in — information architecture

Single page, six numbered sections + colophon. Coordinates is removed: three
city "nodes" describe a team that does not exist.

```
Masthead      identity, theme toggle
I   Foundation   what Corsw is
II  Projects     four project cards, each with a system diagram
III Index        the company in one table
IV  Manifesto    seven principles (rewritten)
V   Provenance   who runs it
VI  Ledger       links
Colophon
```

Plus `/demo` and `proxy.ts` (see §4).

### Ported from modlio (copied, then de-Modlio'd)

`SystemDiagram` (plus a new SSC schematic), `PlatformCard`, `StatusBadge`, `DataTable`,
`lib/platforms.ts` (becomes `lib/projects.ts`), `.tnum` + `.link-draw` CSS. `SectionMark` (the MODLIO label
on rules) is not ported. No new dependencies — both repos are Next 16.2.4 /
React 19.2.4 / framer-motion 12 / Tailwind 4.

## 3. Copy (draft — owner reviews)

Voice stays institutional: short sentences, periods over commas, no exclamation
marks, no Hinglish, no "transform / innovative / cutting-edge / world-class /
next-generation". Corsw is the subject; no "we" pretending to be a team.

### Masthead

- Eyebrow: `CORNER SOFTWARE · EST. 2024 · INDIA` · toggle at right.
- H1: `Corner Software builds` / `software, and` *`runs`* `it.` / *`Four`* `so far.`
- Dateline: `SEPTEMBER · 2026 / ISSUE 02`

### I — Foundation

- H2: `Corner Software is one company with one` *`name`*`.`
- `Every product ships as Corsw. Clinics, factory floors, café counters, a wholesale catalogue. Each one is built to be run, not handed over.`
- `Corsw runs what it builds. The platforms are multi-tenant, the tenants are real, and the numbers on this page are the ones in production.`
- `Software at every corner. The name is the plan.`

### II — Projects

- H2: `Four projects, one` *`workshop`*`.`
- Intro: `Four projects, each with its own users: a clinic, a factory floor, a café counter, a wholesale buyer. The schematic on each card is the architecture as it actually runs.`
- Four `PlatformCard`s (diagram, tagline, description, table, live link). An
  `ask for a demo →` mailto shows only on `operating` projects.
  - `01 / AROGYAM`, `02 / STREAMLINE`, `03 / ORDIO` — Modlio's `lib/platforms.ts`
    copy with "Modlio" removed. StreamLine's table updated from PROJECTS.md
    (2026-09-03): `OPERATING · Quotations · Invoices · Purchase orders · Work orders · Payroll`;
    its `IN BUILD` row removed.
  - `04 / SSC` — status `IN BUILD` (placeholders for phone, WhatsApp, licences are
    still listed as pre-launch blockers in its README), so no demo link.
    - Tagline: `Catalogue and quote requests for an Ayurvedic wholesale distributor.`
    - `A catalogue-led site for Shivam Sales Corporation, a wholesale distributor of Ayurvedic medicines. The catalogue lives in typed files, not a CMS: a product that names a brand or category that does not exist fails the build.`
    - `Buyers search by name, brand or indication, narrow by a faceted rail, and send a quote request that is validated on the server and delivered by email — or open WhatsApp with the product already named. Headline figures are derived from the data, so they cannot drift.`
    - Table: `CATALOGUE · 41 product lines · 8 categories` · `BRANDS · 12 stocked` · `REACH · 18 cities · 5 states` · `STACK · Next.js 15 · Tailwind 4 · Resend`
    - Link: `ssc.corsw.in`
    - Schematic: Buyer + WhatsApp → Catalogue pages (accent) → Typed catalogue,
      Brands + taxonomy, Search + facets, Enquiry API → Resend. Annotations:
      `no CMS, no database` · `figures derived, never typed` · `no lead dropped silently`.

### III — Index

| Label | Value | Sub | Ref |
|---|---|---|---|
| Entity | Corner Software | Corsw | ent/01 |
| Founded | 2024 | India | fnd/01 |
| People | One. | Pradyumna Tanksali | peo/01 |
| Projects | Four | Arogyam · StreamLine · Ordio · SSC | prj/04 |
| Operating | Three | One in build | ops/03 |
| Archive | Two sites | Modlio · Scene | arc/02 |

H2: `The whole company in one` *`table`*`.`

### IV — Manifesto

H2: `Seven` *`principles`*`.`

1. `One company. Every product ships under it.`
2. `Build it, then run it. Nothing is handed off.`
3. `Small scope. Real users. Long horizons.`
4. `A number on this page is a number measured.`
5. `Fewer projects, finished properly.`
6. `No deck. No sales call. The demo is the product running.`
7. `Corsw will be here in ten years.`

### V — Provenance

Left column: `ONE PERSON · EST. 2024 · INDIA` (mono).

- `Corner Software is one person: Pradyumna Tanksali. Design, engineering, deployment and support come from the same desk.`
- `Earlier work shipped under two names, Modlio and Scene. Both sites stay up as an archive. Everything new ships as Corsw.`

H2 not used (matches current section).

### VI — Ledger

H2: `External` *`lines`*`.`

| Key | Label |
|---|---|
| `tanksalipradyumna@gmail.com` | Direct line |
| `corsw.in/demo` | See a platform running |
| `github.com/PradyumnaTanksali` | Source |
| `modlio.corsw.in` | Archive · platforms |
| `scenestudio.corsw.in` | Archive · apps |

### Colophon

`Set in Inter, EB Garamond and JetBrains Mono.` / `Built and run by Pradyumna Tanksali.` /
`Version 2.0 · September 2026.` / `© Corner Software, 2024–2026.` / accent `■`.

### Metadata

- Title: `Corner Software · Software, built and run.`
- Description: `Corner Software (Corsw) builds and runs software: Arogyam for clinics, StreamLine for manufacturers, Ordio for cafés, and a wholesale catalogue for SSC. Run by Pradyumna Tanksali. Founded 2024.`
- JSON-LD: `Organization` without `legalName`, `subOrganization`, or locations;
  `email` = gmail; `founder` = Pradyumna Tanksali; `sameAs` = github.com/PradyumnaTanksali;
  `ItemList` of the four projects.
- OG image: same composition, new H1 (`runs`, `Four` italic), bottom row
  `CORSW · SEPTEMBER 2026` / `ONE PERSON · INDIA`.

## 4. `/demo` and the wildcard

- `app/demo/page.tsx` — Modlio's showcase, listing only `operating` projects: eyebrow `CORSW · DEMO`, H1
  `Three platforms.` / `All of them in service.`, `Ask for a demo →` (mailto, subject
  `Demo request`), secondary `Everything Corsw builds →` to `/`, the platform cards,
  `See one running.` block, footer. Noindex, follow (duplicates the homepage section).
- `proxy.ts` (Next 16 convention):
  - `www.corsw.in` → 308 to `https://corsw.in` + path (absolute origin, no open redirect).
  - any other `*.corsw.in` host at `/` → rewrite to `/demo`.
  - every host except `corsw.in` gets `X-Robots-Tag: noindex`.
  - matcher skips `_next/static`, `_next/image`, `brand`, icon files.
- `sitemap.ts` stays homepage-only; the noindex `/demo` is not listed.
- Vercel, after the production deploy is live: remove `*.corsw.in` from `modlio`,
  add to `corsw` (project domain API). Every live subdomain is already explicitly
  assigned (checked 2026-09-13: ordio, stream, streamline, drtanvis, scenestudio,
  ssc, lokey, modlio), so only unassigned hosts change. Gap between remove and add
  is seconds.

## 5. Contact email sweep

| Repo | File | From → To |
|---|---|---|
| corsw | Ledger, JSON-LD | `hello@corsw.in` → gmail; `github.com/corsw` → `github.com/PradyumnaTanksali` (`corsw` on GitHub is an unrelated stranger's account) |
| modlio | `components/sections/Contact.tsx` | drop the three `@modlio.in` rows; keep the `DEMO_EMAIL` row |
| modlio | `BRIEF.md` §4.8 | same |
| scene-studio | `components/sections/Footer.tsx`, `SCENE_BRIEF.md` | `hello@scene.studio` → gmail; footer GitHub link → `github.com/PradyumnaTanksali` |
| ordio | `src/modules/push/core.ts` | VAPID fallback `mailto:hello@corsw.in` → gmail (production `VAPID_SUBJECT` env is already gmail) |
| streamline | `src/lib/push.ts` | VAPID `mailto:admin@corsw.in` → gmail |
| ssc | `src/data/company.ts` | placeholder `sales@shivamsales.com` → gmail |

Not changed, on purpose: sender addresses (`onboarding@resend.dev`,
`login@arogyam.app`) — a Gmail address cannot be a Resend sender; test fixtures;
tenant data inside databases; `.env.example` placeholders.

## 6. Docs and memory

- corsw `BRIEF.md` rewritten as single-entity law (theme table replaces the
  triangulation table; copy bank = §3 above). `CLAUDE.md` rules updated (serif/blue
  bans become per-theme rules). `README.md` updated.
- `/Users/apple/Personal/PROJECTS.md`: one Corsw section listing all products;
  Modlio and Scene marked archive.
- Memory `modlio-family-workspace` rewritten to the one-entity layout.

## 7. Verification

- corsw worktree: `pnpm typecheck && pnpm lint && pnpm build` green.
- Run the built site: both themes render every section; toggle persists across
  reload with no flash; reduced motion snaps; print preview still document-like.
- Contrast: every text/background pair in both themes ≥ 4.5:1 for text under 18px
  (script check, not eyeballing).
- `proxy.ts`: a runnable assert check for the three host cases.
- Grep across all repos: no `hello@corsw.in`, `admin@corsw.in`, `@modlio.in`,
  `hello@scene.studio`, `Pvt. Ltd.` left in corsw.

## 8. Release

1. Commit per concern in each worktree.
2. Push `rebrand/one-corsw` → Vercel preview URLs. Owner checks corsw preview.
3. Owner OK → merge to `main` (production). The SEO pass rides along in corsw only.
4. Move the wildcard (§4).
5. Worktrees removed after merge; the SEO sessions' own checkouts are never touched.

## Out of scope

Lokey, Queue, Budgety, Second Brain on corsw.in; redesigning modlio or scene sites; removing their false "Pvt. Ltd." / team copy
(flagged to owner); a third (light) theme; per-product pages; `/changelog`.
