# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Businesses looking for software they will depend on every day: clinics, manufacturers, cafés and restaurants, distributors. They arrive from a product subdomain, a shared link, or an unassigned `*.corsw.in` address, and want to know what Corsw builds and whether it runs.
- Businesses evaluating a Corsw product for their industry, or scoping a custom platform with Corsw. Corsw is actively taking on new clients and plans to expand (owner, 2026-09-13).

## Product Purpose

corsw.in is the public home of Corner Software (Corsw), a software company that builds and operates industry platforms (Arogyam, StreamLine, Ordio) on one engineering foundation, and engineers custom platforms to the same standards. Success: a visitor understands what each platform does and for which industry, and requests a demo or starts a project.

## Positioning

Corsw is a platform and engineering company. Its products are built for whole industries, not for the customers they serve today: Arogyam for outpatient clinics, StreamLine for manufacturers and trading businesses, Ordio for restaurants and cafés. Corsw hosts, updates and supports its products and the software it builds for clients. Product diagrams show each architecture as deployed; the platform diagram summarises what the products share.

## Operating Context

- Unassigned `*.corsw.in` subdomains land on `/demo`. Product subdomains are separate deployments: `stream.corsw.in`, `ordio.corsw.in` (+ `*.ordio.corsw.in`), `arogyam.corsw.in` (+ `*.arogyam.corsw.in`, one subdomain per clinic), `ssc.corsw.in`, `lokey.corsw.in`, `modlio.corsw.in`, `scenestudio.corsw.in`.
- Contact is email only. No forms, no accounts, no pricing.
- The site scrolls through three chapters (bone, ink, carbon); there is no theme toggle.

## Capabilities and Constraints

- Next.js 16.2.4 (App Router, proxy.ts), React 19.2.4, Tailwind CSS 4, GSAP 3.15 (ScrollTrigger, SplitText, MotionPath), Lenis. No other runtime dependencies.
- Products on the site: Arogyam, StreamLine, Ordio (all operating). Engineering engagements: SSC (in build; pre-launch placeholders). Product copy describes each product at market scope and names only shipped capabilities.
- Not listed on corsw.in, by owner decision: Lokey, Queue, Budgety, Second Brain.
- Archive sites stay up: `modlio.corsw.in`, `scenestudio.corsw.in`. Products credit Corsw, not Modlio.

## Brand Commitments

- Name: Corner Software · Corsw. "Software at every corner."
- Founded by Pradyumna Tanksali. The site states no headcount (owner: don't say "People: 1"), no "Pvt. Ltd.", no team or investor claims.
- Tone is professional (owner, 2026-09-13): no self-deprecating or cute framing, no "this is just the start" copy, no dates, issues or version strings, no project counts in prose.
- Contact address everywhere: `hello@corsw.in`. External links are removed. Ways out: the email (Request a demo, Start a project). /demo serves unassigned subdomains and is not linked from the home page.
- The two incumbent looks survive as scroll chapters: corsw's editorial world (bone and ink, vermillion, EB Garamond italic) and Modlio's engineered world (carbon, mono, schematic diagrams). The owner chose one identity over the toggle on 2026-09-16.
- Voice: short sentences, periods over commas. No exclamation marks, no emoji, no Hinglish. Never "transform", "innovative", "cutting-edge", "world-class", "next-generation", "leading", "best-in-class", "seamless".
- Square corners. No gradients except the column and dot grid textures. No icon library; arrows are `→`. No contact form.

## Evidence on Hand

- Live: `drtanvis.arogyam.corsw.in/en` (Arogyam clinic #1; `drtanvis.corsw.in` retired 2026-09-16), `stream.corsw.in`, `ordio.corsw.in` with `sipsnbites.ordio.corsw.in`, `ssc.corsw.in`.
- Verified product capabilities are in `/Users/apple/Personal/PROJECTS.md` (2026-09-03).
- Absent, never to be fabricated: uptime measurements, testimonials, customer logos, revenue, compliance certification.
- Product captures: SSC from its public site; Arogyam, StreamLine and Ordio only from local seeded demo data, pending.
- Not claimable (verified against the product repos, 2026-09-17):
  - Arogyam: WhatsApp messaging or automation (production provider is a mock), ABDM/ABHA integration, AI or RAG assistant, desktop app, Hindi, India data residency or DPDP compliance, payments or billing, multi-doctor scheduling, multi-location.
  - StreamLine: self-serve signup or subscription billing, POS or retail, multi-warehouse, TDS as current or certified, leave or TDS on by default, general notifications.
  - Ordio: payments being live (PhonePe and Razorpay are not processing), chains or multi-outlet, delivery or takeaway flows, reservations, loyalty, inventory.
  - All: customer counts, testimonials, uptime, benchmarks, certifications.

## Product Principles

1. Say what the software does and for whom, plainly.
2. Show the architecture instead of adjectives.
3. One company, one contact.
4. Every project designed, built and run properly.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥ 4.5:1 (≥ 3:1 at 18px+) in every chapter, full keyboard use with a visible focus outline, `prefers-reduced-motion` honoured, diagrams carry `<title>`/`<desc>`.
