# CORSW — Site Brief

> **corsw.in is the public home of Corner Software (Corsw)**, a software company that builds and operates industry platforms (Arogyam, StreamLine, Ordio) on one engineering foundation, and engineers custom platforms to the same standards. The site shows what each platform does, the architecture behind it, and two ways forward: request a demo or start a project.
>
> Product truth lives in `PRODUCT.md`. The visual system is recorded in `DESIGN.md` (sidecar `.impeccable/design.json`). This file holds the information architecture, the copy bank and the hard rules.

---

## 1. Brand

- **Name:** Corner Software · `corsw`. Etymology: *"Software at every corner."*
- **Positioning:** Industry platforms for healthcare, manufacturing and food service, built, hosted and run by Corner Software, plus custom platforms engineered to the same standards.
- **One-line:** *Corner Software · Industry platforms, built and run.*
- **Contact:** `hello@corsw.in`. The only address, everywhere.

**Tone:**
- Professional and plain. Short sentences. Periods over commas.
- Corsw is the subject; never "we". No headcount, no founder-as-team framing, no "we are small" or "this is just the start" copy.
- No counts in headlines or prose; numbers live in tables only.
- No exclamation marks, no emoji, no Hinglish, no dates, issue numbers or version strings.
- Never: "transform", "innovative", "cutting-edge", "world-class", "next-generation", "leading", "best-in-class", "seamless".

## 2. Information architecture

**`/` — a fixed bar, then six chapters:**

```
Bar            mark (home), Request a demo →
Hero           bone — eyebrow, H1, subline, action row
1 Overview     bone — what Corsw builds, sector marquee
2 Products     ink, pinned — the products in sequence
3 Platform     carbon — one system diagram, six pillars
4 Engineering  carbon — services list, a selected engagement
5 Company      carbon — at a glance
6 Contact      carbon — request a demo, start a project, email
Footer         one line
```

**`/products/<slug>` — one page per product:**

```
Hero              ink — ordinal, sector, status, name, tagline, capture
1 What it solves  bone — what the business runs into, what changed
2 In use          ink — a sticky device walking through 3–4 steps
3 Architecture    carbon — that product's diagram, the data table, Request a demo
Next product      ink — the next product, linking on
```

**`/engineering/<slug>` — one page per engagement:**

```
Hero              ink — ordinal, sector, status, name, tagline, capture
1 The engagement  bone — what the business runs into, what Corsw built
2 In use          ink — a sticky device walking through 3–4 steps
3 Architecture    carbon — that engagement's diagram, the data table
All products      ink — back to the products on /#products
```

**`/demo`** — the operating products under a short header, a demo mailto and a closing "See one running." block. Noindex. Every unassigned `*.corsw.in` subdomain shows it at `/`.

**`proxy.ts` → `lib/host.ts`** (`pnpm test` covers it):
- `www.corsw.in` → 308 to `https://corsw.in` + path + query.
- any other `*.corsw.in` at `/` → rewrite to `/demo`.
- every host except `corsw.in` → `X-Robots-Tag: noindex`.

Links on the site: the email, `/demo`, `/products/<slug>`, `/engineering/<slug>`, and internal navigation only. No external links.

## 3. Chapters

One token set (`lib/tones.ts`), three chapters the page scrolls through in a fixed order — bone, ink, carbon. There is no visitor toggle: the chapter is set by scroll position (each section carries `data-tone`, crossfaded on `<html>` by `ToneScroller` as each section arrives) and, before any JS runs, by `data-tone-start` on the page's `<main>`. Details in `DESIGN.md`.

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
- Accent uses: the corner mark's inset square, section folio, product and walkthrough-step ordinals, one emphasis word per section heading, link hovers and the `link-draw` underline, diagram connectors, call-to-action borders, focus outlines.
- Motion carries the identity: reveals, scrubs and pins replace the old toggle; `prefers-reduced-motion` snaps everything to its final state.

## 4. Copy bank

The shipped components are the copy bank. Change copy there, and keep this list in step.

**Hero** — eyebrow `Est. 2024 · India`; H1 `Software at every *corner*.`; line `Industry platforms for healthcare, manufacturing and food service. Built, hosted and **run** by Corner Software.`; action row `Request a demo →` (mailto, subject "Demo request") · `Build with Corsw →` (`#engineering`).

**1 Overview** — no H2.
- (lead, scrub-lit) Every business runs on a handful of systems it cannot afford to lose: the front desk, the order book, the kitchen ticket. Corner Software builds those systems as platforms, operates them, and improves them for every customer at once.
- Arogyam, StreamLine and Ordio serve healthcare, manufacturing and food service. The same engineering practice builds custom platforms for businesses no product fits yet.
- Marquee: `Healthcare practices · Manufacturing · Trading · Restaurants and cafés · Wholesale distribution`.

**2 Products** — H2 `Built for whole *industries*.` Intro: *Each platform is designed around how an industry works, then configured for every business that runs on it.* One pinned item per product (`kind: "product"`): the capture, the name, the status badge, the tagline and `Explore <Name> →`. No tenant names, client counts or live links on cards. The diagram, the description and the data table live on that product's `/products/<slug>` page (`lib/projects.ts`).

| # | Product | Status |
|---|---|---|
| 1 | Arogyam — practice management and patient engagement for outpatient clinics | operating |
| 2 | StreamLine — operations platform for manufacturers and trading businesses | operating |
| 3 | Ordio — ordering, kitchen and guest platform for restaurants and cafés | operating |

