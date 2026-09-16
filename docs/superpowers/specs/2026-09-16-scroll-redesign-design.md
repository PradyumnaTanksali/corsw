# corsw.in scroll redesign — design

Status: approved in brainstorming, 2026-09-16. Branch `redesign/scroll`.

## Goal

Replace corsw.in's quiet editorial site with a scroll-driven, award-grade site that proves Corsw's craft, without changing what the site claims. Reference sites studied: numa.uprock.pro, format.obys.agency, havu.cc, weevolveit.com, indisea.com. None use WebGL; the look comes from GSAP + ScrollTrigger, Lenis smooth scroll, masked text reveals, pinned/scrubbed sections and one or two canvas moments. havu.cc and weevolveit.com run on Next.js 16 + Vercel, the same stack as corsw.

## Decisions

| Topic | Decision |
|---|---|
| Scope | Full redesign of corsw.in (not a side page) |
| Themes | One identity. The Paper/Schematic toggle is removed; both looks survive as scroll chapters |
| Visuals | Real product captures (seeded demo data) plus animated system diagrams |
| Pages | Home + `/work/[slug]` case studies (4) + restyled `/demo` and 404 |
| Chapter order | B (bone paper) → A (ink) → C (blueprint) |
| Grotesk | Schibsted Grotesk, variable 400–900, weight contrast and scroll-driven weight shifts |
| Stack | `gsap` (ScrollTrigger, SplitText) + `@gsap/react` + `lenis`; `framer-motion` removed |

## Rules

### Kept (truth, from PRODUCT.md / BRIEF.md)

- No fabricated numbers, testimonials, logos, uptime or compliance claims.
- No headcount, team, investor or "just getting started" language. Tone rules and banned words unchanged.
- `hello@corsw.in` is the only contact. No contact form.
- No external links. Case studies offer `Ask for a demo →` by email, never a live product link.
- Projects: Arogyam, StreamLine, Ordio (operating), SSC (in build). No tenant or client names on the site or in captures.
- No counts in prose (tables only), no dates, issues or version strings in visible copy.
- `/demo`, `proxy.ts`, `lib/host.ts` and `lib/host.test.mjs` unchanged in behavior.
- JSON-LD Organization/WebSite/ItemList kept; WCAG 2.2 AA.

### Replaced (visual law; DESIGN.md is rewritten)

- Theme toggle and `localStorage["corsw-theme"]` removed.
- The 8px reveal cap is lifted. Motion is the point; it stays purposeful and eased.
- Bold is allowed: Schibsted weights 400–900.
- A thin fixed bar replaces "no sticky header": wordmark left (links home), `Start a project →` right. Still no nav menu or hamburger.
- Kept: square corners, no shadows or glows, no icon library (arrows are `→`), no gradients except the bone column grid and the carbon dot grid.

## Identity

### Chapter tokens

Every component reads `--ground`, `--ink`, `--ink-muted`, `--ink-faint`, `--rule`, `--accent`. A chapter sets these values; components never know which chapter they are in.

| Token | B · bone | A · ink | C · carbon |
|---|---|---|---|
| `--ground` | `#ece6da` | `#0e0e0e` | `#0a0b0f` |
| `--ink` | `#141310` | `#f5f1e8` | `#e8eaed` |
| `--ink-muted` | `#45423c` | `#a8a39a` | `#9ca3af` |
| `--ink-faint` | `#65615a` (4.95) | `#847f76` (4.85) | `#767d8c` |
| `--rule` | `#1413102e` | `#2a2825` | `#1f2228` |
| `--accent` | `#b83a22` (4.61) | `#d7543d` (4.80) | `#d7543d` (4.89) |
| texture | 12-column hairline grid | none | 22px dot grid |

Measured contrast (text on ground): ink on bone 14.95, muted on bone 8.06, muted on ink 7.69, faint on ink 4.85, muted on carbon 7.75. Any token change is re-measured.

