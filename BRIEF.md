# CORSW — Site Brief

> A single-page, monolithic, architectural-feeling site for **Corner Software (Corsw)** — the parent holding company behind two product divisions: **Modlio** (enterprise) and **Scene** (indie). This site is **not** an agency landing page. It does not sell services. It does not have a cost calculator. It is a directory + manifesto for a studio-of-studios.

---

## 0. Read before you write any code

The current `corsw.in` is a generic agency template — cost calculator, "300% avg ROI," "happy clients" counters, six-step transformation journey. **All of it gets deleted.** That positioning is wrong for a parent company that only does in-house work and houses two product divisions. Don't carry over a single section.

The new positioning: **Corsw is the holding company. It builds nothing directly. It is the architecture under Modlio and Scene.**

This site sits in a **family of three**:
- **Corsw** (this site) — parent holding company. Positioning: institutional + architectural.
- **Modlio** — enterprise division at `modlio.corsw.in`. Positioning: engineered + technical.
- **Scene** — indie studio at `scene.corsw.in`. Positioning: warm + indie + Hinglish. Already deployed at `scene-studio-xi.vercel.app`. Reference only.

Corsw's job is to be **visually distinct from both** while feeling like the parent that contains them. The triangulation rules are in §3.7. **Re-read those rules every session before starting work.**

---

## 1. Brand

**Name:** Corner Software · `corsw`
**Etymology:** "Software at every corner" — keep this; it's the only line worth keeping from the old site.
**Positioning:** A holding company for software product divisions. Founded 2024. Operates from Hyderabad, Pune, Solapur. Does not take outside work.
**One-line:** *Corner Software builds software companies. Two so far.*

**The thesis:**
> *We don't sell hours. We don't pitch decks. We build product divisions and let them ship under their own names.*
> *Modlio handles enterprise. Scene handles indie. Corsw is the foundation under both.*

**Tone rules:**
- Institutional, not corporate. Think MIT Press, A24, Stripe Press — **not** McKinsey or PwC.
- Sentences are short. Periods over commas.
- No exclamation marks. No emojis. No Hinglish (that's Scene's voice — Corsw is the elder sibling).
- No metrics theatre. No "300% ROI." No "15+ happy clients." If something deserves a number, the number is small and unrounded.
- First-person plural ("we") sparingly. Third-person about the divisions ("Modlio ships", "Scene ships").
- The site reads like the company is older than it is.

---

## 2. Information architecture

**Single page. Nine sections, in order.** No nav menu. No multi-page deep links. The two divisions get their own subdomains (`modlio.corsw.in`, `scene.corsw.in`); this site is a one-shot statement.

```
1. Masthead          → identity + a single line
2. Foundation        → the thesis
3. Divisions         → Modlio + Scene as paired cards (the centerpiece)
4. Index             → numerical inventory (year founded, divisions, locations, projects)
5. Coordinates       → three cities as a layout, not a contact form
6. Manifesto         → 7 short principles
7. Provenance        → who built it, in plaintext
8. Ledger            → external links (GitHub org, email, the two divisions)
9. Colophon          → small print, signature, version
```

**Hard rule:** no contact form. The site has no input fields anywhere. Email link only.

---

## 3. Design system

### 3.1 The aesthetic in one sentence

**Architectural minimalism** — like a printed annual report rendered in HTML. Heavy use of horizontal rules, tabular lists, and serif numerals. The page should feel like a document that survived the move from print.

