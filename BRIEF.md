# CORSW — Site Brief

> **corsw.in is the public home of Corner Software (Corsw)**, a software company that designs, builds and operates the systems businesses run on. The site shows selected work, the architecture behind it, and a direct way to start a project or see a platform running.
>
> Product truth lives in `PRODUCT.md`. The visual system is recorded in `DESIGN.md` (sidecar `.impeccable/design.json`). This file holds the information architecture, the copy bank and the hard rules.

---

## 1. Brand

- **Name:** Corner Software · `corsw`. Etymology: *"Software at every corner."*
- **Positioning:** software for businesses that depend on it every day — designed, built and kept running by Corsw.
- **One-line:** *Corner Software builds software, and runs it.*
- **Contact:** `hello@corsw.in`. The only address, everywhere.

**Tone:**
- Professional and plain. Short sentences. Periods over commas.
- Corsw is the subject. No headcount, no founder-as-team framing, no "we are small" or "this is just the start" copy.
- No counts in headlines or prose; numbers live in tables only.
- No exclamation marks, no emoji, no Hinglish, no dates, issue numbers or version strings.
- Never: "transform", "innovative", "cutting-edge", "world-class", "next-generation".

## 2. Information architecture

**`/` — a fixed bar, then six chapters:**

```
Bar           mark (home), Start a project →
Hero          bone — eyebrow, H1, subline, action row
1 Foundation  bone — what Corsw does, sector marquee
2 Work        ink, pinned — the four projects in sequence
3 Approach    carbon — one system diagram, four principles
4 Company     carbon — at a glance
5 Contact     carbon — start a project, see a platform, email
Footer        one line
```

**`/work/<slug>` — one case study per project:**

```
Hero            ink — ordinal, name, status, tagline, capture
1 The business  bone — what the customer runs, what changed
2 In use        ink — a sticky device walking through 3–4 steps
3 Architecture  carbon — that project's diagram, the data table
Next project    ink — the next project, linking on
```

**`/demo`** — the `operating` projects under a short header, a demo mailto and a closing "See one running." block. Noindex. Every unassigned `*.corsw.in` subdomain shows it at `/`.

**`proxy.ts` → `lib/host.ts`** (`pnpm test` covers it):
- `www.corsw.in` → 308 to `https://corsw.in` + path + query.
- any other `*.corsw.in` at `/` → rewrite to `/demo`.
- every host except `corsw.in` → `X-Robots-Tag: noindex`.

Links on the site: the email, `/demo`, `/work/<slug>`, and internal navigation only. No external links.

## 3. Chapters

One token set (`lib/tones.ts`), three chapters the page scrolls through in a fixed order — bone, ink, carbon. There is no visitor toggle: the chapter is set by scroll position (each section carries `data-tone`, scrubbed on `<html>` by `ToneScroller`) and, before any JS runs, by `data-tone-start` on the page's `<main>`. Details in `DESIGN.md`.

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

- Colours only through tokens. Emphasis words use `font-accent` (Garamond italic) on bone and ink, a tighter mono face on carbon; ordinals always render through `<Ordinal />` (Garamond italic in every chapter).
- Accent uses: the corner mark's inset square, project and principle ordinals, one emphasis word per section heading, link hovers and the `link-draw` underline, diagram connectors, call-to-action borders, focus outlines.
- Motion carries the identity: reveals, scrubs and pins replace the old toggle; `prefers-reduced-motion` snaps everything to its final state.

## 4. Copy bank

The shipped components are the copy bank. Change copy there, and keep this list in step.

**Hero** — eyebrow `Est. 2024 · India`; H1 `Software at every *corner*.`; line `Corner Software builds software, and **runs** it.`; ruled action row `Start a project →` (mailto, subject "New project") · `See a platform running →` (`/demo`).

**1 Foundation** — no H2.
- (lead) Corner Software builds the systems small businesses run on every day. A clinic's front desk. A factory's order book. A café's counter. A distributor's catalogue.
- Every project is designed, built and kept running by Corsw. Launch is where the work starts, not where it ends.
- Marquee: `Healthcare · Manufacturing · Food service · Distribution`.