### Type

- Schibsted Grotesk (variable `wght` 400–900, `next/font/google`): headlines, body, UI.
- EB Garamond italic 400: accent words and the bone hero display.
- JetBrains Mono 400/500: facts, labels, tables, diagrams, the bar.
- Emphasis is a face swap (Garamond italic) or a weight jump, never a plain italic.

## Pages

### Home `/`

1. **Hero · B.** Bone ground and column grid. The corner mark stamps in (scale from top-left). H1 `Software at every corner.` in Garamond italic display, lines rising out of masks (SplitText lines + mask). Subline `Corner Software builds software, and runs it.`, `Start a project →`. On scroll the headline lifts and fades while the chapter scrubs bone → ink. Server-rendered; no preloader.
2. **Foundation · B→A.** Lead paragraph from the copy bank; line opacity scrubs from faint to ink as it crosses the viewport. Sector marquee (Healthcare · Manufacturing · Food service · Distribution) whose speed follows scroll velocity.
3. **Work · A.** Desktop: the section pins; the four projects play in sequence. Per project: the capture opens from an inset window to full width (`clip-path: inset()` scrub + counter-scale), the project name's weight scrubs 400 → 800, an i–iv rail marks progress, tagline and status appear. Each project links to `/work/[slug]`; the capture shares a view-transition name with the case study hero.
4. **How it's built · C.** Chapter scrubs ink → carbon, dot grid fades in. One system diagram (Ordio) assembles: boxes fade up, connectors draw with scroll, then traffic pulses run along connectors. The four Approach principles sit beside it as numbered notes.
5. **Company + Contact · C.** Company rows as a mono spec sheet (Company, Founded, Based, Sectors, Services). H2 `Start a *project*.`, the two contact paragraphs, a large `Start a project →` mailto whose weight shifts on hover, `See a platform running →` (`/demo`), the email. Footer: `Corner Software` · `© 2024–2026`.

### Case study `/work/[slug]`

Static (`generateStaticParams` over `lib/projects.ts`), own metadata and canonical, `CreativeWork` JSON-LD.

1. **Hero · A.** Ordinal, name, status, tagline; the capture (shared view-transition element from home).
2. **The business · B.** What the customer runs and where it slowed down; two short paragraphs drafted from verified PROJECTS.md facts, owner-reviewed.
3. **Walkthrough · A.** A device frame (phone or laptop) sticks while its screen swaps through 3–4 steps with captions. Example Ordio: scan the table QR → order → kitchen display → invoice.
4. **Architecture · C.** That project's diagram assembles with traffic pulses; the SECTOR / MODULES / DELIVERY table beside it.
5. **Next · A.** Next project's name large, linking on; `Ask for a demo →` on operating projects only.

### `/demo` and 404

Restyled in the A chapter with reveal-only motion; content and noindex behavior unchanged.

## Architecture

