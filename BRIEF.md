# CORSW — Site Brief

> **corsw.in is the public home of Corner Software (Corsw)**, a software company that designs, builds and operates the systems businesses run on. The site shows selected work, the architecture behind it, and a direct way to start a project or see a platform running.
>
> Product truth lives in `PRODUCT.md`. The visual system is recorded in `DESIGN.md` (sidecar `.impeccable/design.json`). This file holds the information architecture, the copy bank and the hard rules.

---

## 1. Brand

- **Name:** Corner Software · `corsw`. Etymology: *"Software at every corner."*
- **Positioning:** software for businesses that depend on it every day — designed, built and kept running by Corsw.
- **One-line:** *Corner Software builds software, and runs it.*
- **Contact:** `tanksalipradyumna@gmail.com`. The only address, everywhere.

**Tone:**
- Professional and plain. Short sentences. Periods over commas.
- Corsw is the subject. No headcount, no founder-as-team framing, no "we are small" or "this is just the start" copy.
- No counts in headlines or prose; numbers live in tables only.
- No exclamation marks, no emoji, no Hinglish, no dates, issue numbers or version strings.
- Never: "transform", "innovative", "cutting-edge", "world-class", "next-generation".

## 2. Information architecture

**`/` — one page, five numbered sections:**

```
Masthead      eyebrow, theme toggle, H1, action row
1 Foundation  what Corsw does
2 Work        project cards (system diagram, tagline, description, table, demo link)
3 Company     at a glance
4 Approach    four principles
5 Contact     start a project, see a platform, email
Footer        one line
```

**`/demo`** — the `operating` projects under a short header, a demo mailto and a closing "See one running." block. Noindex. Every unassigned `*.corsw.in` subdomain shows it at `/`.

**`proxy.ts` → `lib/host.ts`** (`pnpm test` covers it):
- `www.corsw.in` → 308 to `https://corsw.in` + path + query.
- any other `*.corsw.in` at `/` → rewrite to `/demo`.
- every host except `corsw.in` → `X-Robots-Tag: noindex`.

Links on the site: the email, `/demo`, and internal navigation only. No external links.

## 3. Themes

Two dark themes, one token set (`app/globals.css`); details in `DESIGN.md`. Paper is the default; the visitor's choice is stored in `localStorage["corsw-theme"]` and applied before first paint.

| Token | Paper | Schematic |
|---|---|---|
| `--bg` | `#0e0e0e` | `#0a0b0f` |
| `--bg-card` | `#161513` | `#111317` |
| `--ink` | `#f5f1e8` | `#e8eaed` |
| `--ink-muted` | `#a8a39a` | `#9ca3af` |
| `--ink-faint` | `#847f76` | `#767d8c` |
| `--ink-rule` | `#2a2825` | `#1f2228` |
| `--accent` | `#d7543d` vermillion | `#3b82f6` electric blue |
| `--font-accent` | EB Garamond italic | JetBrains Mono upright |
| `--accent-weight` | `400` | `500` |
| `--accent-tracking` | `normal` | `-0.04em` |
| `--grid-opacity` | `0.04` | `0` |

- Colours only through tokens. Emphasis words and ordinals use `font-accent` / `<Ordinal />`; per-theme content uses the `schematic:` variant.
- Accent uses: the masthead line, project and principle ordinals, one emphasis word per section heading, link hovers and the `link-draw` underline, diagram connectors, call-to-action borders, focus outlines.
- Motion: 8px maximum translate; diagram connectors draw once; `prefers-reduced-motion` snaps all of it.

## 4. Copy bank

The shipped components are the copy bank. Change copy there, and keep this list in step.

**Masthead** — eyebrow `Corner Software · Est. 2024 · India`; H1 `Corner Software builds / software, and *runs* it.`; ruled action row `Start a project →` (mailto, subject "New project") · `See a platform running →` (`/demo`).

**1 Foundation** — H2 `Software at every *corner*.`
- (lead) Corner Software builds the systems small businesses run on every day. A clinic's front desk. A factory's order book. A café's counter. A distributor's catalogue.
- Every project is designed, built and kept running by Corsw. Launch is where the work starts, not where it ends.

**2 Work** — H2 `Selected *work*.` Intro: *Software Corsw designs, builds and operates for businesses in healthcare, manufacturing, food service and distribution. Each diagram shows how the system is put together.* Cards come from `lib/projects.ts` (tagline, two short paragraphs, a SECTOR / MODULES / DELIVERY table); schematics from `components/primitives/SystemDiagram.tsx`. `Request a demo →` appears only on operating projects. No tenant names, client counts or live links on cards.

| # | Project | Status |
|---|---|---|
| 1 | Arogyam — practice management for clinics | operating |
| 2 | StreamLine — operations software for small manufacturers | operating |
| 3 | Ordio — QR ordering and kitchen display | operating |
| 4 | SSC — catalogue and quote requests for a distributor | in build |

**3 Company** — H2 `At a *glance*.` Rows: Company · Corner Software (Corsw); Founded · 2024; Based · India; Sectors · Healthcare · Manufacturing · Food service · Distribution; Services · Product design · Engineering · Hosting and support.

**4 Approach** — H2 `How Corsw *works*.`
1. Start from how the business actually runs.
2. Build for daily use, on the devices people already carry.
3. Stay after launch: hosting, updates and support.
4. Clear scope and plain communication throughout.

**5 Contact** — H2 `Start a *project*.`
- (lead) Corsw designs, builds and operates software for businesses that rely on it every day.
- Share what you run today and where it slows you down. The reply sets out what can be built, the timeline and the cost.
- `Start a project →` (bordered accent) · `See a platform running →` (`/demo`) · the email address.

**Footer** — `Corner Software` · `© 2024–2026`.

**/demo** — eyebrow `Corner Software · Demo`; H1 `Platforms in *service*.`; `Ask for a demo →`; `Everything Corsw builds →`; `See one running.` / *A walk through a live tenant: the operator's screens, not slides. Name the platform in the subject line, or describe what you would like built.*

**Metadata** — title `Corner Software · Software, built and run.`; JSON-LD `Organization` (founder, email, sameAs GitHub) + `ItemList` of the projects. No `legalName`.

## 5. Hard rules

**Never**
- Headcount ("one person", "People: One"), "Pvt. Ltd.", team or investor claims, "just getting started" framing.
- Counts, dates, issue numbers or version strings in visible copy (tables excepted for data).
- External links (the email and `/demo` are the only ways out).
- A project on the site that isn't shipped or in build; tenant or client names on cards.
- A contact form, a nav menu, a sticky header.
- Rounded corners, gradients (the column grid's hairline pattern excepted), decorative shadows, an icon library (arrows are `→`), `font-bold`.
- A fabricated number or an unevidenced legal claim ("compliant"). Arogyam keeps consent and audit records; it is not certified.
- Mobile diagrams that connect boxes the desktop schematic doesn't.

**Always**
- Both themes checked for every change; contrast ≥ 4.5:1 for text under 18px.
- `tabular-nums` on tables, `text-balance` on headings, `aria-hidden` on decorative ordinals, marks and arrows.
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before calling anything done.

## 6. Changing the project list

1. Edit `lib/projects.ts` (and add a schematic in `SystemDiagram.tsx` if it's new).
2. Update the Sectors row in `components/sections/Index.tsx`, the Work intro and the metadata description if a new sector appears.
3. `/demo` lists `operating` projects automatically.
