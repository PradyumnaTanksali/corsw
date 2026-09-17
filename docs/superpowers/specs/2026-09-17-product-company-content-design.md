# corsw.in product-company content — design

Status: approved in brainstorming, 2026-09-17. Branch `redesign/scroll` (builds on `2026-09-16-scroll-redesign-design.md`; visual design unchanged).

## Goal

Rewrite corsw.in's content so Corner Software reads as a professional software company with product lines and an engineering practice, not a studio with four projects. Products are described at the scope of the market they are built for, not the customers they serve today. Every capability named is shipped in code.

## Decisions

| Topic | Decision |
|---|---|
| Positioning | Platform + engineering: a shared engineering foundation, the products built on it, and an engineering practice that builds custom platforms to the same standards |
| Products | Arogyam, StreamLine, Ordio |
| SSC | An engineering engagement, not a product |
| Claims | Shipped capabilities only, at market scope. No roadmap on the site |
| Other projects | Lokey, Queue, Budgety, Second Brain stay off the site |
| Structure | Platform-first home; `/products/<slug>` and `/engineering/<slug>` pages |
| Final review (2026-09-17) | money pillar, standards wording, platform/product terminology, Engineering wording, /demo copy and engagement CTA revised; owner approved. |

## Voice

- Professional and confident. Name the job the software does and who it is for. Outcomes over adjectives.
- The company is the subject ("Corner Software builds…", "Corsw…"), never "we".
- Market-level scope ("outpatient clinics", not "a physiotherapist"); capabilities as shipped.
- Unchanged rules: no counts in prose, no fabricated numbers, logos or testimonials, no exclamation marks or emoji, no external links. Banned words: transform, innovative, cutting-edge, world-class, next-generation, leading, best-in-class, seamless.

## Not claimable (verified against the product repos, 2026-09-17)

- Arogyam: WhatsApp messaging or automation (production provider is a mock), ABDM/ABHA integration, AI or RAG assistant, desktop app, Hindi, India data residency or DPDP compliance, payments or billing, multi-doctor scheduling, multi-location.
- StreamLine: self-serve signup or subscription billing, POS or retail, multi-warehouse, TDS as current or certified, leave or TDS on by default, general notifications.
- Ordio: payments being live (PhonePe and Razorpay are not processing), chains or multi-outlet, delivery or takeaway flows, reservations, loyalty, inventory.
- All: customer counts, testimonials, uptime, benchmarks, certifications.

## Home `/`

Chapter order: Hero (bone) → Statement (bone) → Products (ink, pinned) → Platform (carbon) → Engineering (carbon) → Company and Contact (carbon) → Footer.

### Hero
- Eyebrow: `Est. 2024 · India`
- H1: `Software at every *corner*.`
- Subline: `Industry platforms for healthcare, manufacturing and food service. Built, hosted and **run** by Corner Software.`
- Actions: `Request a demo →` (mailto, subject "Demo request") · `Build with Corsw →` (in-page link to `#engineering`)

### Statement (was Foundation)
- Folio label: `Overview` (folio numbering on home: 1 Overview, 2 Products, 3 Platform, 4 Engineering, 5 Company, 6 Contact)
- Lead (scrub-lit): `Every business runs on a handful of systems it cannot afford to lose: the front desk, the order book, the kitchen ticket. Corner Software builds those systems as platforms, operates them, and improves them for every customer at once.`
- Follow-up: `Arogyam, StreamLine and Ordio serve healthcare, manufacturing and food service. The same engineering practice builds custom platforms for businesses no product fits.`
- Marquee: `Healthcare practices · Manufacturing · Trading · Restaurants and cafés · Wholesale distribution`

### Products (was Work)
- Folio label: `Products`
- H2: `Built for whole *industries*.`
- Intro: `Each product is designed around how an industry works, then configured for every business that runs on it.`
- One pinned item per product (kind `product`): capture, name, status, tagline, `Explore <Name> →` to `/products/<slug>`.

### Platform (was Approach)
- Folio label: `Platform`
- H2: `Built to one *standard*.` (accent word in mono, carbon chapter)
- Intro: `Every Corsw product is built to the same engineering standards and runs as one hosted platform. An improvement ships once and reaches every customer of that product.`
- Pillars (label · copy):
  1. `Isolation` · `Each customer's data is isolated in the database itself, with row-level security on every business table.`
  2. `History` · `Critical records are append-only: audit logs, casepaper versions, stock movements and invoice payments are added to, never overwritten.`
  3. `Money` · `Amounts are calculated in whole paise on the server, never trusted from the screen.`
  4. `Identity` · `Every customer runs under its own address, branding and settings, on a subdomain or its own domain.`
  5. `India-ready` · `GST invoices, PF and ESI, English and Marathi, built into the products that need them.`
  6. `Operated` · `Hosted and updated by Corsw. One release reaches every customer.`
- Diagram: the `platform` schematic (below), caption `System diagram` · `Platform`.

