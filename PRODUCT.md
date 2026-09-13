# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- People deciding whether to trust software built by Corsw: clinic owners, small manufacturers, café owners, distributors. They arrive from a project subdomain, a shared link, or an unassigned `*.corsw.in` address, and want to know who builds it and whether it runs. *(inferred from repository evidence; confirmed indirectly by the owner's choice of a demo-led site, 2026-09-13)*
- Peers and prospective clients judging the builder's work.

## Product Purpose

corsw.in is the one public home of Corner Software (Corsw). It shows the four projects Corsw builds and runs, the architecture each one actually runs on, and one way to get in touch. Success: a visitor understands within a minute that one person builds and operates these systems, sees a live one, and writes for a demo.

## Positioning

Every project on the page runs in production or is on its way there, and is built and operated by the same person. The system diagrams are the architecture as deployed, not illustration.

## Operating Context

- Unassigned `*.corsw.in` subdomains land on `/demo`. Project subdomains are separate deployments: `stream.corsw.in`, `ordio.corsw.in` (+ `*.ordio.corsw.in`), `drtanvis.corsw.in`, `ssc.corsw.in`, `lokey.corsw.in`, `modlio.corsw.in`, `scenestudio.corsw.in`.
- Contact is email only. No forms, no accounts, no pricing.
- Visitors can switch between two visual themes; the choice persists per browser.

## Capabilities and Constraints

- Next.js 16.2.4 (App Router, `proxy.ts`), React 19.2.4, Tailwind CSS 4, framer-motion 12. No other runtime dependencies.
- Projects on the site (owner decision, 2026-09-13): **Arogyam** (operating), **StreamLine** (operating), **Ordio** (operating; PhonePe merchant KYC pending), **SSC** (in build; phone, WhatsApp and licence placeholders are pre-launch blockers).
- Not listed on corsw.in, by owner decision: Lokey, Queue, Budgety, Second Brain.
- Archive sites stay up unchanged: `modlio.corsw.in`, `scenestudio.corsw.in`.

## Brand Commitments

- Name: Corner Software · Corsw. Line kept from the original site: "Software at every corner."
- One person: Pradyumna Tanksali. No "Pvt. Ltd.", no team language, no investor claims.
- Contact address everywhere: `tanksalipradyumna@gmail.com`.
- The owner likes both incumbent looks and keeps both as switchable themes: corsw's editorial world (warm off-black, bone ink, vermillion, EB Garamond italic) and Modlio's engineered world (carbon, cool ink, electric blue, mono numerals). Modlio's schematic system diagrams are drawn in both themes.
- Voice: institutional. Short sentences, periods over commas. No exclamation marks, no emoji, no Hinglish. Never "transform", "innovative", "cutting-edge", "world-class", "next-generation".
- Square corners. No gradients. No icon library; arrows are `→`. No contact form.

## Evidence on Hand

- Live: `drtanvis.corsw.in/en` (Arogyam tenant, Dr. Tanvi Chavan, Solapur), `stream.corsw.in`, `ordio.corsw.in` with `sipsnbites.ordio.corsw.in`, `ssc.corsw.in`.
- Published figures carried over: Arogyam 1 active tenant and 12 in pipeline; Ordio 1 café; SSC 41 product lines, 12 brands, 18 cities.
- Absent, never to be fabricated: uptime measurements, testimonials, customer logos, revenue, team size above one.

## Product Principles

1. State what runs and who runs it. Nothing larger.
2. Show the architecture instead of adjectives.
3. One company, one contact.
4. Fewer projects, finished properly.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥ 4.5:1 (≥ 3:1 at 18px+) in both themes, full keyboard use of the theme toggle, `prefers-reduced-motion` honoured, diagrams carry `<title>`/`<desc>`.