- **Dependencies:** add `gsap`, `@gsap/react`, `lenis`; remove `framer-motion`.
- **`lib/gsap.ts`** (client): registers ScrollTrigger, SplitText and `useGSAP`; `ScrollTrigger.config({ ignoreMobileResize: true })`.
- **`SmoothScroll`** (client, in root layout): Lenis driven by `gsap.ticker` (`lenis.raf(time * 1000)`), `gsap.ticker.lagSmoothing(0)`, `lenis.on("scroll", ScrollTrigger.update)`, no `autoRaf`. Disabled under `prefers-reduced-motion` and on `(pointer: coarse)`. Scrolls to top immediately on pathname change.
- **`Chapter`** (client): wraps a section with `tone="bone" | "ink" | "carbon"`. A ScrollTrigger scrubs the token custom properties on `<html>` from the previous tone to this one as the section enters. Server default is the first chapter's tone so the first paint is correct.
- **`SplitReveal`** (client): SplitText `type: "lines"`, `mask: "lines"`, `autoSplit`, run after `document.fonts.ready`; SplitText's aria handling keeps the full text readable.
- **Motion gate:** content is visible without JS. A pre-paint inline script adds `html.motion-ok` when reduced motion is not requested; initial hidden states in CSS apply only under `.motion-ok`.
- **Cleanup:** every animation lives in `useGSAP({ scope })`; branches through `gsap.matchMedia()` (`(min-width: 768px) and (prefers-reduced-motion: no-preference)` for pins/scrubs).
- **Diagrams:** schematic data moves from `components/primitives/SystemDiagram.tsx` to `lib/diagrams.ts` (boxes, connectors, annotations, mobile clients unchanged). `components/Diagram.tsx` renders the SVG and the mobile stack; draw is scroll-linked; pulses are CSS `offset-path` animations paused when off screen.
- **Data:** `lib/projects.ts` gains `slug`, `business: string[]`, `walkthrough: { src: string; alt: string; caption: string; device: "phone" | "laptop" }[]`, `capture: { src: string; alt: string }`.
- **View transitions:** `experimental.viewTransition: true` in `next.config.ts` (Next 16.2.4 vendored React exports `ViewTransition`). Shared name `capture-<slug>`. Unsupported browsers navigate instantly.
- **Server Components by default**; client components only where motion needs hooks.
- **Deleted:** `ThemeToggle`, `MotionProvider`, `lib/motion.ts`, `AccentLine`, the theme boot script, old section components and primitives with no remaining use.
- **Kept:** `proxy.ts`, `lib/host.ts` + test, `Monogram`, `Wordmark`, `robots.ts`, `opengraph-image.tsx` (recolored to the new identity). `sitemap.ts` adds the four case studies.

## Assets

- Captures come **only** from local instances with seeded demo data (`db:seed` exists in ordio, streamline and healthcare/engine/arogyam/packages/db). Never from production: Arogyam production holds patient records and Ordio production holds a real tenant. SSC is a public catalogue; its live site may be captured.
- `scripts/capture.mjs`, run with `npx playwright` (not a dependency), shoots each step at 1440×900 desktop and 390×844 phone into `public/work/<slug>/`. `next/image` serves AVIF/WebP.
- v1 ships stills only. Video loops are deferred (need ffmpeg and weight budget).
- Until captures exist, each project uses a styled placeholder frame so the site builds and reviews end to end; launch is blocked on real captures.

## Quality

- **Performance (Lighthouse mobile on the Vercel preview):** LCP < 2.5s, CLS < 0.05, INP < 200ms, animation JS < 70KB gzip, below-fold images lazy.
- **Reduced motion:** no Lenis, no pins, no scrubs, no pulses; every element in its final visible state.
- **Keyboard and focus:** skip link; pinned sections never trap focus; 1px accent focus outline visible in every chapter.
- **Mobile (< 768px or coarse pointer):** full content; native scroll; pinned sequences become stacked sections with simple reveals; diagrams use the mobile stack.
- **Checks:** `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green; `lib/host.test.mjs` untouched; one new `node --test` check that every project has a slug, a diagram key, and capture paths that exist in `public/`.
- **Visual QA:** one batched round of desktop + mobile screenshots per page, normal and reduced motion; fix in one batch; at most one confirm round.

## Docs

Rewrite `DESIGN.md` (new identity, chapters, motion system), `CLAUDE.md` (rules, dependencies, never/always lists), `BRIEF.md` §2–§4 (IA, themes → chapters, copy bank incl. case-study copy), `PRODUCT.md` Capabilities (dependencies).

## Rollout

1. Build on `redesign/scroll`.
2. Push; review on the Vercel preview URL.
3. Owner approves case-study copy and captures.
4. Merge to `main` (production deploys from `main`). The current site stays live until then.

## Out of scope (v1)

Canvas/physics toy, video loops, custom cursor, preloader, i18n, CMS.