### Engineering (new)
- Anchor id: `engineering`
- Folio label: `Engineering`
- H2: `Custom software. Same *standards*.` (accent word in mono)
- Copy: `When no product fits, Corsw designs and builds the software, then hosts and runs it the way it runs its own products.` / `From the first scoping call to production support, Corsw owns the outcome.`
- Services list: `Product design` · `Engineering` · `Hosting and operations` · `Ongoing support`, then `Start a project →` (mailto, subject "New project").
- Label `Engagement`, then a card (kind `engagement`): name `SSC`, status `In build`, tagline, `Read the engagement →` to `/engineering/ssc` (screen readers hear the engagement's name after "Read the engagement").

### Company
- Rows: `Company` Corner Software (Corsw) · `Founded` 2024 · `Based` India · `Products` Arogyam · StreamLine · Ordio · `Industries` Healthcare · Manufacturing · Trading · Food service · Distribution · `Services` Product design · Engineering · Hosting and operations · Ongoing support

### Contact
- Folio label: `Contact`
- H2: `Start a *conversation*.`
- Lead: `See a product running, or scope software Corsw builds for you.`
- Follow-up: `Share what you run today and where it slows you down. The reply sets out what Corsw would build, the timeline and the cost.`
- Actions: large `Request a demo →` (mailto, subject "Demo request") · `Start a project →` (mailto, subject "New project") · `hello@corsw.in`

### Site-wide
- Bar CTA: `Request a demo →` (mailto, subject "Demo request").
- Page title: `Corner Software · Industry platforms, built and run.`
- Metadata description: `Corner Software (Corsw) builds and operates industry platforms for healthcare practices, manufacturers and restaurants, and engineers custom platforms to the same standards. Founded 2024, based in India.`
- Share description: `Industry platforms, built and run. Arogyam · StreamLine · Ordio.`
- OG image: H1 unchanged; subline `Industry platforms, built and run by Corner Software.`

## Product and engagement pages

Routes: `/products/[slug]` renders kind `product` (arogyam, streamline, ordio); `/engineering/[slug]` renders kind `engagement` (ssc). `/work/[slug]` is removed (never deployed). Both use the existing page sections; labels differ by kind:

| Section | Product | Engagement |
|---|---|---|
| 1 | `What it solves` | `The engagement` |
| 2 | `In use` (H2 `How it *runs*.`) | same |
| 3 | `Architecture` (H2 `How it is **built**.`) | same |
| Next | `Next product →` (cycles products) | `All products →` to `/#products` |
| Demo button | `Request a demo →` on operating products | `Start a project →` |

Metadata per page: title `<Name> · Corner Software`, description = tagline, canonical, Open Graph and Twitter with the page URL. JSON-LD: products `SoftwareApplication` (`name`, `description`, `applicationCategory: "BusinessApplication"`, `operatingSystem: "Web"`, `url`, `publisher` → organization id; no offers, no ratings); engagement `CreativeWork` (`creator` → organization id).

### Arogyam (product, operating)
- Tagline: `Practice management and patient engagement for outpatient clinics.`
- Description: `Arogyam runs the clinical and front-desk work of a practice: scheduling, patient records, versioned casepapers, intake questionnaires and home-recovery programmes. Patients reach the practice through a private portal, in English or Marathi.` / `Every practice gets its own website and domain, with consent records and an append-only audit trail from the first visit.`
- What it solves: `A practice runs on appointments, clinical notes and the care patients continue at home. Kept in diaries, paper files and chat threads, none of it can be searched, audited or followed up.` / `Arogyam keeps the practice in one system, from the first booking to the last session of a recovery programme.`
- Table: `BUILT FOR` Physiotherapy · Rehabilitation · Outpatient clinics · `MODULES` Scheduling · Patient records · Casepapers · Questionnaires and triage · Recovery programmes · Patient portal · Practice website · `LANGUAGES` English · Marathi · `DELIVERY` Multi-tenant · Custom domains
- In use: (laptop) `Appointments by agenda, week or month, confirmed from the front desk.` · (laptop) `A pre-visit link collects consent, and triage answers are flagged before the visit.` · (laptop) `An exercise library in English and Marathi, ready to build into home programmes.` · (laptop) `Triage questionnaires come built in, in English and Marathi, and practices can write their own.`

### StreamLine (product, operating)
- Tagline: `Operations platform for manufacturers and trading businesses.`
- Description: `StreamLine runs the order from quotation to dispatch: sales, purchasing, inventory, production and payroll on one set of records.` / `Each company works in an isolated workspace with its own roles, audit log and a public website that routes enquiries to sales.`
- What it solves: `A manufacturer's margin is decided between the quotation and the dispatch note: a revised price, a late purchase order, stock no one counted.` / `StreamLine records every step of the order, so sales, stores, production and payroll work from the same numbers.`
- Table: `BUILT FOR` Make-to-order manufacturing · Fabrication · Trading · `MODULES` Quotations · Invoicing · Purchasing · Inventory · Production · Payroll · Company website · `CONTROLS` Roles · Audit log · Module access per company · `DELIVERY` Multi-tenant · Installable app
- In use: (laptop) `The month at a glance: sales, open quotes, production, payroll and low stock.` · (laptop) `Quotations move from draft to sent, accepted and converted, with every revision kept.` · (laptop) `Attendance records only the exceptions, and absences flow into payroll as loss of pay.` · (laptop) `Each company's public site sends order enquiries straight to the team.`

### Ordio (product, operating)
- Tagline: `Ordering, kitchen and guest platform for restaurants and cafés.`
- Description: `Guests order from the table on their own phone, with no app and no sign-in. Orders reach a kitchen display and thermal printer, and guests follow their ticket to the table.` / `Owners run menus, offers, tables, staff and analytics from one dashboard, with GST invoices and a branded website for each restaurant.`
- What it solves: `Service at a busy restaurant is limited by the counter: guests wait to order, and tickets reach the kitchen by hand.` / `Ordio moves ordering to the guest's phone and every ticket onto the kitchen display, so the floor team serves instead of taking orders.`
- Table: `BUILT FOR` Restaurants · Cafés · Quick service · `MODULES` QR ordering · Kitchen display · Order tracking · GST invoices · Offers and coupons · Analytics · Outlet website · Display board · `ROLES` Owner · Kitchen · Server · Staff · `DELIVERY` Multi-tenant · Installable app
- In use: (phone) `Guests open the menu from the table's code. No app, no sign-in.` · (phone) `Sizes, extras and a note for the kitchen on every item.` · (laptop) `Tables are laid out on a floor plan, each with its own printable QR code.` · (laptop) `The daily summary shows orders by hour, item velocity and takings by table.`

### SSC (engagement, in build)
- Tagline: `B2B catalogue and quoting for a wholesale distributor.`
- Description: `A product catalogue buyers search by name, brand or use, with faceted filters by category and form.` / `A quote request starts with the product filled in and reaches the sales desk by email or WhatsApp.`
- The engagement: `A wholesale distributor needed buyers to find products and ask for rates without a phone call for every line.` / `Corsw designed and built a catalogue and quoting site, with enquiries validated on the server and no lead dropped silently.`
- Table: `SECTOR` Wholesale distribution · `SCOPE` Catalogue · Search and filters · Quote requests · WhatsApp handoff · `DELIVERY` Website · Installable app
- In use: unchanged from the current SSC captions and captures.

## Diagrams (`lib/diagrams.ts`)

Every box must exist in shipped code. The existing diagram tests apply to all schematics.

- `platform` (new): clients `Staff apps` (web) and `Customer surfaces` (portals · sites · QR); core `Tenant-scoped server` (org context per request); direct `Postgres` (row-level security), `Append-only records` (audit · ledgers · versions), `Documents` (PDF · invoices) and `Email` (sign-in · documents, sent directly from the server). Annotations: `one tenant per subdomain or domain`, `money calculated in paise`, `nothing overwritten`.
- `arogyam` (rebuilt): clients `Clinic staff` (web) and `Patient portal` (private link); core `Server` (tenant-scoped); direct `Postgres` (RLS per practice), `Audit log` (append-only), `Casepaper PDFs` (English · Marathi), `Practice site` (block renderer); second-hand `Email sign-in` (one-time code) via Server. Annotations: `each practice on its own domain`, `casepapers never overwritten`, `consent tied to policy version`.
- `ordio` (corrected): remove the `PhonePe` box and its connectors and the `no ticket before payment` annotation; add `Kitchen printer` (thermal KOT) reached from the kitchen display path; keep receipts and WhatsApp/SMS share links. Boxes renamed from café to outlet scope (`RLS per outlet`, `one outlet per subdomain`) since a tenant may run more than one physical café or restaurant. Annotation replacing the payment note: `tickets print on the kitchen line`.
- `streamline`, `ssc`: unchanged, except `streamline`'s money annotation reads `money calculated in paise` (it stores `numeric(12,2)` and calculates in paise).

## Documents

- `PRODUCT.md`: Product Purpose and Positioning rewritten to the platform + engineering positioning; Capabilities lists products (kind product) and engagements; the Not claimable list above added to Evidence on Hand.
- `BRIEF.md`: §1 positioning and one-line, §2 information architecture, §4 copy bank rewritten to this spec; banned-word list extended.
- `DESIGN.md`: section names (Statement, Products, Platform, Engineering) and routes.
- `CLAUDE.md`: What this is.

## Checks

- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green.
- `lib/projects.test.mjs`: every entry has `kind` of `product` or `engagement`; slugs unique; the banned-word regex covers the extended list; existing capture and LAUNCH checks unchanged.
- One screenshot pass, desktop 1440×900 and phone 390×844, on `/`, one product page and `/engineering/ssc`: the longer taglines fit the pinned Products stage and page heroes without clipping.

## Captures (2026-09-17)

Owner-supplied screenshots replace the placeholders for Arogyam, StreamLine and Ordio. `scripts/crop-captures.mjs` crops them to the app and covers client names, contact details, personal names and takings. Payment screens are not used. The walkthrough captions above describe the screens shown (owner approved).

## Out of scope

Visual design changes, roadmap content, pricing, other products.