**2 Work** — H2 `Selected *work*.` Intro: *Software Corsw designs, builds and operates for businesses in healthcare, manufacturing, food service and distribution.* Per project: the capture, the name, the status badge, the tagline and `Read the case study →`. No tenant names, client counts or live links on cards. The diagram, the description and the data table now live on that project's `/work/<slug>` page.

| # | Project | Status |
|---|---|---|
| 1 | Arogyam — practice management for clinics | operating |
| 2 | StreamLine — operations software for small manufacturers | operating |
| 3 | Ordio — QR ordering and kitchen display | operating |
| 4 | SSC — catalogue and quote requests for a distributor | in build |

**3 Approach** — H2 `How Corsw **works**.`
1. Start from how the business actually runs.
2. Build for daily use, on the devices people already carry.
3. Stay after launch: hosting, updates and support.
4. Clear scope and plain communication throughout.

Beside the principles, one system diagram (Ordio) assembles as evidence.

**4 Company** — Rows: Company · Corner Software (Corsw); Founded · 2024; Based · India; Sectors · Healthcare · Manufacturing · Food service · Distribution; Services · Product design · Engineering · Hosting and support.

**5 Contact** — H2 `Start a **project**.`
- (lead) Corsw designs, builds and operates software for businesses that rely on it every day.
- Share what you run today and where it slows you down. The reply sets out what can be built, the timeline and the cost.
- `Start a project →` (large, weight-shifts on hover) · `See a platform running →` (`/demo`) · the email address.

**Footer** — `Corner Software` · `© 2024–2026`.

**Case studies (`/work/<slug>`)** — Hero: the project's ordinal and sector, its status badge, the name as H1, the tagline, the capture. **The business** — two paragraphs from `lib/projects.ts` (`business`): what the customer runs today, then what Corsw's software does about it. **In use** — H2 `How it *runs*.` — 3–4 walkthrough steps (`lib/projects.ts` `walkthrough`), each a caption beside the screen it describes. **Architecture** — H2 `How it is **built**.` — that project's system diagram and its SECTOR / MODULES / DELIVERY table, plus `Ask for a demo →` on operating projects only. **Next project** — `Next project →`, then the next project's name, linking on. The `business` and `walkthrough` captions in `lib/projects.ts` are drafted from verified `PROJECTS.md` facts and need owner review before launch.

**404** — `Not found`; H1 `Nothing at this *corner*.`; `Back to Corner Software →`.

**/demo** — eyebrow `Corner Software · Demo`; H1 `Platforms in *service*.`; `Ask for a demo →`; `Everything Corsw builds →`; `See one running.` / *A walk through a live tenant: the operator's screens, not slides. Name the platform in the subject line, or describe what you would like built.*

**Metadata** — title `Corner Software · Software, built and run.`; JSON-LD `Organization` (founder with sameAs GitHub, email) + `ItemList` of the projects on `/`, `CreativeWork` per case study. No `legalName`.

## 5. Hard rules

**Never**
- Headcount ("one person", "People: One"), "Pvt. Ltd.", team or investor claims, "just getting started" framing.
- Counts, dates, issue numbers or version strings in visible copy (tables excepted for data).
- External links (the email and `/demo` are the only ways out).
- A project on the site that isn't shipped or in build; tenant or client names on cards.
- A contact form or nav menu.
- Rounded corners, gradients (the column and dot grids excepted), shadows, an icon library.
- A fabricated number or an unevidenced legal claim ("compliant"). Arogyam keeps consent and audit records; it is not certified.
- Mobile diagrams that connect boxes the desktop schematic doesn't.
- Captures from production systems.

**Always**
- All three chapters, phone and reduced motion checked for every change; contrast ≥ 4.5:1 for text under 18px.
- `tabular-nums` on tables, `text-balance` on headings, `aria-hidden` on decorative ordinals, marks and arrows.
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before calling anything done.

## 6. Changing the project list

1. Edit `lib/projects.ts` (business copy, walkthrough steps, a schematic in `lib/diagrams.ts` if it's new).
2. Update the Sectors row in `components/home/Contact.tsx`, the Work intro (`components/home/Work.tsx`) and the metadata description in `app/layout.tsx` if a new sector appears.
3. `/demo` lists `operating` projects automatically.
