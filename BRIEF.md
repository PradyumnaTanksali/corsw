# CORSW — Site Brief

> **corsw.in is the one public home of Corner Software (Corsw).** One person, Pradyumna Tanksali, builds and runs four projects; the site shows them, the architecture each one runs on, and one address to write to.
>
> Product truth lives in `PRODUCT.md`. The visual system is recorded in `DESIGN.md`. This file holds the information architecture, the copy bank and the hard rules.
>
> Supersedes the May 2026 holding-company brief (two divisions, three-brand triangulation). Design record: `docs/superpowers/specs/2026-09-13-one-corsw-design.md`.

---

## 1. Brand

- **Name:** Corner Software · `corsw`. Etymology kept from the first site: *"Software at every corner."*
- **Positioning:** one company, one person, four projects that are built to be run.
- **One-line:** *Corner Software builds software, and runs it. Four so far.*
- **Contact:** `tanksalipradyumna@gmail.com`. The only address, everywhere.

**Tone:**
- Institutional, not corporate. Short sentences. Periods over commas.
- Corsw is the subject. No "we" pretending to be a team; the person is named where it matters.
- No exclamation marks, no emoji, no Hinglish.
- No metrics theatre. A number on the page is a number measured.
- Never: "transform", "innovative", "cutting-edge", "world-class", "next-generation".

## 2. Information architecture

**`/` — one page, six numbered sections:**

```
Masthead      eyebrow, theme toggle, H1, dateline
1 Foundation  what Corsw is
2 Projects    four ProjectCards (system diagram, tagline, description, table, links)
3 Index       the company in one table
4 Manifesto   seven principles
5 Provenance  who runs it
6 Ledger      links
Colophon
```

**`/demo`** — the three `operating` projects under a short header, a demo mailto and a closing "See one running." block. Noindex. Every unassigned `*.corsw.in` subdomain shows it at `/`.

**`proxy.ts` → `lib/host.ts`** (`pnpm test` covers it):
- `www.corsw.in` → 308 to `https://corsw.in` + path + query.
- any other `*.corsw.in` at `/` → rewrite to `/demo`.
- every host except `corsw.in` → `X-Robots-Tag: noindex`.

No nav menu, no forms, no input fields other than the theme toggle's two buttons.

## 3. Themes

Two dark themes, one token set (`app/globals.css`). Paper is the default; the visitor's choice is stored in `localStorage["corsw-theme"]` and applied by an inline script before first paint.

| Token | Paper | Schematic |
|---|---|---|
| `--bg` | `#0e0e0e` | `#0a0b0f` |
| `--bg-card` | `#161513` | `#111317` |
| `--ink` | `#f5f1e8` | `#e8eaed` |
| `--ink-muted` | `#a8a39a` | `#9ca3af` |
| `--ink-faint` | `#847f76` | `#767d8c` |
| `--ink-rule` | `#2a2825` | `#1f2228` |
| `--accent` | `#d7543d` vermillion | `#3b82f6` electric blue |
| `--success` / `--warning` | `#10b981` / `#f59e0b` | same |
| `--font-accent` | EB Garamond italic | JetBrains Mono upright |
| `--grid-opacity` | `0.04` | `0` |

`--ink-faint` and Paper's `--accent` were lifted from `#5c5852` / `#d4452c` (2.7:1 and 4.3:1) so small text clears 4.5:1. The favicon, monogram and OG image keep `#D4452C`.

**How themes reach components:**
- Colours only through tokens (`bg-bg`, `text-ink-muted`, `var(--accent)`).
- Emphasis words and ordinals use `font-accent`, never `font-serif italic`.
- Content that differs per theme uses the `schematic:` variant. The one case today is `<Ordinal n={…} />`: Roman (`II.`) on Paper, zero-padded Arabic (`02.`) on Schematic.
- Print ignores the theme: white paper, dark ink, Garamond.

**Accent uses (both themes):** the masthead line, ordinals, one emphasis word per section heading, link hovers and the `link-draw` underline, diagram connectors and the accented box, the Index refs, the demo call to action, the colophon square, focus outlines.

**Motion:** 8px maximum translate for reveals; diagram connectors draw with `pathLength`; the masthead line grows once. `prefers-reduced-motion` snaps all of it.

## 4. Copy bank

The shipped components are the copy bank. Change copy there, and keep this list in step.

**Masthead** — eyebrow `Corner Software · Est. 2024 · India`; H1 `Corner Software builds / software, and *runs* it. / *Four* so far.`; dateline `SEPTEMBER · 2026 / ISSUE 02`.