**Mood references** (study these, don't copy them):
- **Stripe Press book pages** — confident serif, generous margins, restrained color.
- **MIT Press** — institutional but warm, never cold.
- **Linear's documentation pages** (not their landing) — quiet density.
- **A24 production company page** — divisions listed without selling them.
- **Pentagram's own website** — mostly type, tiny color accents.
- **Brutalist Websites** archive — pick the *quiet* brutalists, not the loud ones.
- **Berghaus Books, Dia Art Foundation** — for the "this organization is older than it looks" feeling.

**Anti-references** (do not look like these):
- Vercel, Linear's marketing, every YC startup site — too animated, too gradient.
- Anthropic (this is Scene's lane).
- McKinsey, Accenture, Tata Consulting — too corporate.
- Awwwards-style brutalism — too noisy.

### 3.2 Visual system

**Background:** Off-black `#0E0E0E`. Slight warmth, not pure black. The site is dark by default. Light mode is optional Phase 2.

**Ink:** Bone `#F5F1E8`. Off-white with paper warmth. Same warmth-temperature as Scene's bg, intentionally — it's the only token they share.

**Accent:** A single restrained accent. **Vermillion `#D4452C`** — the color of an editor's red pen, used exclusively for:
- A single rule under the masthead.
- The numeral prefix on each manifesto principle (`01.` `02.` `03.`).
- One word in each section heading, called out (e.g., *"Two divisions, one **architecture**."*).
- The hover state on outbound links.

That's it. Nowhere else. Vermillion is rationed.

**Mid-grays for hierarchy:**
- `--ink:        #F5F1E8`
- `--ink-muted:  #A8A39A`
- `--ink-faint:  #5C5852`
- `--ink-rule:   #2A2825`  (hairline borders)
- `--bg:         #0E0E0E`
- `--bg-card:    #161513`
- `--accent:     #D4452C`

### 3.3 Typography

**Display + body:** **Inter** for sans (free, via `next/font`). Söhne would be slightly better but isn't worth the licensing spend until revenue justifies it.

**Serif for numerals + datelines:** **EB Garamond** — free, public-domain, has the right institutional feel. Used for ordinal markers (`I.` `II.` `III.`) and the masthead emphasis words.

**Mono:** **JetBrains Mono** for tabular content, version strings, and the Index/Ledger sections.

**Type scale:**

| Use | Class | Size | Line height | Tracking | Weight |
|---|---|---|---|---|---|
| Masthead title | `text-[clamp(2.5rem,7vw,5.5rem)]` | 40–88px | `leading-[0.95]` | `tracking-[-0.02em]` | `font-medium` |
| Section H | `text-[clamp(1.75rem,4vw,3rem)]` | 28–48px | `leading-[1.05]` | `tracking-[-0.015em]` | `font-medium` |
| Subhead | `text-base md:text-lg` | 16–18px | `leading-[1.5]` | normal | `font-normal` |
| Body | `text-[15px] md:text-base` | 15–16px | `leading-[1.6]` | normal | `font-normal` |
| Eyebrow | `text-[11px]` | 11px | `leading-[1.4]` | `tracking-[0.22em]` uppercase | `font-medium` |
| Numeral (serif) | `text-2xl md:text-4xl font-serif` | — | — | `tracking-[0.02em]` | `font-normal italic` |
| Mono | `font-mono text-[13px]` | 13px | `leading-[1.7]` | `tracking-[-0.01em]` | `font-normal` |

**Type rules:**
- Body type: **never larger than 16px**. Restraint.
- Section headings: `font-medium`, not `font-semibold`. Refined weight.
- Use serif italic numerals (EB Garamond italic) as ordinal markers throughout — for divisions, manifesto items, sections. The italic numeral is a Stripe Press signature; we steal it deliberately.
- Mono type: only for coordinates (city · lat/long), version strings, and the colophon.

### 3.4 Layout & rhythm

- **Container:** `max-w-[1200px] mx-auto px-8 md:px-16`. Wider than typical because document-style layouts need more horizontal room for tabular content.
- **Section padding:** `py-32 md:py-40`.
- **The grid:** the entire page sits on a 12-column grid with visible 1px column dividers (very faint, `--ink-rule`) on desktop. This is the "annual report" tell.
- **Horizontal rules** between sections: hairline `border-t border-ink-rule`, with section number + label inline (e.g., `— II — FOUNDATION`).
- **No rounded corners** on cards or containers. Square edges throughout.

### 3.5 Motion

**Restraint to the point of severity.**

```ts
// lib/motion.ts
export const ease = [0.32, 0.72, 0, 1] as const;  // sharper, more architectural

export const reveal = {
  initial: { opacity: 0, y: 8 },               // 8px, not 16
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-120px" },
  transition: { duration: 0.5, ease },
};

export const stagger = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-120px" },
  transition: { staggerChildren: 0.05, delayChildren: 0.05 },
};
```

**Motion rules:**
- 8px max distance. Most sections only fade, no translate.
- Durations: 400–600ms for sections, 120ms for hover.
- **Zero gradient blob.** Zero animated visuals. The aesthetic is paper, not screen.
- **One animated element on the entire page**: a thin vermillion vertical line in the masthead that grows from 0 to full height over 1.2s on load. That's the only ornament.
- Hover states change opacity by 0.6 → 1.0; never scale, never translate.
- Respect `prefers-reduced-motion` always — skip even the vermillion line.

### 3.6 Texture

- **No noise overlay.**
- **No gradient.** Vermillion is a flat color, not a gradient.
- **One subtle visual element only**: a pencil-thin column-grid showing through the entire page at `opacity: 0.04`. Architectural blueprint feel.

### 3.7 Triangulation rules — keep this site distinct from siblings

|   | **Corsw** (this site) | **Modlio** (sibling) | **Scene** (sibling) |
|---|---|---|---|
| Background | `#0E0E0E` (warm off-black) | `#0A0B0F` (cool carbon) | `#FAFAF7` (warm off-white) |
| Ink | `#F5F1E8` (bone, warm) | `#E8EAED` (cool paper) | `#0F0F0F` (warm near-black) |
| Accent | `#D4452C` vermillion (4 places) | `#3B82F6` electric blue | Soft gradient |
| Type | Inter + EB Garamond + JBM | Inter + JBM (no serif) | Geist + Geist Mono |
| Numerals | Italic Roman serif (I, II) | Mono Arabic (01, 02) | Mono Arabic |
| Motion | 8px max | 12px max | 16-24px |
| Imagery | Zero — type only | Schematic SVG diagrams | Soft gradient blob |
| Texture | Column blueprint grid 4% | None | Noise overlay 4% |

**If you find yourself reaching for electric blue, schematic diagrams, or warm gradients — stop.** That's another sibling's territory. Stay in vermillion + serif italic + column-grid.

---

## 4. Section specifications

### 4.1 Masthead (top, ~40vh)

**Layout:** Top-left tiny eyebrow. A growing vermillion vertical line. Then the title and a single line.

```
CORNER SOFTWARE  ·  EST. 2024  ·  HYDERABAD / PUNE / SOLAPUR
                                                     [vermillion line, 1px wide, animates 0 → 60vh on mount]
Corner Software builds
software companies.
Two so far.
```

**Elements:**
1. Top eyebrow row, `text-eyebrow`, full-width, separated by middle dots.
2. The masthead H, three lines, font-medium, the word "*companies*" set in italic serif (EB Garamond), the number "*Two*" set in italic serif.
3. Below the H, a hairline rule.
4. Below the rule, mono dateline: `MAY · 2026 / ISSUE 01`.

**Animation:** Vertical vermillion line draws from 0 to 60vh over 1.2s on mount, `ease`. Title fades in 200ms after.

### 4.2 Foundation — the thesis

**Layout:** Two-column on desktop. Left column (4 cols): a section index marker `— I — FOUNDATION`. Right column (8 cols): the thesis as three short paragraphs.

**Copy (use verbatim):**

> *Corner Software is a holding company for software product divisions.*
>
> *We do not take external work. We do not bid. We do not pitch. Each division operates under its own name, ships under its own brand, and is responsible for its own product.*
>
> *Corsw is what they share — the architecture, the operating standards, the long horizon.*

The first paragraph is set in section-H size. The next two are body.

### 4.3 Divisions — the centerpiece

**Layout:** Two cards side-by-side on desktop. Stacked on mobile. Each card is a tall portrait rectangle with no rounded corners, surrounded by a hairline border.

Each division card contains, top to bottom:
1. Serif italic ordinal `I.` (Modlio) and `II.` (Scene) — large, vermillion.
2. The division name as a wordmark.
3. A one-line role: e.g., `Enterprise software division.` / `Indie product studio.`
4. A 3-line description.
5. A small numerical inventory: founded date, current focus, project count.
6. A bottom-right corner link: `Visit modlio.corsw.in →` / `Visit scene.corsw.in →`

**Modlio card:**
- **Ordinal:** `I.`
- **Wordmark:** MODLIO (Inter 500, all-caps, no letter-spacing)
- **Role:** `Enterprise software division.`
- **Description:** *"Modlio builds the long-running, high-stakes systems. Healthcare platforms, financial automation, IoT infrastructure. Things that need uptime, audits, and decade-scale thinking."*
- **Inventory:**
  - `Founded · 2025`
  - `Focus  · Enterprise · Healthcare · Fintech`
  - `Active · 1 platform · 2 in build`
- **Link:** `modlio.corsw.in →`

**Scene card:**
- **Ordinal:** `II.`
- **Wordmark:** SCENE (Inter 500 on this site — Geist on Scene's own site)
- **Role:** `Indie product studio.`
- **Description:** *"Scene ships small, opinionated tools and personal-scale apps. Fast cycles, minimal scope, thoughtful taste. Where the experiments live."*
- **Inventory:**
  - `Founded · 2025`
  - `Focus  · Tools · Apps · Open work`
  - `Active · 2 shipped · 1 in research`
- **Link:** `scene.corsw.in →`

**Hover behaviour on cards:** the hairline border becomes vermillion (the only place vermillion shows on a hover anywhere on the site). 120ms. No transform, no shadow, no scale.

**Note on Scene's wordmark:** on this site, render Scene's wordmark in Inter 500 to keep visual consistency with Modlio. Scene's actual brand font (Geist) only appears on its own site. This subtle font-distinction is intentional: the divisions read as siblings under the parent.

### 4.4 Index — the inventory

**Layout:** A four-column tabular block. This is the second-most distinctive element on the page (after the divisions cards).

**Columns:** `LABEL` · `VALUE` · `SUB-VALUE` · `MONO REF`

```
— II — INDEX

ENTITY              Corner Software Pvt. Ltd.   Holding company        ent/01
FOUNDED             2024                        Hyderabad              fnd/01
DIVISIONS           Two                         Modlio · Scene         dv/01,02
LOCATIONS           Three                       Hyderabad · Pune ·     loc/03
                                                Solapur
PEOPLE              Small.                      Intentionally.         peo/01
EXTERNAL WORK       None.                       Not accepting.         ext/00
PROJECT COUNT       Six                         Across both divisions  prj/06
PUBLIC ARTIFACTS    Two                         Modlio · Scene         art/02
```

**Type:** Mono throughout. Eyebrow-letter-spacing for labels. Body weight for values. Vermillion for the mono refs in the right column (`ent/01`, etc.).

### 4.5 Coordinates — three cities

**Layout:** Three-column on desktop, stacked on mobile. No map. No pins. Just three blocks of plaintext.

```
— III — COORDINATES

HYDERABAD                  PUNE                         SOLAPUR
17.385° N · 78.486° E      18.520° N · 73.856° E        17.660° N · 75.906° E

Primary node.              Engineering node.             Field node.
Operations and direction.  Build and ship.               Healthcare ops, Arogyam.
```

**Type:** All mono, except the city names which are display-medium.

### 4.6 Manifesto — seven principles

**Layout:** A long single column, max-width `max-w-2xl`. Each principle is a row.

**Section header:** `— IV — MANIFESTO`

**Principles (use verbatim):**

```
01.   We build companies, not features.
02.   The division is the product. The product belongs to the division.
03.   Outside work is a distraction. We refuse it.
04.   Small teams. Short meetings. Long horizons.
05.   We will be here in ten years.
06.   The two divisions do not compete. They do different work.
07.   The parent does not interfere. It only protects.
```

**Each row layout:** Vermillion serif italic numeral (`01.`) · medium gap · the principle in body weight, slightly larger than other body type (`text-lg`). Hairline rule below each row except the last.

### 4.7 Provenance — who built it

**Layout:** Two columns. Left: the three cities-in-text from the coordinates section but smaller. Right: a short paragraph about the people.

**Copy (use verbatim):**

> *Corner Software is operated by a small group of people across Hyderabad, Pune, and Solapur. We are designers, engineers, and one accountant. The company is privately held and has no investors.*
>
> *We are not hiring publicly. The team grows by invitation.*

Section header: `— V — PROVENANCE`

### 4.8 Ledger — external links

**Layout:** A list, like an old-fashioned reference index. Mono, tabular.

```
— VI — LEDGER

modlio.corsw.in              Enterprise division           →
scene.corsw.in               Indie studio                  →
github.com/corsw             Public source                 →
hello@corsw.in               Direct line                   →
```

**Type:** Mono. Spacing tabular (use `tabular-nums`). Hover on each row: subtle underline + vermillion arrow.

### 4.9 Colophon — small print

**Layout:** Centered, small. Single block at the bottom of the page.

**Copy:**

```
Set in Inter and EB Garamond.
Built by Corsw.
Version 1.0 · May 2026.

© Corner Software Pvt. Ltd., 2024–2026.
```

Below this, a small vermillion square `■` — 8px by 8px. The site's signature mark.

---

## 5. Component architecture

```
.
├── app/
│   ├── layout.tsx            # fonts, dark bg, column grid overlay
│   ├── page.tsx              # composes all 9 sections
│   ├── globals.css           # tokens + tailwind base
│   ├── fonts.ts              # Inter + EB Garamond + JetBrains Mono via next/font
│   └── opengraph-image.tsx   # static OG via next/og
├── components/
│   ├── sections/
│   │   ├── Masthead.tsx
│   │   ├── Foundation.tsx
│   │   ├── Divisions.tsx
│   │   ├── Index.tsx
│   │   ├── Coordinates.tsx
│   │   ├── Manifesto.tsx
│   │   ├── Provenance.tsx
│   │   ├── Ledger.tsx
│   │   └── Colophon.tsx
│   └── primitives/
│       ├── DivisionCard.tsx
│       ├── SectionRule.tsx       # the "— II — INDEX" header pattern
│       ├── Numeral.tsx           # serif italic ordinal
│       ├── ColumnGrid.tsx        # the 0.04-opacity blueprint grid
│       ├── VermillionLine.tsx    # the masthead vertical line
│       └── Wordmark.tsx          # CORSW / MODLIO / SCENE wordmarks
├── lib/
│   ├── motion.ts             # shared variants
│   └── utils.ts
└── public/
    └── brand/                 # see ASSETS.md
```

---

## 6. Logo / Wordmark direction

The current `corsw.in` favicons are too generic. Build a custom set in SVG.

### 6.1 The Corsw mark
A literal interpretation of "Corner Software" — a single inset corner, square, vermillion.

```svg
<!-- 24x24 monogram -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="24" height="24" fill="#0E0E0E"/>
  <path d="M0 0 L12 0 L12 12 L0 12 Z" fill="#F5F1E8"/>
  <rect x="3" y="3" width="6" height="6" fill="#D4452C"/>
</svg>
```

A square within a corner — literal, geometric, has a single vermillion accent. Use this everywhere a logo is needed: favicon, OG image, masthead.

### 6.2 The Corsw wordmark
Set in **Inter, weight 500, all-caps, letter-spaced 0.04em** — `CORSW`. No icon next to it in headers; the wordmark is the only mark. The square monogram appears only in the favicon and OG image.

### 6.3 Sibling wordmark rules on this site
- **MODLIO** — Inter 500, all-caps, no letter-spacing. Tighter than Corsw, more confident-feeling.
- **SCENE** — render in Inter 500 here. Scene's actual font (Geist) only appears on `scene.corsw.in`.

This font-distinction is intentional: on this site, the divisions are all Inter so they read as siblings under the parent. On their own sites, they get their own type.

---

## 7. SEO + OG

```html
<title>Corner Software · A holding company for software product divisions.</title>
<meta name="description" content="Corner Software is a holding company for software product divisions. Modlio (enterprise) and Scene (indie). Hyderabad · Pune · Solapur. Founded 2024." />
```

**OG image** — generate via `next/og`:
- Bg: `#0E0E0E`
- Top-left: small vermillion square monogram.
- Centered title in three lines (medium weight, italic for "*companies*" and "*Two*"):
  > Corner Software builds
  > software *companies*.
  > *Two* so far.
- Bottom-left mono: `CORSW · MAY 2026`
- Bottom-right mono: `HYDERABAD / PUNE / SOLAPUR`
- One vermillion vertical line on the right edge.

---

## 8. Performance + accessibility

- LCP < 1.5s on 4G. The whole page is type and lines — there's no excuse for slow.
- No images above the fold. Zero. The vermillion line is SVG.
- Lighthouse mobile target: 100 / 100 / 100 / 100 across the board. The simplicity makes this achievable.
- Color contrast: bone on off-black is ~14:1 (AAA easily).
- The vermillion accent `#D4452C` on bone `#F5F1E8` is used only on body weight or larger; never on small mono text where contrast might fall below 4.5:1.
- Every motion respects `prefers-reduced-motion`.
- The column-grid overlay must be hidden from screen readers (`aria-hidden`).

---

## 9. Hard rules

### Never
- Never use a gradient. Anywhere.
- Never use rounded corners larger than 0px on cards or containers.
- Never add a hamburger menu, a sticky nav, or a contact form.
- Never use Hinglish — that's Scene's voice.
- Never use electric blue or schematic diagrams — those are Modlio's signatures.
- Never import an icon library. The site has zero icons by design. Arrows are the unicode `→` glyph.
- Never let vermillion appear more than the four locations specified in §3.2.
- Never animate anything that translates more than 8px.
- Never let the masthead cycle, animate, or carousel.
- Never let body type get larger than 18px or smaller than 13px (mono can be 11px for refs).
- Never write your own copy for the manifesto. The seven principles are locked.

### Always
- Always use serif italic numerals (EB Garamond italic) for ordinals.
- Always use mono with `tabular-nums` for the Index and Ledger sections.
- Always render the column-grid overlay at the layout root.
- Always use square edges. Square edges are the entire silhouette of this site.
- Always set `text-balance` on long headings — it matters more here than on a typical site because the headings are sentences.
- Always keep the masthead's vermillion line as the only animated element on first paint.
- Always test that the site reads as a *document*, not as a *landing page*. If it feels like a landing page, you've failed the brief.
- Always cross-check against `https://scene-studio-xi.vercel.app/` (sibling, deployed) and `modlio.corsw.in` (sibling, in build). The three should look like a family but not triplets.

---

## 10. Setup commands

```bash
npx create-next-app@latest corsw --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd corsw
pnpm add framer-motion
pnpm dlx shadcn@latest init       # New York, neutral, dark default
# Don't add any shadcn components. The site uses none of them.
# We initialize shadcn only for the cn() utility and the CSS variable conventions.
```

**Don't add anything else.** No icon libraries, no animation libraries beyond Framer, no UI kit.

---

## 11. Stretch polish (only after the base ships)

1. **Print stylesheet** — when someone hits Cmd-P, the page should print like a real document. Hide the column grid, switch to white bg + black ink, render section numerals in ordinal Roman (`I.`, `II.`, `III.`).
2. **A `/colophon` deep page** — single page that lists every typeface, every dependency, every commit hash, in a dense mono table. Indulgent but on-brand.
3. **A `/changelog` page** — versioned company milestones (founding, divisions launch, first product ship). Date-prefixed, mono.
4. **OG image variants** — different OG cards per division for social sharing.

---

## 12. Definition of done

- [ ] Nine sections present, in order, with exact copy from §4.
- [ ] Inter, EB Garamond, JetBrains Mono loaded via `next/font`.
- [ ] All eight color tokens present in `globals.css`.
- [ ] Vermillion appears in exactly four places (masthead line, manifesto numerals, one word per section heading, hover on outbound links).
- [ ] Square monogram favicon + OG image generated.
- [ ] No icon imports. No gradient utilities. No rounded corners >0.
- [ ] Column-grid overlay visible at 4% opacity.
- [ ] Lighthouse mobile ≥98 / 100 / 100 / 100.
- [ ] Site looks intentional in mobile Safari, Chrome desktop, Firefox.
- [ ] All animations respect `prefers-reduced-motion`.
- [ ] When viewed alongside Scene (`scene-studio-xi.vercel.app`) and Modlio, the three sites read as a family but not as triplets.

---

## 13. The vibe check

When a visitor lands, in this order:
1. *"This is not the agency site I was expecting."*
2. *"This feels older than it is."*
3. *"There are two product companies under it. Modlio and Scene."*
4. *"They don't take outside work."*
5. *"Okay. Different."*

If a visitor thinks "this is a startup," you've failed. Corsw should feel like an institution.