**3 Platform** — H2 `Built on one **foundation**.` (accent word in mono, carbon chapter). Intro: *Every Corsw product runs on the same engineering foundation. Work on security, reliability and performance reaches every product and every customer.* Pillars (`dl`, mono accent `dt` labels):
1. `Isolation` — Each customer's data is isolated in the database itself, with row-level security on every business table.
2. `History` — Critical records are append-only: audit logs, casepaper versions, stock movements and payments are added to, never overwritten.
3. `Money` — Amounts are stored in whole paise and recalculated on the server, never trusted from the screen.
4. `Identity` — Every customer runs under its own address, branding and settings, on a subdomain or its own domain.
5. `India-ready` — GST invoices, PF and ESI, English and Marathi, built into the products that need them.
6. `Operated` — Hosted and updated by Corsw. One release reaches every customer.

Beside the pillars, the `platform` system diagram (`lib/diagrams.ts`) assembles as evidence.

**4 Engineering** — H2 `Custom platforms. Same **standards**.` (accent word in mono).
- When no product fits, Corsw designs and builds the platform, then hosts and runs it the way it runs its own products.
- From the first workshop to production support, one team owns the outcome.
- Services list: `Product design` · `Engineering` · `Hosting and operations` · `Ongoing support`.
- Selected engagement card (`kind: "engagement"`): the capture, the name, the status badge, the tagline and `Read the engagement →`.

| # | Engagement | Status |
|---|---|---|
| 1 | SSC — B2B catalogue and quoting for a wholesale distributor | in build |

**5 Company** — Rows: Company · Corner Software (Corsw); Founded · 2024; Based · India; Products · Arogyam · StreamLine · Ordio; Industries · Healthcare · Manufacturing · Trading · Food service · Distribution; Services · Product engineering · Hosting and operations · Support.

**6 Contact** — H2 `Start a **conversation**.`
- (lead) See a platform running against your own workflow, or scope one Corsw builds for you.
- Share what you run today and where it slows you down. The reply sets out what the platform covers, the timeline and the cost.
- `Request a demo →` (large, weight-shifts on hover, mailto, subject "Demo request") · `Start a project →` (mailto, subject "New project") · the email address.

**Footer** — `Corner Software` · `© 2024–2026`.

**Product and engagement pages (`/products/<slug>`, `/engineering/<slug>`, `components/work/ProjectPage.tsx`)** — Hero: the project's ordinal and sector (`BUILT FOR` on products, `SECTOR` on the engagement), its status badge, the name as H1, the tagline, the capture. **What it solves** (products) / **The engagement** (the engagement) — two paragraphs from `lib/projects.ts` (`business`): what the business runs into, then what Corsw's software does about it. **In use** — H2 `How it *runs*.` — 3–4 walkthrough steps (`lib/projects.ts` `walkthrough`), each a caption beside the screen it describes. **Architecture** — H2 `How it is **built**.` — that project's system diagram and its data table (`lib/projects.ts` `table`), plus `Request a demo →` on operating products only. **Next product** (products, cycles the product list) / **All products** (the engagement, links to `/#products`) — the next item's name and tagline, linking on. Tagline, description, business copy, table and walkthrough captions for every product and the engagement are set once in `lib/projects.ts`:
- **Arogyam** (operating) — `Practice management and patient engagement for outpatient clinics.`
- **StreamLine** (operating) — `Operations platform for manufacturers and trading businesses.`
- **Ordio** (operating) — `Ordering, kitchen and guest platform for restaurants and cafés.`
- **SSC** (engagement, in build) — `B2B catalogue and quoting for a wholesale distributor.`

**404** — `Not found`; H1 `Nothing at this *corner*.`; `Back to Corner Software →`.

**/demo** — eyebrow `Corner Software · Demo`; H1 `Platforms in *service*.`; `Ask for a demo →`; `Everything Corsw builds →`; `See one running.` / *A walk through a live tenant: the operator's screens, not slides. Name the platform in the subject line, or describe what you would like built.*

**Site-wide** — Bar CTA `Request a demo →` (mailto, subject "Demo request"). Page title `Corner Software · Industry platforms, built and run.`. Metadata description `Corner Software (Corsw) builds and operates industry platforms for healthcare practices, manufacturers and restaurants, and engineers custom platforms to the same standards. Founded 2024, based in India.`. Share description `Industry platforms, built and run. Arogyam · StreamLine · Ordio.`. OG image: H1 unchanged; subline `Industry platforms, built and run by Corner Software.`. JSON-LD: home `Organization` (founder with sameAs GitHub, email) + `ItemList` of the products on `/`; each product page carries its own `SoftwareApplication`, the engagement page a `CreativeWork`. No `legalName`.

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
- Any capability on the PRODUCT.md Not claimable list.

**Always**
- All three chapters, phone and reduced motion checked for every change; contrast ≥ 4.5:1 for text under 18px.
- `tabular-nums` on tables, `text-balance` on headings, `aria-hidden` on decorative ordinals, marks and arrows.
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before calling anything done.

## 6. Changing the project list

1. Edit `lib/projects.ts` (set `kind: "product"` or `"engagement"`; add a schematic in `lib/diagrams.ts` if new).
2. Update the Company rows in `components/home/Contact.tsx`, the Statement follow-up and the metadata descriptions if a product or industry changes.
3. `/demo` lists `operating` projects automatically.