**1 Foundation** — H2 `Corner Software is one company with one *name*.`
- Every project here is built and run by Corsw. Clinics, factory floors, café counters, a wholesale catalogue. Nothing is handed over and left.
- Three of the four are multi-tenant platforms with real tenants. The numbers on this page are the ones in production.
- Software at every corner. The name is the plan.

**2 Projects** — H2 `Four projects, one *workshop*.` Intro: *Four projects, each with its own users: a clinic, a factory floor, a café counter, a wholesale buyer. The schematic on each card is the architecture as it actually runs.* Project copy, tables and links live in `lib/projects.ts`; schematics in `components/primitives/SystemDiagram.tsx`.

| # | Project | Status | Link |
|---|---|---|---|
| 1 | Arogyam | operating | drtanvis.corsw.in |
| 2 | StreamLine | operating | stream.corsw.in |
| 3 | Ordio | operating | ordio.corsw.in |
| 4 | SSC | in build (pre-launch placeholders) | ssc.corsw.in |

`ask for a demo →` appears only on operating projects.

**3 Index** — H2 `The whole company in one *table*.`

| Label | Value | Sub | Ref |
|---|---|---|---|
| Entity | Corner Software | Corsw | ent/01 |
| Founded | 2024 | India | fnd/01 |
| People | One. | Pradyumna Tanksali | peo/01 |
| Projects | Four | Arogyam · StreamLine · Ordio · SSC | prj/04 |
| Operating | Three | One in build | ops/03 |
| Archive | Two sites | Modlio · Scene | arc/02 |

**4 Manifesto** — H2 `Seven *principles*.`
1. One company. One person accountable for every project.
2. Build it, then run it. Nothing is handed off.
3. Small scope. Real users. Long horizons.
4. A number on this page is a number measured.
5. Fewer projects, finished properly.
6. No deck. No sales call. The demo is the product running.
7. Corsw will be here in ten years.

**5 Provenance** — facts `People · One`, `Founded · 2024`, `Based · India`.
- Corner Software is one person: Pradyumna Tanksali. Design, engineering, deployment and support come from the same desk.
- Earlier work shipped under two names, Modlio and Scene. Both sites stay up as an archive. Everything new ships as Corsw.

**6 Ledger** — H2 `External *lines*.` Rows: `tanksalipradyumna@gmail.com · Direct line`, `corsw.in/demo · See a platform running`, `github.com/PradyumnaTanksali · Source`, `modlio.corsw.in · Archive · platforms`, `scenestudio.corsw.in · Archive · apps`.

**Colophon** — `Set in Inter, EB Garamond and JetBrains Mono.` / `Built and run by Pradyumna Tanksali.` / `Version 2.0 · September 2026.` / `© Corner Software, 2024–2026.` / accent square.

**/demo** — eyebrow `Corner Software · Demo`; H1 `Three platforms. / All of them in *service*.`; `Ask for a demo →`; `Everything Corsw builds →`; `See one running.` / *A walk through a live tenant: the operator's screens, not slides. Name the platform in the subject line.*

**Metadata** — title `Corner Software · Software, built and run.`; JSON-LD `Organization` (founder, email, sameAs GitHub) + `ItemList` of the four projects. No `legalName`.

## 5. Hard rules

**Never**
- "Pvt. Ltd.", team language ("we are designers…"), investor claims, or any project besides the four.
- Lokey, Queue, Budgety or Second Brain on this site (owner decision, 2026-09-13).
- A contact form, a nav menu, a hamburger, a sticky header.
- Rounded corners, gradients (the column grid's hairline pattern excepted), shadows used as decoration.
- An icon library. Arrows are `→`.
- `font-bold`. Heaviest weight is `font-medium`.
- Hex colours in JSX outside the brand marks and the OG image.
- A fabricated number: uptime, customers, testimonials.

**Always**
- Both themes checked for every change; contrast ≥ 4.5:1 for text under 18px.
- `tabular-nums` on tables and figures.
- `text-balance` on headings.
- `aria-hidden` on decorative ordinals, marks and arrows.
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before calling anything done.

## 6. Changing the project list

1. Edit `lib/projects.ts` (and add a schematic in `SystemDiagram.tsx` if it's new).
2. Update the hand-written counts: Masthead `Four`, Projects heading and intro, Foundation `Three of the four`, Index `Projects` and `Operating` rows, OG image `Four`, metadata description.
3. `/demo` lists `operating` projects automatically.
