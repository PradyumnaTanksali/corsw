# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Businesses looking for software they will depend on every day: clinics, manufacturers, cafés and restaurants, distributors. They arrive from a product subdomain, a shared link, or an unassigned `*.corsw.in` address, and want to know what Corsw builds and whether it runs.
- Prospective clients deciding whether to start a project with Corsw. Corsw is actively taking on new clients and plans to expand (owner, 2026-09-13).

## Product Purpose

corsw.in is the public home of Corner Software (Corsw). It shows selected work, how each system is put together, and two ways forward: start a project or see a platform running. Success: a visitor understands what Corsw builds and operates, and writes to start a project or ask for a demo.

## Positioning

Corsw designs, builds and then operates the software — hosting, updates and support stay with Corsw after launch. The system diagrams are the architecture as deployed, not illustration.

## Operating Context

- Unassigned `*.corsw.in` subdomains land on `/demo`. Product subdomains are separate deployments: `stream.corsw.in`, `ordio.corsw.in` (+ `*.ordio.corsw.in`), `drtanvis.corsw.in`, `ssc.corsw.in`, `lokey.corsw.in`, `modlio.corsw.in`, `scenestudio.corsw.in`.
- Contact is email only. No forms, no accounts, no pricing.
- Visitors can switch between two visual themes; the choice persists per browser.

## Capabilities and Constraints

- Next.js 16.2.4 (App Router, `proxy.ts`), React 19.2.4, Tailwind CSS 4, framer-motion 12. No other runtime dependencies.
- Work on the site (owner decision, 2026-09-13): **Arogyam** (operating), **StreamLine** (operating), **Ordio** (operating; PhonePe merchant KYC pending, so card copy does not claim live payments), **SSC** (in build; pre-launch placeholders). The list grows as client work ships.
- Not listed on corsw.in, by owner decision: Lokey, Queue, Budgety, Second Brain.
- Archive sites stay up: `modlio.corsw.in`, `scenestudio.corsw.in`. Products credit Corsw, not Modlio.

## Brand Commitments

- Name: Corner Software · Corsw. "Software at every corner."
- Founded by Pradyumna Tanksali. The site states no headcount (owner: don't say "People: 1"), no "Pvt. Ltd.", no team or investor claims.
- Tone is professional (owner, 2026-09-13): no self-deprecating or cute framing, no "this is just the start" copy, no dates, issues or version strings, no project counts in prose.
- Contact address everywhere: `hello@corsw.in`. External links are removed; the email and `/demo` are the ways out.
- The owner keeps both incumbent looks as switchable themes: corsw's editorial world (warm off-black, bone ink, vermillion, EB Garamond italic) and Modlio's engineered world (carbon, cool ink, electric blue, mono numerals). Modlio's schematic system diagrams are drawn in both themes.
- Voice: short sentences, periods over commas. No exclamation marks, no emoji, no Hinglish. Never "transform", "innovative", "cutting-edge", "world-class", "next-generation".
- Square corners. No gradients. No icon library; arrows are `→`. No contact form.

## Evidence on Hand

- Live: `drtanvis.corsw.in/en` (Arogyam tenant), `stream.corsw.in`, `ordio.corsw.in` with `sipsnbites.ordio.corsw.in`, `ssc.corsw.in`.
- Verified product capabilities are in `/Users/apple/Personal/PROJECTS.md` (2026-09-03).
- Absent, never to be fabricated: uptime measurements, testimonials, customer logos, revenue, compliance certification.

## Product Principles

1. Say what the software does and for whom, plainly.
2. Show the architecture instead of adjectives.
3. One company, one contact.
4. Every project designed, built and run properly.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥ 4.5:1 (≥ 3:1 at 18px+) in both themes, full keyboard use with a visible focus outline, `prefers-reduced-motion` honoured, diagrams carry `<title>`/`<desc>`.
