# corsw.in Scroll Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild corsw.in as a scroll-driven site (bone → ink → carbon chapters, pinned work sequence, animated diagrams, case study pages) without changing what the site claims.

**Architecture:** Server Components render all content; small client components add motion with GSAP (ScrollTrigger, SplitText, MotionPath) and Lenis. Colour is one set of role variables on `<html>` that `ToneScroller` scrubs between chapter tones defined once in `lib/tones.ts`; without JS or with reduced motion each section paints its own tone statically. Case studies are statically generated from `lib/projects.ts`.

**Tech Stack:** Next.js 16.2.4 (App Router, React Compiler), React 19.2.4 (vendored canary `ViewTransition`), Tailwind CSS 4, gsap 3.15.0, @gsap/react 2.1.2, lenis 1.3.26, node:test.

**Spec:** `docs/superpowers/specs/2026-09-16-scroll-redesign-design.md`

## Global Constraints

- Work in the worktree `/Users/apple/Personal/corsw/.claude/worktrees/redesign-scroll` on branch `redesign/scroll`. Never touch the main checkout.
- Before any Next.js API you have not used in this plan, read `node_modules/next/dist/docs/` (this Next version has breaking changes).
- Done for every task: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` all green.
- Runtime dependencies after the redesign: `next`, `react`, `react-dom`, `gsap`, `@gsap/react`, `lenis`. `framer-motion` is removed in Task 5. No others.
- TypeScript strict, no `any`. Server Components by default; `"use client"` only where a hook runs.
- Colours only through role tokens (`bg-bg`, `text-ink-muted`, `border-ink-rule`, `text-accent`, `var(--accent)`). Hex only in `lib/tones.ts`, brand marks, the `globals.css` print block and status-signal colours (`--color-success`, `--color-warning`), `app/opengraph-image.tsx`, and `viewport.themeColor` in `app/layout.tsx` (Next cannot take a CSS variable there).
- Square corners: no `rounded-*`. No shadows or glows. No icon library; arrows are the `→` character with `aria-hidden="true"`. No gradients except the column grid and dot grid in `Textures`.
- Copy: no headcount, team or investor language, no "Pvt. Ltd.", no counts in prose, no dates, issues or version strings (exceptions already in BRIEF.md: the footer `© 2024–2026`, the `Est. 2024` eyebrow, the Company `Founded 2024` row, and the existing `diagramLabel` slugs), no exclamation marks, no emoji, no Hinglish. Never "transform", "innovative", "cutting-edge", "world-class", "next-generation". No external links: the email and `/demo` are the only ways out.
- `text-balance` on headings, `tabular-nums` on figures and tables, `aria-hidden="true"` on decorative ordinals, marks and arrows.
- Every animation is created inside `useGSAP` and gated by `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. Under reduced motion every element sits in its final visible state.
- Captures come only from public pages (SSC) or local instances running seeded demo data. Never production Arogyam, StreamLine or Ordio.
- `lib/host.ts`, `proxy.ts` and `lib/host.test.mjs` are not modified.
- Conventional Commits, one concern per commit, ending with the line `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

## File Structure

| Path | Responsibility |
|---|---|
| `lib/tones.ts` | Chapter tone values (single source) and `toneCss()` |
| `lib/tones.test.mjs` | Tone roles match, CSS scoping, AA contrast floor |
| `lib/gsap.ts` | Plugin registration, re-exports `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP` |
| `lib/diagrams.ts` | Schematic data and pure geometry (`anchor`, `pathFor`, `tipFor`, `mobileLayout`) |
| `lib/diagrams.test.mjs` | Schematic integrity |
| `lib/projects.ts` | Project data incl. slug, business copy, capture, walkthrough |
| `lib/projects.test.mjs` | Slugs, diagram keys, capture files on disk |
| `components/motion/SmoothScroll.tsx` | Lenis on GSAP ticker |
| `components/motion/ToneScroller.tsx` | Scrubs role variables between section tones |
| `components/motion/Reveal.tsx` | `[data-reveal]` children rise in once |
| `components/motion/SplitReveal.tsx` | Heading lines rise out of masks |
| `components/motion/ScrubText.tsx` | Paragraph lines brighten with scroll |
| `components/motion/Drift.tsx` | Scroll-linked lift and fade |
| `components/motion/Marquee.tsx` | Velocity-linked word marquee |
| `components/site/Bar.tsx` | Fixed top bar |
| `components/site/Footer.tsx` | One-line footer with a tone |
| `components/site/Textures.tsx` | Fixed column grid + dot grid layers |
| `components/site/Capture.tsx` | Product capture image or pending placeholder |
| `components/site/Device.tsx` | Capture framed as laptop or phone |
| `components/site/Diagram.tsx` | Scroll-drawn system diagram with traffic pulses + mobile stack |
| `components/home/{Hero,Foundation,Work,Built,Contact}.tsx` | Home chapters |
| `components/work/{CaseHero,Business,Walkthrough,Architecture,NextProject}.tsx` | Case study sections |
| `app/work/[slug]/page.tsx` | Case study route |
| `app/not-found.tsx` | 404 |
| `scripts/capture.sh`, `scripts/captures.txt` | Playwright CLI capture runner and list |
| `types/react-canary.d.ts` | Pulls in React canary types for `ViewTransition` |

Deleted by the end: `components/sections/*`, `components/primitives/{AccentLine,ColumnGrid,MotionProvider,SystemDiagram,ThemeToggle}.tsx`, `lib/motion.ts`.

---

### Task 1: Motion stack, fonts and chapter tones

**Files:**
- Modify: `package.json` (via pnpm), `app/fonts.ts`, `app/globals.css`, `app/layout.tsx`
- Create: `lib/tones.ts`, `lib/tones.test.mjs`, `lib/gsap.ts`, `components/motion/SmoothScroll.tsx`, `components/motion/ToneScroller.tsx`, `components/site/Textures.tsx`, `components/site/Bar.tsx`, `components/site/Footer.tsx`
- Delete: `components/primitives/ColumnGrid.tsx`

**Interfaces:**
- Produces: `type Tone = "bone" | "ink" | "carbon"`; `TONES: Record<Tone, ToneVars>`; `toneCss(): string`; `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP` from `@/lib/gsap`; `<Footer tone={Tone} />`; `<Bar />`; `<Textures />`; `<SmoothScroll />`; `<ToneScroller />`.
- Contract for later tasks: a page's `<main>` has `id="content"` and `data-tone-start={Tone}`; every top-level section inside it has `data-tone={Tone}`.

- [ ] **Step 1: Install the motion dependencies**

Run: `pnpm add gsap@3.15.0 @gsap/react@2.1.2 lenis@1.3.26`
Expected: `package.json` dependencies now list `gsap`, `@gsap/react`, `lenis` next to `framer-motion`, `next`, `react`, `react-dom`.

- [ ] **Step 2: Write the failing tone test**

Create `lib/tones.test.mjs`:

```js
// Run with `pnpm test` (Node strips the types from tones.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { TONES, toneCss } from "./tones.ts";

const luminance = (hex) => {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .map((c) => parseInt(c, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("every tone defines the same roles", () => {
  const roles = Object.keys(TONES.bone).sort();
  for (const vars of Object.values(TONES)) {
    assert.deepEqual(Object.keys(vars).sort(), roles);
  }
});

test("css sets each page's starting tone and each static section", () => {
  const css = toneCss();
  assert.match(css, /^:root\{--bg:#ece6da;/);
  for (const [name, vars] of Object.entries(TONES)) {
    assert.ok(css.includes(`html:has(main[data-tone-start="${name}"]){--bg:${vars["--bg"]};`), name);
    assert.ok(css.includes(`html:not(.tones-live) [data-tone="${name}"]{--bg:${vars["--bg"]};`), name);
  }
});

test("small text clears 4.5:1 on ground and card in every tone", () => {
  for (const [name, vars] of Object.entries(TONES)) {
    for (const fg of ["--ink", "--ink-muted", "--ink-faint", "--accent"]) {
      for (const bg of ["--bg", "--bg-card"]) {
        const ratio = contrast(vars[fg], vars[bg]);
        assert.ok(ratio >= 4.5, `${name} ${fg} on ${bg} is ${ratio.toFixed(2)}`);
      }
    }
  }
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL, `Cannot find module` for `./tones.ts` (host tests still pass).

- [ ] **Step 4: Create `lib/tones.ts`**

```ts
export type Tone = "bone" | "ink" | "carbon";

type Role =
  | "--bg"
  | "--bg-card"
  | "--ink"
  | "--ink-muted"
  | "--ink-faint"
  | "--ink-rule"
  | "--accent"
  | "--grid-opacity"
  | "--dots-opacity";

export type ToneVars = Record<Role, string>;

/**
 * The three chapters the site scrolls through. Components read only the role
 * names; ToneScroller scrubs these values on <html> between sections.
 * Contrast floors are asserted in tones.test.mjs.
 */
export const TONES: Record<Tone, ToneVars> = {
  bone: {
    "--bg": "#ece6da",
    "--bg-card": "#e3dccf",
    "--ink": "#141310",
    "--ink-muted": "#45423c",
    "--ink-faint": "#5f5b54",
    "--ink-rule": "#d3cbbd",
    "--accent": "#a8341e",
    "--grid-opacity": "1",
    "--dots-opacity": "0",
  },
  ink: {
    "--bg": "#0e0e0e",
    "--bg-card": "#161513",
    "--ink": "#f5f1e8",
    "--ink-muted": "#a8a39a",
    "--ink-faint": "#847f76",
    "--ink-rule": "#2a2825",
    "--accent": "#d7543d",
    "--grid-opacity": "0",
    "--dots-opacity": "0",
  },
  carbon: {
    "--bg": "#0a0b0f",
    "--bg-card": "#111317",
    "--ink": "#e8eaed",
    "--ink-muted": "#9ca3af",
    "--ink-faint": "#767d8c",
    "--ink-rule": "#1f2228",
    "--accent": "#d7543d",
    "--grid-opacity": "0",
    "--dots-opacity": "1",
  },
};

const declarations = (vars: ToneVars) =>
  Object.entries(vars)
    .map(([role, value]) => `${role}:${value}`)
    .join(";");

/**
 * Injected once by app/layout.tsx. `:root` is bone; `data-tone-start` on
 * <main> picks the page's first tone; until ToneScroller adds `tones-live`
 * (no JS, reduced motion) each section paints its own tone.
 */
export function toneCss(): string {
  const tones = Object.keys(TONES) as Tone[];
  return [
    `:root{${declarations(TONES.bone)}}`,
    ...tones.map((t) => `html:has(main[data-tone-start="${t}"]){${declarations(TONES[t])}}`),
    ...tones.map(
      (t) =>
        `html:not(.tones-live) [data-tone="${t}"]{${declarations(TONES[t])};background-color:var(--bg);color:var(--ink)}`,
    ),
  ].join("\n");
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS, 9 tests (6 host + 3 tones), 0 failures.

- [ ] **Step 6: Replace `app/fonts.ts`**

```ts
import { EB_Garamond, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

// Variable weight axis (400–900): headlines change weight on scroll and hover.
export const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

// On screen, Garamond is only ever set italic (accent words, ordinals, hero).
export const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["italic"],
});

// Upright Garamond is the print body (globals.css @media print). Separate
// loader with preload off so screens don't download it on every visit.
export const ebGaramondPrint = EB_Garamond({
  variable: "--font-eb-garamond-print",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["normal"],
  preload: false,
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});
```

- [ ] **Step 7: Replace `app/globals.css`**

```css
@import "tailwindcss";

/* Role tokens (--bg, --ink, --accent, …) come from lib/tones.ts, injected by
   app/layout.tsx and scrubbed on <html> by ToneScroller. Components only ever
   read roles. */
@theme inline {
  --color-bg: var(--bg);
  --color-bg-card: var(--bg-card);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-ink-faint: var(--ink-faint);
  --color-ink-rule: var(--ink-rule);
  --color-accent: var(--accent);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --font-sans: var(--font-schibsted);
  --font-serif: var(--font-eb-garamond);
  --font-mono: var(--font-jetbrains-mono);
  --default-font-family: var(--font-schibsted);
}

/* Emphasis is a face swap to Garamond italic, never a synthetic italic. */
@utility font-accent {
  font-family: var(--font-eb-garamond);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
}

html {
  scroll-padding-top: 3.5rem;
}

html,
body {
  background: var(--bg);
  color: var(--ink);
}

body {
  font-family: var(--font-schibsted), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

a {
  color: inherit;
  text-decoration: none;
}

/* One keyboard focus style for every link and button, in the chapter's accent. */
a:focus-visible,
button:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 3px;
}

/* Hover draws a 1px accent underline left to right. */
.link-draw {
  position: relative;
}

.link-draw::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 200ms cubic-bezier(0.32, 0.72, 0, 1);
}

.link-draw:hover::after,
.link-draw:focus-visible::after,
a:hover > .link-draw::after,
a:focus-visible > .link-draw::after {
  transform: scaleX(1);
}

/* Hero lines rise out of masks in CSS, so the LCP heading paints without JS.
   Set --line on each .line-rise to stagger. */
.line-mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.1em;
  margin-bottom: -0.1em;
}

.line-rise {
  display: block;
  animation: line-rise 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--line, 0) * 110ms + 150ms);
}

@keyframes line-rise {
  from {
    transform: translateY(110%);
  }
}

/* The corner mark's inset square stamps in from its top-left corner. */
.mark-stamp {
  transform-box: fill-box;
  transform-origin: 0 0;
  animation: mark-stamp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

@keyframes mark-stamp {
  from {
    transform: scale(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* Print like a document: white paper, dark ink, Garamond body, no motion
   state left behind. */
@media print {
  html,
  html [data-tone] {
    --bg: #ffffff !important;
    --bg-card: #ffffff !important;
    --ink: #141310 !important;
    --ink-muted: #45423c !important;
    --ink-faint: #6e6a63 !important;
    --ink-rule: #d8d4cb !important;
    --accent: #b83a22 !important;
    --grid-opacity: 0 !important;
    --dots-opacity: 0 !important;
  }

  body {
    font-family: var(--font-eb-garamond-print), Georgia, "Times New Roman", serif;
  }

  main [style*="opacity"],
  main [style*="transform"] {
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
  }
}
```

- [ ] **Step 8: Create `lib/gsap.ts`**

```ts
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// One registration for the app. Client components also render on the server,
// where there is no window to configure.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);
  // iOS address-bar show/hide must not re-measure pinned sections mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

- [ ] **Step 9: Create `components/motion/SmoothScroll.tsx`**

```tsx
"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Lenis inertia scrolling on fine pointers, driven by GSAP's ticker so
 * ScrollTrigger reads the same position every frame. Touch and reduced motion
 * keep native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const instance = new Lenis({ lerp: 0.1, anchors: true, stopInertiaOnNavigate: true });
      const raf = (time: number) => instance.raf(time * 1000);
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.current = instance;
      return () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        instance.destroy();
        lenis.current = null;
      };
    });
    // Web fonts change line lengths after first layout; re-measure once they land.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  });

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
```

- [ ] **Step 10: Create `components/motion/ToneScroller.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { TONES, type Tone } from "@/lib/tones";

/**
 * Takes over from the static per-section tones: adds `tones-live` to <html>
 * and scrubs the role variables from one section's tone to the next as that
 * section scrolls in. Reduced motion keeps the static tones.
 */
export function ToneScroller() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = document.documentElement;
        const sections = gsap.utils.toArray<HTMLElement>("main [data-tone]");
        if (sections.length === 0) return;
        const toneOf = (el: HTMLElement) => TONES[el.dataset.tone as Tone];

        gsap.set(root, toneOf(sections[0]));
        root.classList.add("tones-live");

        sections.slice(1).forEach((section, i) => {
          const from = toneOf(sections[i]);
          const to = toneOf(section);
          if (from === to) return;
          gsap.fromTo(
            root,
            { ...from },
            {
              ...to,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: section, start: "top 85%", end: "top 35%", scrub: true },
            },
          );
        });

        return () => {
          root.classList.remove("tones-live");
          for (const role of Object.keys(TONES.bone)) root.style.removeProperty(role);
        };
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
```

- [ ] **Step 11: Create `components/site/Textures.tsx`**

```tsx
/**
 * Fixed texture layers behind the content: the twelve-column hairline grid
 * (bone) and the dot grid (carbon). Their opacity is a tone role, so they fade
 * in and out with the chapters. Static sections paint over them.
 */
export function Textures() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 print:hidden">
      <div className="mx-auto hidden h-full w-full max-w-[1200px] px-8 md:block md:px-16">
        <div
          className="h-full w-full"
          style={{
            opacity: "var(--grid-opacity)",
            backgroundImage:
              "repeating-linear-gradient(to right, var(--ink-rule) 0 1px, transparent 1px calc(100% / 12))",
          }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          opacity: "calc(var(--dots-opacity) * 0.45)",
          backgroundImage: "radial-gradient(var(--ink-faint) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 12: Create `components/site/Bar.tsx`**

```tsx
import Link from "next/link";
import { Monogram } from "@/components/primitives/Monogram";
import { NEW_PROJECT_HREF } from "@/lib/projects";

/** The fixed top bar: the mark home and one call to action. No menu. */
export function Bar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-rule bg-bg print:hidden">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* ponytail: "/" on an unassigned *.corsw.in host rewrites to /demo, which is fine there. */}
        <Link
          href="/"
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
        >
          <Monogram size={20} title="Corner Software, home" />
          <span className="hidden sm:inline">Corner Software</span>
        </Link>
        <a
          href={NEW_PROJECT_HREF}
          className="inline-flex items-center gap-2 font-mono text-[12px] text-accent"
        >
          <span className="link-draw">Start a project</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
```

- [ ] **Step 13: Create `components/site/Footer.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import type { Tone } from "@/lib/tones";

/** One line. Takes the tone of the section above it so the page ends in one colour. */
export function Footer({ tone }: { tone: Tone }) {
  return (
    <footer data-tone={tone} className="border-t border-ink-rule">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        <span>Corner Software</span>
        <span>© 2024–2026</span>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 14: Replace `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ebGaramond, ebGaramondPrint, jetbrainsMono, schibsted } from "./fonts";
import { Bar } from "@/components/site/Bar";
import { Textures } from "@/components/site/Textures";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ToneScroller } from "@/components/motion/ToneScroller";
import { MotionProvider } from "@/components/primitives/MotionProvider";
import { toneCss } from "@/lib/tones";

const shareDescription = "Software, built and run. Arogyam · StreamLine · Ordio · SSC.";

// Title, canonical and robots live in each page so the 404 page doesn't
// inherit a second <title> and an `index, follow` next to Next's `noindex`.
export const metadata: Metadata = {
  description:
    "Corner Software (Corsw) designs, builds and operates software for healthcare, manufacturing, food service and distribution businesses. Founded 2024, based in India.",
  metadataBase: new URL("https://corsw.in"),
  openGraph: {
    title: "Corner Software",
    description: shareDescription,
    url: "https://corsw.in",
    siteName: "Corner Software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corner Software",
    description: shareDescription,
  },
  // Icons come from the app/icon.png + app/icon.svg file conventions; a manual
  // `icons` entry here would suppress those generated <link> tags.
};

// Browser chrome follows the home page's opening chapter.
export const viewport: Viewport = {
  themeColor: "#ece6da",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${schibsted.variable} ${ebGaramond.variable} ${ebGaramondPrint.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: toneCss() }} />
      </head>
      <body className="relative min-h-screen bg-bg text-ink antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-50 focus:bg-bg focus:px-3 focus:py-2 focus:font-mono focus:text-[13px]"
        >
          Skip to content
        </a>
        <Textures />
        <Bar />
        <div className="relative z-10">
          <MotionProvider>{children}</MotionProvider>
        </div>
        <SmoothScroll />
        <ToneScroller />
      </body>
    </html>
  );
}
```

- [ ] **Step 15: Delete the old grid and verify**

Run: `git rm components/primitives/ColumnGrid.tsx && pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all green. The old home sections still render (on bone), which is expected until Task 5.

- [ ] **Step 16: Commit**

```bash
git add -A
git commit -m "feat(motion): gsap + lenis stack, chapter tones and site chrome

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Diagram data, project data and the scroll-drawn diagram

**Files:**
- Create: `lib/diagrams.ts`, `lib/diagrams.test.mjs`, `lib/projects.test.mjs`, `components/site/Diagram.tsx`
- Modify: `lib/projects.ts`, `components/primitives/ProjectCard.tsx`
- Delete: `components/primitives/SystemDiagram.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`, `useGSAP` from `@/lib/gsap` (Task 1).
- Produces:
  - `type DiagramKey = "arogyam" | "streamline" | "ordio" | "ssc"`, `type Box`, `type Connector`, `type Schematic`, `SCHEMATICS: Record<DiagramKey, Schematic>`, `boxById(s: Schematic, id: string): Box`, `anchor(self: Box, other: Box): { x: number; y: number }`, `pathFor(s: Schematic, c: Connector): string`, `tipFor(s: Schematic, c: Connector): { x: number; y: number }`, `mobileLayout(s: Schematic): { clients: Box[]; core: Box; direct: Box[]; rest: { box: Box; via: string }[] }`.
  - `type Shot = { src?: string; alt: string }`, `type Step = Shot & { caption: string; device: "phone" | "laptop" }`, `Project` gains `slug: string`, `business: [string, string]`, `capture: Shot`, `walkthrough: Step[]`, and `diagram: DiagramKey`.
  - `<Diagram name={DiagramKey} />` (client).

- [ ] **Step 1: Write the failing diagram test**

Create `lib/diagrams.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { SCHEMATICS, mobileLayout, pathFor, tipFor } from "./diagrams.ts";

for (const [key, s] of Object.entries(SCHEMATICS)) {
  test(`${key}: connectors join boxes that exist, once each`, () => {
    const ids = new Set(s.boxes.map((b) => b.id));
    const pairs = new Set();
    for (const c of s.connectors) {
      assert.ok(ids.has(c.from) && ids.has(c.to), `${c.from} → ${c.to}`);
      const pair = `${c.from}-${c.to}`;
      assert.ok(!pairs.has(pair), `duplicate ${pair}`);
      pairs.add(pair);
      assert.match(pathFor(s, c), /^M \d+(\.\d+)? \d+(\.\d+)?( L \d+(\.\d+)? \d+(\.\d+)?)+$/);
      const tip = tipFor(s, c);
      assert.ok(Number.isFinite(tip.x) && Number.isFinite(tip.y));
    }
  });

  test(`${key}: exactly one core box and real mobile clients`, () => {
    assert.equal(s.boxes.filter((b) => b.accent).length, 1);
    for (const id of s.mobileClients) assert.ok(s.boxes.some((b) => b.id === id), id);
  });

  test(`${key}: the mobile stack places every box exactly once`, () => {
    const { clients, core, direct, rest } = mobileLayout(s);
    const placed = [...clients, core, ...direct, ...rest.map((r) => r.box)].map((b) => b.id);
    assert.equal(new Set(placed).size, placed.length);
    assert.deepEqual([...placed].sort(), s.boxes.map((b) => b.id).sort());
  });
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test`
Expected: FAIL, cannot find `./diagrams.ts`.

- [ ] **Step 3: Create `lib/diagrams.ts`**

Build the file in this order:

1. Copy lines 13–42 of `components/primitives/SystemDiagram.tsx` (the `Box`, `Connector`, `Annotation`, `Schematic` types) verbatim, adding `export` before each `type`.
2. Add `export type DiagramKey = "arogyam" | "streamline" | "ordio" | "ssc";`
3. Copy lines 43–214 (the `AROGYAM`, `STREAMLINE`, `ORDIO`, `SSC` constants) verbatim. Do not change any box, connector, annotation, title or desc.
4. Append:

```ts
export const SCHEMATICS: Record<DiagramKey, Schematic> = {
  arogyam: AROGYAM,
  streamline: STREAMLINE,
  ordio: ORDIO,
  ssc: SSC,
};

export function boxById(s: Schematic, id: string): Box {
  const box = s.boxes.find((b) => b.id === id);
  if (!box) throw new Error(`${s.title}: box ${id} missing`);
  return box;
}

/** Where a connector leaves `self` towards `other`: the facing edge's midpoint. */
export function anchor(self: Box, other: Box) {
  const sx = self.x + self.w / 2;
  const sy = self.y + self.h / 2;
  const ox = other.x + other.w / 2;
  const oy = other.y + other.h / 2;
  const dx = ox - sx;
  const dy = oy - sy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: dx > 0 ? self.x + self.w : self.x, y: self.y + self.h / 2 };
  }
  return { x: self.x + self.w / 2, y: dy > 0 ? self.y + self.h : self.y };
}

export function pathFor(s: Schematic, c: Connector): string {
  const from = boxById(s, c.from);
  const to = boxById(s, c.to);
  const points = [anchor(from, to), ...(c.via ?? []), anchor(to, from)];
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

/** The dot at the connector's arrival end. */
export function tipFor(s: Schematic, c: Connector) {
  return anchor(boxById(s, c.to), boxById(s, c.from));
}

/**
 * Diagrams collapse on phones without asserting an edge the system lacks: the
 * clients side by side, the core, the boxes the core reaches directly, and
 * anything reached second-hand labelled with the box it goes through.
 */
export function mobileLayout(s: Schematic) {
  const core = s.boxes.find((b) => b.accent);
  if (!core) throw new Error(`${s.title} has no accent box`);
  const clients = s.mobileClients.map((id) => boxById(s, id));
  const direct = s.connectors
    .filter((c) => c.from === core.id && !s.mobileClients.includes(c.to))
    .map((c) => boxById(s, c.to));
  const placed = new Set([core.id, ...s.mobileClients, ...direct.map((b) => b.id)]);
  const rest = s.boxes
    .filter((b) => !placed.has(b.id))
    .map((box) => {
      const c = s.connectors.find(
        (c) => (c.to === box.id || c.from === box.id) && c.from !== core.id,
      );
      return { box, via: c ? boxById(s, c.to === box.id ? c.from : c.to).label : core.label };
    });
  return { clients, core, direct, rest };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS (host, tones, and 12 diagram tests).

- [ ] **Step 5: Write the failing project data test**

Create `lib/projects.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projects } from "./projects.ts";
import { SCHEMATICS } from "./diagrams.ts";

test("slugs are unique and URL-safe", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});

test("every project has a diagram, business copy and a walkthrough", () => {
  for (const p of projects) {
    assert.ok(SCHEMATICS[p.diagram], `${p.name} diagram`);
    assert.equal(p.business.length, 2, `${p.name} business`);
    assert.ok(p.walkthrough.length >= 3 && p.walkthrough.length <= 4, `${p.name} walkthrough`);
    assert.ok(p.capture.alt.length > 0, `${p.name} capture alt`);
  }
});

test("every named capture exists in public/", () => {
  for (const p of projects) {
    for (const shot of [p.capture, ...p.walkthrough]) {
      if (!shot.src) continue;
      assert.ok(existsSync(new URL(`../public${shot.src}`, import.meta.url)), shot.src);
    }
  }
});

test("copy stays inside the brand rules", () => {
  const banned = /transform|innovative|cutting-edge|world-class|next-generation|!/i;
  for (const p of projects) {
    for (const text of [...p.business, ...p.walkthrough.map((s) => s.caption)]) {
      assert.doesNotMatch(text, banned, text);
    }
  }
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `pnpm test`
Expected: FAIL, `p.slug` is undefined (assertion on slugs).

- [ ] **Step 7: Replace `lib/projects.ts`**

```ts
import type { DiagramKey } from "./diagrams";

/** Where demo requests and new projects go. One address, named once. */
export const DEMO_EMAIL = "hello@corsw.in";

export const NEW_PROJECT_HREF = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("New project")}`;

export type ProjectStatus = "operating" | "in-build";

/**
 * A product capture. `src` stays unset until the file exists in
 * public/work/<slug>/ (scripts/capture.sh); the site shows a placeholder frame
 * meanwhile. Captures come only from public pages or seeded demo data.
 */
export type Shot = { src?: string; alt: string };

export type Step = Shot & { caption: string; device: "phone" | "laptop" };

export type Project = {
  n: number;
  slug: string;
  name: string;
  status: ProjectStatus;
  tagline: string;
  description: string[];
  /** Case study opener: what the customer runs, then what the software does about it. */
  business: [string, string];
  diagram: DiagramKey;
  /** Mono slug shown above the schematic, e.g. `arogyam.v2`. */
  diagramLabel: string;
  table: { label: string; value: string }[];
  capture: Shot;
  walkthrough: Step[];
};

export const projects: Project[] = [
  {
    n: 1,
    slug: "arogyam",
    name: "Arogyam",
    status: "operating",
    tagline: "Practice management for clinics and physiotherapy practices.",
    description: [
      "Scheduling, patient records, casepapers and home-recovery programmes in one system, with each practice on its own site and domain.",
      "Patients are reached on WhatsApp, in English or Marathi. Consent and audit records are kept from the first visit.",
    ],
    business: [
      "A physiotherapy practice runs on the day's appointments, each patient's casepaper and the exercises patients do between visits.",
      "Arogyam keeps all of it in one system and reaches patients on WhatsApp, in English or Marathi.",
    ],
    diagram: "arogyam",
    diagramLabel: "arogyam.v2",
    table: [
      { label: "SECTOR", value: "Healthcare · Physiotherapy" },
      { label: "MODULES", value: "Scheduling · Records · Casepapers · Recovery programmes · WhatsApp inbox" },
      { label: "LANGUAGES", value: "English · Marathi" },
      { label: "DELIVERY", value: "Multi-tenant · Custom domains" },
    ],
    capture: { alt: "Arogyam front desk with the day's agenda and patient inbox" },
    walkthrough: [
      {
        device: "laptop",
        alt: "Arogyam daily agenda",
        caption: "The front desk starts from the day's agenda, with every patient conversation in one inbox.",
      },
      {
        device: "laptop",
        alt: "Arogyam casepaper",
        caption: "Casepapers are versioned. An edit adds a version and never overwrites the last one.",
      },
      {
        device: "phone",
        alt: "Arogyam recovery programme on a phone",
        caption: "Patients follow their recovery programme from a private link, in English or Marathi.",
      },
      {
        device: "phone",
        alt: "Arogyam pre-visit consent on a phone",
        caption: "Consent is recorded before the first visit, against the policy version it was given for.",
      },
    ],
  },
  {
    n: 2,
    slug: "streamline",
    name: "StreamLine",
    status: "operating",
    tagline: "Operations software for small manufacturers.",
    description: [
      "StreamLine runs the business from quotation to dispatch: sales, purchasing, stock, production and payroll in one place.",
      "Every company works in its own secure workspace, with a public site that sends enquiries straight to the team.",
    ],
    business: [
      "A fabrication shop takes every order from quotation to dispatch: pricing the job, buying material, building it and sending it out.",
      "StreamLine follows the order the whole way, so sales, stock, production and payroll work from the same records.",
    ],
    diagram: "streamline",
    diagramLabel: "streamline.v1",
    table: [
      { label: "SECTOR", value: "Manufacturing · Fabrication" },
      { label: "MODULES", value: "Quotations · Invoices · Purchasing · Inventory · Production · Payroll" },
      { label: "DELIVERY", value: "Multi-tenant · Installable app" },
    ],
    capture: { alt: "StreamLine production board" },
    walkthrough: [
      {
        device: "laptop",
        alt: "StreamLine quotation with revisions",
        caption: "Quotations keep every revision, and an accepted quote becomes a work order.",
      },
      {
        device: "laptop",
        alt: "StreamLine production board",
        caption: "The production board moves each job from approved to dispatched.",
      },
      {
        device: "laptop",
        alt: "StreamLine stock ledger",
        caption: "Stock on hand is worked out from every movement, never typed in.",
      },
      {
        device: "phone",
        alt: "StreamLine public site enquiry form on a phone",
        caption: "Each company's public site sends enquiries straight to the team's inbox.",
      },
    ],
  },
  {
    n: 3,
    slug: "ordio",
    name: "Ordio",
    status: "operating",
    tagline: "QR ordering and kitchen display for cafés and restaurants.",
    description: [
      "Guests scan the table's QR code and order from their own phone, with no app to install and no sign-in. Each order reaches the kitchen display, and the guest can follow it to the table.",
      "Owners manage menus, tables, offers and daily reports from one dashboard, with GST-ready invoices.",
    ],
    business: [
      "At a busy café the counter sets the pace. Guests queue to order, and each ticket has to reach the kitchen by hand.",
      "Ordio moves the order onto the guest's own phone and straight onto the kitchen display.",
    ],
    diagram: "ordio",
    diagramLabel: "ordio.v1",
    table: [
      { label: "SECTOR", value: "Food service" },
      { label: "MODULES", value: "Menu · Ordering · Kitchen display · Invoices · Reports" },
      { label: "DELIVERY", value: "Multi-tenant · Installable app" },
    ],
    capture: { alt: "Ordio kitchen display" },
    // No payment step: PhonePe merchant KYC is pending (PRODUCT.md).
    walkthrough: [
      {
        device: "phone",
        alt: "Ordio menu after scanning a table QR code",
        caption: "Guests scan the table's QR code and order from the menu. No app, no sign-in.",
      },
      {
        device: "phone",
        alt: "Ordio cart with add-ons and a kitchen note",
        caption: "Sizes, add-ons and kitchen notes, with GST worked out on the bill.",
      },
      {
        device: "laptop",
        alt: "Ordio kitchen display",
        caption: "Each ticket moves across the kitchen display from preparing to ready.",
      },
      {
        device: "phone",
        alt: "Ordio order status on the guest's phone",
        caption: "The guest follows the same ticket from the table.",
      },
    ],
  },
  {
    n: 4,
    slug: "ssc",
    name: "SSC",
    // In build: phone, WhatsApp and licence placeholders still block launch (ssc README).
    status: "in-build",
    tagline: "Catalogue and quote requests for a wholesale distributor.",
    description: [
      "A product catalogue for an Ayurvedic medicine distributor, searchable by name, brand or use and filtered by category and form.",
      "Buyers request a quote in a few steps, by email or on WhatsApp, with the product already filled in.",
    ],
    business: [
      "A wholesale distributor's buyers look up products by name, brand or use, then ask for a price.",
      "SSC turns the catalogue into a site they can search and filter, and turns any product into a quote request.",
    ],
    diagram: "ssc",
    diagramLabel: "ssc.v1",
    table: [
      { label: "SECTOR", value: "Wholesale distribution" },
      { label: "MODULES", value: "Catalogue · Search and filters · Quote requests" },
      { label: "DELIVERY", value: "Website · Installable app" },
    ],
    capture: { alt: "SSC catalogue with search and filters" },
    walkthrough: [
      {
        device: "laptop",
        alt: "SSC catalogue with filters",
        caption: "Search by name, brand or use, and filter by category and form.",
      },
      {
        device: "phone",
        alt: "SSC product page on a phone",
        caption: "Each product page carries its brand, form and uses.",
      },
      {
        device: "phone",
        alt: "SSC quote request with the product filled in",
        caption: "A quote request starts with the product already filled in.",
      },
    ],
  },
];
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `pnpm test`
Expected: PASS, 0 failures.

- [ ] **Step 9: Create `components/site/Diagram.tsx`**

```tsx
"use client";

import { useId, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  SCHEMATICS,
  mobileLayout,
  pathFor,
  tipFor,
  type Box,
  type DiagramKey,
} from "@/lib/diagrams";

/**
 * A system diagram as deployed. With motion on desktop the boxes rise and the
 * connectors draw as it scrolls through, then dots run along every connector
 * while it stays in view. Phones get the stacked version.
 */
export function Diagram({ name }: { name: DiagramKey }) {
  const s = SCHEMATICS[name];
  const svgRef = useRef<SVGSVGElement>(null);
  const titleId = useId();
  const descId = useId();

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const edges = gsap.utils.toArray<SVGPathElement>("[data-edge]", svg);
        const boxes = gsap.utils.toArray<SVGGElement>("[data-box]", svg);
        const tips = gsap.utils.toArray<SVGCircleElement>("[data-tip]", svg);
        const pulses = gsap.utils.toArray<SVGCircleElement>("[data-pulse]", svg);

        for (const edge of edges) {
          const length = edge.getTotalLength();
          gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length });
        }

        gsap
          .timeline({ scrollTrigger: { trigger: svg, start: "top 80%", end: "bottom 60%", scrub: 1 } })
          .from(boxes, { autoAlpha: 0, y: 12, duration: 0.4, stagger: 0.06 })
          .to(edges, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: "none" }, 0.3)
          .from(tips, { autoAlpha: 0, duration: 0.1, stagger: 0.08 }, 0.8);

        const flow = gsap.timeline({ paused: true, repeat: -1 });
        pulses.forEach((dot, i) => {
          flow.to(
            dot,
            {
              duration: 1.6,
              ease: "none",
              motionPath: { path: edges[i], align: edges[i], alignOrigin: [0.5, 0.5] },
            },
            i * 0.3,
          );
        });

        ScrollTrigger.create({
          trigger: svg,
          start: "bottom 60%",
          end: "bottom top",
          onToggle: (self) => {
            gsap.set(pulses, { autoAlpha: self.isActive ? 1 : 0 });
            if (self.isActive) flow.play();
            else flow.pause();
          },
        });
      });
    },
    { scope: svgRef },
  );

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${s.viewBox.w} ${s.viewBox.h}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className="hidden h-auto w-full font-mono md:block"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={titleId}>{s.title}</title>
        <desc id={descId}>{s.desc}</desc>

        {s.annotations.map((a) => (
          <text
            key={a.text}
            x={a.x}
            y={a.y}
            textAnchor="middle"
            className="fill-ink-faint"
            style={{ fontSize: 9.5, letterSpacing: 0.4 }}
          >
            {a.text}
          </text>
        ))}

        {s.connectors.map((c) => (
          <path
            key={`edge-${c.from}-${c.to}`}
            data-edge
            d={pathFor(s, c)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        ))}

        {s.connectors.map((c) => {
          const tip = tipFor(s, c);
          return (
            <circle
              key={`tip-${c.from}-${c.to}`}
              data-tip
              cx={tip.x}
              cy={tip.y}
              r={1.6}
              fill="var(--accent)"
            />
          );
        })}

        {s.boxes.map((b) => (
          <g key={b.id} data-box>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill="var(--bg-card)"
              stroke={b.accent ? "var(--accent)" : "var(--ink-muted)"}
              strokeWidth={b.accent ? 1 : 0.75}
              strokeOpacity={b.accent ? 1 : 0.55}
            />
            <text x={b.x + 12} y={b.y + 22} className="fill-ink" style={{ fontSize: 12, fontWeight: 500 }}>
              {b.label}
            </text>
            {b.sub && (
              <text
                x={b.x + 12}
                y={b.y + 38}
                className="fill-ink-faint"
                style={{ fontSize: 10, letterSpacing: 0.3 }}
              >
                {b.sub}
              </text>
            )}
          </g>
        ))}

        {s.connectors.map((c) => (
          <circle
            key={`pulse-${c.from}-${c.to}`}
            data-pulse
            r={2.5}
            fill="var(--accent)"
            style={{ opacity: 0, visibility: "hidden" }}
          />
        ))}
      </svg>

      <MobileStack name={name} />
    </div>
  );
}

function MobileBox({ box, note }: { box: Box; note?: string }) {
  return (
    <div className={box.accent ? "border border-accent bg-bg-card p-3" : "border border-ink-rule bg-bg-card p-3"}>
      <div className="text-[13px] font-medium text-ink">{box.label}</div>
      {box.sub && <div className="mt-1 text-[10.5px] tracking-[0.04em] text-ink-faint">{box.sub}</div>}
      {note && <div className="mt-2 text-[10.5px] tracking-[0.04em] text-accent">{note}</div>}
    </div>
  );
}

function MobileConnector() {
  return <div aria-hidden="true" className="mx-auto my-1.5 h-5 w-px bg-accent opacity-60" />;
}

function MobileStack({ name }: { name: DiagramKey }) {
  const s = SCHEMATICS[name];
  const { clients, core, direct, rest } = mobileLayout(s);

  return (
    <div className="flex flex-col font-mono md:hidden">
      <div className="grid grid-cols-2 gap-2">
        {clients.map((b) => (
          <MobileBox key={b.id} box={b} />
        ))}
      </div>
      <MobileConnector />
      <MobileBox box={core} />
      <MobileConnector />
      <div className="grid grid-cols-2 gap-2">
        {direct.map((b) => (
          <MobileBox key={b.id} box={b} />
        ))}
      </div>
      {rest.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {rest.map(({ box, via }) => (
            <MobileBox key={box.id} box={box} note={`via ${via}`} />
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-[0.04em] text-ink-faint">
        {s.annotations.map((a) => (
          <span key={a.text}>· {a.text}</span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Point `ProjectCard` at the new diagram**

In `components/primitives/ProjectCard.tsx`, replace the imports and the `diagrams` map (lines 1–17) with:

```tsx
import { DEMO_EMAIL, type Project } from "@/lib/projects";
import { Diagram } from "@/components/site/Diagram";
import { DataTable } from "@/components/primitives/DataTable";
import { Ordinal } from "@/components/primitives/Ordinal";
import { StatusBadge } from "@/components/primitives/StatusBadge";
```

Then delete the line `const Diagram = diagrams[project.diagram];` and replace `<Diagram />` with `<Diagram name={project.diagram} />`.

- [ ] **Step 11: Delete the old diagram and verify**

Run: `git rm components/primitives/SystemDiagram.tsx && pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all green.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat(diagrams): scroll-drawn diagrams with traffic pulses; case study data

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Motion primitives, hero and foundation

**Files:**
- Create: `components/motion/Reveal.tsx`, `components/motion/SplitReveal.tsx`, `components/motion/ScrubText.tsx`, `components/motion/Drift.tsx`, `components/motion/Marquee.tsx`, `components/home/Hero.tsx`, `components/home/Foundation.tsx`
- Modify: `components/primitives/Ordinal.tsx`, `components/primitives/SectionRule.tsx`, `app/page.tsx`
- Delete: `components/sections/Masthead.tsx`, `components/sections/Foundation.tsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP` (Task 1); `NEW_PROJECT_HREF` (Task 2).
- Produces:
  - `<Reveal className?>{children}</Reveal>`: div; descendants with `data-reveal` rise in once.
  - `<SplitReveal as?: "h1" | "h2" | "h3" | "p" id? className?>{children}</SplitReveal>`
  - `<ScrubText as?: "p" | "h2" className?>{children}</ScrubText>`
  - `<Drift y={number} fade? className?>{children}</Drift>`
  - `<Marquee items={string[]} className? />`
  - `<Ordinal n dot? className? />` renders lower-case Roman numerals only.
  - `<Hero />`, `<Foundation />` (server components, `data-tone="bone"`).

- [ ] **Step 1: Simplify `components/primitives/Ordinal.tsx`**

```tsx
import { cn } from "@/lib/utils";

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

/** A lower-case Roman numeral in the accent face. Decorative: the adjacent label carries the meaning. */
export function Ordinal({
  n,
  dot = false,
  className,
}: {
  n: number;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cn("font-accent tabular-nums", className)}>
      {ROMAN[n - 1]}
      {dot ? "." : ""}
    </span>
  );
}
```

- [ ] **Step 2: Restyle `components/primitives/SectionRule.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { Ordinal } from "./Ordinal";

interface SectionRuleProps {
  n: number;
  label: string;
  className?: string;
}

/** The section folio: a hairline, the ordinal, the section name. */
export function SectionRule({ n, label, className }: SectionRuleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 self-start border-t border-ink-rule pt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted",
        className,
      )}
    >
      <Ordinal n={n} dot className="text-base normal-case tracking-normal text-accent" />
      <span>{label}</span>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/motion/Reveal.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Descendants marked `data-reveal` rise 48px and fade in once as each enters the viewport. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        for (const el of gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current)) {
          gsap.from(el, {
            y: 48,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        }
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create `components/motion/SplitReveal.tsx`**

```tsx
"use client";

import { createElement, useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * A heading whose lines rise out of masks when it scrolls into view.
 * SplitText re-splits on resize and font load, and keeps an aria-label with
 * the full text so the split lines read as one sentence.
 */
export function SplitReveal({
  as = "h2",
  id,
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return createElement(as, { ref, id, className }, children);
}
```

- [ ] **Step 5: Create `components/motion/ScrubText.tsx`**

```tsx
"use client";

import { createElement, useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/** Lines brighten from faint to full ink as the paragraph crosses the viewport. */
export function ScrubText({
  as = "p",
  className,
  children,
}: {
  as?: "p" | "h2";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.lines,
              { opacity: 0.15 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.4,
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
              },
            ),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return createElement(as, { ref, className }, children);
}
```

- [ ] **Step 6: Create `components/motion/Drift.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Moves its content by `y` px (and optionally fades it) over the first screen of scrolling. */
export function Drift({
  y,
  fade = false,
  className,
  children,
}: {
  y: number;
  fade?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(ref.current, {
          y,
          opacity: fade ? 0.15 : 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: 0, end: "bottom top", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 7: Create `components/motion/Marquee.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Words drifting left, faster while the page scrolls. Screen readers get the list once. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>("[data-track]");
      if (!el || !track) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const setX = gsap.quickSetter(track, "x", "px");
        const onScreen = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top" });
        let x = 0;
        let lastY = window.scrollY;
        const tick = (_time: number, deltaMs: number) => {
          const y = window.scrollY;
          // Base 60px/s, plus up to ~1100px/s while scrolling fast.
          const speed = 60 + Math.min(Math.abs(y - lastY), 80) * 14;
          lastY = y;
          if (!onScreen.isActive) return;
          x = (x - (speed * deltaMs) / 1000) % (track.scrollWidth / 2);
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  const line = items.map((item) => (
    <span key={item} className="flex items-center gap-[0.35em] pr-[0.35em]">
      {item}
      <span className="font-accent text-accent">·</span>
    </span>
  ));

  return (
    <div ref={root} className={cn("overflow-hidden border-y border-ink-rule py-6", className)}>
      <p className="sr-only">{items.join(" · ")}</p>
      <div
        data-track
        aria-hidden="true"
        className="flex w-max whitespace-nowrap text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.035em]"
      >
        {line}
        {line}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Create `components/home/Hero.tsx`**

```tsx
import Link from "next/link";
import type { CSSProperties } from "react";
import { Container } from "@/components/primitives/Container";
import { Drift } from "@/components/motion/Drift";
import { NEW_PROJECT_HREF } from "@/lib/projects";

const line = (n: number) => ({ "--line": n }) as CSSProperties;

/** Chapter B. The headline rises in CSS (no JS for the LCP element) and lifts away on scroll. */
export function Hero() {
  return (
    <section data-tone="bone" className="relative flex min-h-svh flex-col justify-end pb-14 pt-28 md:pb-20">
      <Container>
        <Drift y={-140} fade>
          <div className="flex items-center gap-4">
            <svg aria-hidden="true" viewBox="0 0 64 64" shapeRendering="crispEdges" className="size-10 md:size-14">
              <rect width="64" height="64" fill="var(--ink)" />
              <path d="M8 8 L40 8 L40 40 L8 40 Z M8 8 L8 56 L56 56 L56 40 L40 40 Z" fill="var(--bg)" />
              <rect className="mark-stamp" x="16" y="16" width="16" height="16" fill="var(--accent)" />
            </svg>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Est. 2024
              <span aria-hidden="true" className="mx-2 text-ink-faint">·</span>
              India
            </p>
          </div>

          <h1 className="mt-10 font-accent text-[clamp(3.25rem,12.5vw,12rem)] leading-[0.84] tracking-[-0.035em] md:mt-14">
            <span className="line-mask">
              <span className="line-rise" style={line(0)}>Software</span>
            </span>
            <span className="line-mask">
              <span className="line-rise" style={line(1)}>
                at every <span className="text-accent">corner.</span>
              </span>
            </span>
          </h1>
        </Drift>

        <div className="mt-12 grid gap-8 border-t border-ink-rule pt-6 md:mt-16 md:grid-cols-12 md:items-start">
          <p className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-balance md:col-span-6">
            Corner Software builds software, and <span className="font-extrabold">runs</span> it.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[13px] md:col-span-6 md:justify-end">
            <a href={NEW_PROJECT_HREF} className="inline-flex items-center gap-2 text-accent">
              <span className="link-draw">Start a project</span>
              <span aria-hidden="true">→</span>
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-ink transition-colors duration-150 hover:text-accent"
            >
              <span className="link-draw">See a platform running</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 9: Create `components/home/Foundation.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";

export function Foundation() {
  return (
    <section data-tone="bone" aria-label="Foundation" className="pb-24 pt-32 md:pb-32 md:pt-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={1} label="Foundation" className="md:col-span-3" />
          <div className="md:col-span-9">
            <ScrubText className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
              Corner Software builds the systems small businesses run on every day. A clinic&apos;s
              front desk. A factory&apos;s order book. A café&apos;s counter. A distributor&apos;s
              catalogue.
            </ScrubText>
            <Reveal>
              <p data-reveal className="mt-10 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                Every project is designed, built and kept running by Corsw. Launch is where the work
                starts, not where it ends.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
      <Marquee
        items={["Healthcare", "Manufacturing", "Food service", "Distribution"]}
        className="mt-24 md:mt-36"
      />
    </section>
  );
}
```

- [ ] **Step 10: Wire the new chapters into `app/page.tsx`**

Replace the imports of `Masthead` and `Foundation` with:

```tsx
import { Hero } from "@/components/home/Hero";
import { Foundation } from "@/components/home/Foundation";
```

Replace the returned JSX with:

```tsx
    <main id="content" data-tone-start="bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Foundation />
      <Projects />
      <IndexSection />
      <Manifesto />
      <Contact />
      <Colophon />
    </main>
```

- [ ] **Step 11: Delete the replaced sections and verify**

Run: `git rm components/sections/Masthead.tsx components/sections/Foundation.tsx && pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all green. If lint flags `components/primitives/AccentLine.tsx` or `ThemeToggle.tsx` as unused, leave them; Task 5 deletes them.

- [ ] **Step 12: Check it in the browser**

Run: `pnpm dev`, open `http://localhost:3000`.
Expected: bone page, corner square stamps in, both headline lines rise, the headline lifts and fades while scrolling, the Foundation paragraph brightens line by line, the sector marquee drifts and speeds up with scrolling. With DevTools → Rendering → "prefers-reduced-motion: reduce": everything static and visible. Stop the server.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat(home): hero and foundation chapters with motion primitives

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Pinned work sequence, captures and view transitions

**Files:**
- Create: `components/site/Capture.tsx`, `components/site/Device.tsx`, `components/home/Work.tsx`, `types/react-canary.d.ts`
- Modify: `next.config.ts`, `app/globals.css`, `app/page.tsx`
- Delete: `components/sections/Projects.tsx`

**Interfaces:**
- Consumes: `Project`, `Shot`, `Step` (Task 2); `SplitReveal`, `Ordinal`, `SectionRule` (Task 3).
- Produces: `<Capture shot={Shot} sizes={string} priority? />` (fills its positioned parent); `<Device step={Step} sizes={string} className? />`; `<Work projects={Project[]} />`; view-transition name `capture-<slug>` (Task 6 reuses it).

- [ ] **Step 1: Enable view transitions**

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // React's <ViewTransition> carries a project's capture from the home page
  // into its case study. Browsers without the API navigate instantly.
  experimental: { viewTransition: true },
};

export default nextConfig;
```

Create `types/react-canary.d.ts`:

```ts
// <ViewTransition> ships in the React build Next vendors; its types live in react/canary.
/// <reference types="react/canary" />
```

- [ ] **Step 2: Create `components/site/Capture.tsx`**

```tsx
import Image from "next/image";
import type { Shot } from "@/lib/projects";

/**
 * A product capture filling its positioned parent. Until the file exists the
 * frame shows a labelled placeholder, so pages build and review end to end.
 */
export function Capture({ shot, sizes, priority = false }: { shot: Shot; sizes: string; priority?: boolean }) {
  if (shot.src) {
    return <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />;
  }

  return (
    <div role="img" aria-label={shot.alt} className="absolute inset-0 flex flex-col gap-3 bg-bg-card p-4 md:p-6">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
        Capture pending · {shot.alt}
      </span>
      <div aria-hidden="true" className="grid flex-1 grid-cols-6 grid-rows-4 gap-2">
        <div className="col-span-2 row-span-4 bg-ink-rule" />
        <div className="col-span-4 bg-ink-rule" />
        <div className="col-span-2 row-span-3 bg-ink-rule" />
        <div className="col-span-2 row-span-3 bg-accent opacity-25" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/site/Device.tsx`**

```tsx
import { Capture } from "@/components/site/Capture";
import type { Step } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** A capture framed as the screen it was taken on: a laptop display or a phone. */
export function Device({ step, sizes, className }: { step: Step; sizes: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-ink-rule bg-bg",
        step.device === "phone" ? "aspect-[390/844]" : "aspect-[16/10]",
        className,
      )}
    >
      <Capture shot={step} sizes={sizes} />
    </div>
  );
}
```

- [ ] **Step 4: Append the live-layout rules to `app/globals.css`**

Insert above the `@media (prefers-reduced-motion: reduce)` block:

```css
/* Work sequence (components/home/Work.tsx): the rail shows and the articles
   stack only while the pinned timeline runs. Without it they sit in flow. */
[data-rail] {
  display: none;
}

[data-live] [data-rail] {
  display: flex;
}

[data-live] [data-work-item] {
  position: absolute;
  inset: 0;
}

::view-transition-group(*) {
  animation-duration: 650ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```

And inside the existing `@media (prefers-reduced-motion: reduce)` block, after the `*` rule, add:

```css
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
```

- [ ] **Step 5: Create `components/home/Work.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useRef, ViewTransition } from "react";
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { SectionRule } from "@/components/primitives/SectionRule";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { Capture } from "@/components/site/Capture";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

/**
 * Chapter A. Desktop with motion: the stage pins and plays the projects in
 * turn (the capture opens, the name gains weight, the rail tracks progress).
 * Phones and reduced motion: the same articles in normal flow.
 */
export function Work({ projects }: { projects: Project[] }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        el.setAttribute("data-live", "");
        const items = gsap.utils.toArray<HTMLElement>("[data-work-item]", el);
        const rail = gsap.utils.toArray<HTMLElement>("[data-rail-item]", el);
        const setActive = (index: number) =>
          rail.forEach((r, j) => r.toggleAttribute("data-active", j === index));
        setActive(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            pin: true,
            start: "top top",
            end: () => `+=${window.innerHeight * items.length}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
          },
        });

        items.forEach((item, i) => {
          const q = gsap.utils.selector(item);
          if (i > 0) tl.fromTo(item, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, i - 0.12);
          tl.fromTo(q("[data-frame]"), { clipPath: "inset(20% 26% 20% 26%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55 }, i)
            .fromTo(q("[data-media]"), { scale: 1.3 }, { scale: 1, duration: 0.55 }, i)
            .fromTo(q("[data-name]"), { fontWeight: 400 }, { fontWeight: 800, duration: 0.55 }, i)
            .fromTo(q("[data-meta]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.05 }, i + 0.3);
          if (i < items.length - 1) tl.to(item, { autoAlpha: 0, duration: 0.12 }, i + 0.88);
        });
        // Hold the last project open before the pin releases.
        tl.to({}, { duration: 0.45 });

        return () => el.removeAttribute("data-live");
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        for (const frame of gsap.utils.toArray<HTMLElement>("[data-frame]", el)) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(12% 12% 12% 12%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top 90%", end: "top 40%", scrub: true },
            },
          );
        }
      });
    },
    { scope: stage },
  );

  return (
    <section data-tone="ink" id="work" aria-labelledby="work-title" className="pt-32 md:pt-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={2} label="Work" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="work-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              Selected <span className="font-accent text-accent">work.</span>
            </SplitReveal>
            <p className="mt-8 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
              Software Corsw designs, builds and operates for businesses in healthcare,
              manufacturing, food service and distribution.
            </p>
          </div>
        </div>
      </Container>

      <div ref={stage} className="relative mt-20 md:mt-28 md:h-svh">
        <ol
          data-rail
          aria-hidden="true"
          className="absolute left-8 top-1/2 z-10 -translate-y-1/2 flex-col gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-faint lg:left-16"
        >
          {projects.map((p) => (
            <li key={p.slug} data-rail-item className="transition-colors duration-300 data-active:text-ink">
              <Ordinal n={p.n} dot className="mr-2 text-[15px] normal-case tracking-normal text-accent" />
              {p.name}
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-24 pb-8 md:gap-0 md:pb-0">
          {projects.map((p, i) => (
            <article key={p.slug} data-work-item aria-labelledby={`work-${p.slug}`} className="flex items-center">
              <Container className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-9 md:col-start-4">
                  <Link href={`/work/${p.slug}`} aria-label={`${p.name} case study`} className="block">
                    <div
                      data-frame
                      className="relative aspect-[16/10] w-full overflow-hidden border border-ink-rule bg-bg-card md:max-w-[calc((100svh-15rem)*1.6)]"
                    >
                      <ViewTransition name={`capture-${p.slug}`}>
                        <div data-media className="absolute inset-0">
                          <Capture shot={p.capture} sizes="(min-width: 768px) 70vw, 100vw" priority={i === 0} />
                        </div>
                      </ViewTransition>
                    </div>
                  </Link>

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                    <h3
                      id={`work-${p.slug}`}
                      data-name
                      className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.04em]"
                    >
                      <Link href={`/work/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <div data-meta className="pb-2">
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <p data-meta className="mt-3 max-w-[46ch] text-[17px] leading-[1.5] text-ink-muted">
                    {p.tagline}
                  </p>
                  <Link
                    data-meta
                    href={`/work/${p.slug}`}
                    className="mt-5 inline-flex items-center gap-2 font-mono text-[13px] text-accent"
                  >
                    <span className="link-draw">Read the case study</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Container>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Swap `Projects` for `Work` in `app/page.tsx`**

Replace `import { Projects } from "@/components/sections/Projects";` with `import { Work } from "@/components/home/Work";` and replace `<Projects />` with `<Work projects={projects} />` (`projects` is already imported from `@/lib/projects`).

- [ ] **Step 7: Delete the old section and verify**

Run: `git rm components/sections/Projects.tsx && pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all green. The `/work/<slug>` links 404 until Task 6.

- [ ] **Step 8: Check it in the browser**

Run: `pnpm dev`, open `http://localhost:3000` at 1440×900.
Expected: the page scrubs from bone to ink as Work enters; the stage pins; each project's frame opens from a small window, its name thickens, tagline and status rise; the rail highlights the current project; the pin releases after the fourth. At 390px wide: projects stack, frames open as they scroll in. With reduced motion: projects stack statically, no rail. Stop the server.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(home): pinned work sequence with capture frames and view transition names

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Approach and contact chapters, cleanup, /demo and 404

**Files:**
- Create: `components/home/Built.tsx`, `components/home/Contact.tsx`, `app/not-found.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx`, `app/demo/page.tsx`, `package.json` (via pnpm)
- Delete: `components/sections/{Index,Manifesto,Contact,Colophon}.tsx`, `components/primitives/{AccentLine,ThemeToggle,MotionProvider}.tsx`, `lib/motion.ts`

**Interfaces:**
- Consumes: `Diagram` (Task 2); `Reveal`, `SplitReveal`, `Ordinal`, `SectionRule` (Task 3); `Footer` (Task 1); `ProjectCard` (existing).
- Produces: `<Built />`, `<Contact />` (server, `data-tone="carbon"`); final home page; framer-motion gone.

- [ ] **Step 1: Create `components/home/Built.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Diagram } from "@/components/site/Diagram";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

const principles = [
  "Start from how the business actually runs.",
  "Build for daily use, on the devices people already carry.",
  "Stay after launch: hosting, updates and support.",
  "Clear scope and plain communication throughout.",
];

/** Chapter C. The approach beside a system as it is actually deployed. */
export function Built() {
  return (
    <section data-tone="carbon" aria-labelledby="built-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={3} label="Approach" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="built-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              How Corsw <span className="font-mono font-medium tracking-[-0.07em] text-accent">works.</span>
            </SplitReveal>
          </div>
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-10">
          <figure className="border border-ink-rule bg-bg-card p-5 md:p-7 lg:col-span-7 lg:self-start">
            <figcaption className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
              <span>System diagram</span>
              <span>Ordio</span>
            </figcaption>
            <div className="mt-4">
              <Diagram name="ordio" />
            </div>
          </figure>

          <Reveal className="lg:col-span-5">
            <ol>
              {principles.map((principle, i) => (
                <li
                  key={principle}
                  data-reveal
                  className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-ink-rule py-6 first:pt-0 last:border-b-0"
                >
                  <Ordinal n={i + 1} dot className="text-2xl text-accent" />
                  <span className="text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium leading-[1.35] tracking-[-0.01em] text-balance">
                    {principle}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/home/Contact.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DEMO_EMAIL, NEW_PROJECT_HREF } from "@/lib/projects";

const rows = [
  { label: "Company", value: "Corner Software (Corsw)" },
  { label: "Founded", value: "2024" },
  { label: "Based", value: "India" },
  { label: "Sectors", value: "Healthcare · Manufacturing · Food service · Distribution" },
  { label: "Services", value: "Product design · Engineering · Hosting and support" },
];

/** Chapter C, closing: the company at a glance, then the one way to start. */
export function Contact() {
  return (
    <section data-tone="carbon" id="contact" aria-labelledby="contact-title" className="pb-24 pt-8 md:pb-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={4} label="Company" className="md:col-span-3" />
          <Reveal className="md:col-span-9">
            <dl className="font-mono text-[13px] leading-[1.7] tabular-nums">
              {rows.map((row) => (
                <div
                  key={row.label}
                  data-reveal
                  className="grid grid-cols-12 gap-4 border-t border-ink-rule py-4 first:border-t-0 first:pt-0"
                >
                  <dt className="col-span-12 uppercase tracking-[0.18em] text-ink-faint md:col-span-3">{row.label}</dt>
                  <dd className="col-span-12 text-ink md:col-span-9">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-32 grid gap-10 md:mt-44 md:grid-cols-12">
          <SectionRule n={5} label="Contact" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="contact-title"
              className="text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-balance"
            >
              Start a <span className="font-mono font-medium tracking-[-0.08em] text-accent">project.</span>
            </SplitReveal>

            <Reveal>
              <p data-reveal className="mt-12 max-w-prose text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-ink text-balance">
                Corsw designs, builds and operates software for businesses that rely on it every day.
              </p>
              <p data-reveal className="mt-6 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                Share what you run today and where it slows you down. The reply sets out what can be
                built, the timeline and the cost.
              </p>
            </Reveal>

            <a
              href={NEW_PROJECT_HREF}
              className="group mt-16 flex items-center justify-between gap-6 border-y border-ink-rule py-6 text-[clamp(2rem,5vw,4.25rem)] font-normal leading-none tracking-[-0.035em] transition-[font-weight,color] duration-500 hover:font-extrabold hover:text-accent focus-visible:font-extrabold focus-visible:text-accent"
            >
              <span>Start a project</span>
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-3">→</span>
            </a>

            <div className="mt-8 flex flex-col gap-4 font-mono text-[13px] sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <span className="link-draw">See a platform running</span>
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href={`mailto:${DEMO_EMAIL}`}
                className="link-draw break-words tabular-nums text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                {DEMO_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Replace `app/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Foundation } from "@/components/home/Foundation";
import { Work } from "@/components/home/Work";
import { Built } from "@/components/home/Built";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/site/Footer";
import { DEMO_EMAIL, projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Corner Software · Software, built and run.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

const ORG_ID = "https://corsw.in/#organization";

// Only facts stated on the page (Hero, Work, Company, Contact).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Corner Software",
      alternateName: "Corsw",
      url: "https://corsw.in",
      logo: "https://corsw.in/brand/monogram-dark.svg",
      description: "Software, built and run.",
      foundingDate: "2024",
      email: DEMO_EMAIL,
      founder: {
        "@type": "Person",
        name: "Pradyumna Tanksali",
        // A personal profile: it identifies the founder, not the company.
        sameAs: ["https://github.com/PradyumnaTanksali"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://corsw.in/#website",
      name: "Corner Software",
      url: "https://corsw.in",
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "ItemList",
      itemListElement: projects.map((p) => ({
        "@type": "ListItem",
        position: p.n,
        item: {
          "@type": "CreativeWork",
          name: p.name,
          description: p.tagline,
          url: `https://corsw.in/work/${p.slug}`,
          creator: { "@id": ORG_ID },
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main id="content" data-tone-start="bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Foundation />
      <Work projects={projects} />
      <Built />
      <Contact />
      <Footer tone="carbon" />
    </main>
  );
}
```

- [ ] **Step 4: Remove `MotionProvider` from `app/layout.tsx`**

Delete the line `import { MotionProvider } from "@/components/primitives/MotionProvider";` and replace `<MotionProvider>{children}</MotionProvider>` with `{children}`.

- [ ] **Step 5: Replace `app/demo/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { ProjectCard } from "@/components/primitives/ProjectCard";
import { Footer } from "@/components/site/Footer";
import { DEMO_EMAIL, projects } from "@/lib/projects";

const title = "Corsw · Platforms in service";
const description =
  "Arogyam for clinics, StreamLine for manufacturers, Ordio for café counters. Ask to see one running.";
const demoHref = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("Demo request")}`;

// On a wildcard host "/" is rewritten back to this page, so links home are absolute.
const HOME = "https://corsw.in";

// Noindex: the operating projects under a short header, also served at the
// root of every unassigned *.corsw.in subdomain. The homepage is the page that ranks.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/demo" },
  robots: { index: false, follow: true },
  // Setting openGraph/twitter here replaces the root's, so the image is named explicitly.
  openGraph: {
    title,
    description,
    url: "/demo",
    siteName: "Corner Software",
    type: "website",
    images: "/opengraph-image",
  },
  twitter: { card: "summary_large_image", title, description, images: "/opengraph-image" },
};

export default function DemoPage() {
  const operating = projects.filter((p) => p.status === "operating");

  return (
    <main id="content" data-tone-start="ink">
      <header data-tone="ink" className="pt-28 md:pt-36">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            <a href={HOME} className="transition-colors duration-150 hover:text-ink">
              Corner Software
            </a>
            <span aria-hidden="true" className="mx-3 text-ink-faint">·</span>
            Demo
          </p>

          <h1 className="mt-12 text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-balance md:mt-16">
            <span className="line-mask">
              <span className="line-rise">
                Platforms in <span className="font-accent font-normal text-accent">service.</span>
              </span>
            </span>
          </h1>

          <div className="mt-12 flex flex-col gap-6 border-t border-ink-rule pt-8 sm:flex-row sm:items-center sm:gap-10 md:mt-16">
            <a
              href={demoHref}
              className="inline-flex items-center justify-between gap-3 border border-accent px-5 py-3 font-mono text-[13px] text-accent transition-colors duration-150 hover:bg-accent hover:text-bg sm:justify-start"
            >
              Ask for a demo <span aria-hidden="true">→</span>
            </a>
            <a
              href={HOME}
              className="inline-flex items-center gap-2 font-mono text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              <span className="link-draw">Everything Corsw builds</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Container>
      </header>

      <section data-tone="ink" aria-labelledby="platforms" className="pb-20 pt-16 md:pb-28 md:pt-24">
        <Container>
          {/* Card taglines are h3; this keeps the outline h1 → h2 → h3. */}
          <h2 id="platforms" className="sr-only">Platforms in service</h2>
          {operating.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Container>
      </section>

      <section data-tone="ink" className="border-t border-ink-rule py-24 md:py-32">
        <Container className="text-center">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1] tracking-[-0.03em] text-balance">
            See one running.
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink-muted">
            A walk through a live tenant: the operator&apos;s screens, not slides. Name the platform
            in the subject line, or describe what you would like built.
          </p>
          <a
            href={demoHref}
            className="link-draw mt-10 inline-block break-words font-mono text-[15px] tabular-nums text-ink transition-colors duration-150 hover:text-accent"
          >
            {DEMO_EMAIL}
          </a>
        </Container>
      </section>

      <Footer tone="ink" />
    </main>
  );
}
```

- [ ] **Step 6: Create `app/not-found.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/primitives/Container";

export default function NotFound() {
  return (
    <main id="content" data-tone-start="ink">
      <section data-tone="ink" className="flex min-h-svh flex-col justify-center pt-14">
        <Container>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">Not found</p>
          <h1 className="mt-6 text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-balance">
            <span className="line-mask">
              <span className="line-rise">
                Nothing at this <span className="font-accent font-normal text-accent">corner.</span>
              </span>
            </span>
          </h1>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 font-mono text-[13px] text-ink-muted transition-colors duration-150 hover:text-ink"
          >
            <span className="link-draw">Back to Corner Software</span>
            <span aria-hidden="true">→</span>
          </Link>
        </Container>
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Delete the old code and framer-motion**

Run:

```bash
git rm components/sections/Index.tsx components/sections/Manifesto.tsx components/sections/Contact.tsx components/sections/Colophon.tsx components/primitives/AccentLine.tsx components/primitives/ThemeToggle.tsx components/primitives/MotionProvider.tsx lib/motion.ts
pnpm remove framer-motion
grep -rn "framer-motion\|schematic:\|ThemeToggle\|lib/motion" app components lib || echo CLEAN
```

Expected: `CLEAN`.

- [ ] **Step 8: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all green.

- [ ] **Step 9: Check it in the browser**

Run: `pnpm dev`. Open `/`: after Work the page scrubs to carbon with the dot grid; the Ordio diagram assembles and dots run along connectors; principles rise; company rows rise; the big `Start a project →` thickens and turns accent on hover. Open `/demo` and `/nope`: ink pages, readable. Stop the server.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(home): approach and contact chapters; restyle demo and 404; drop framer-motion

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Case study pages

**Files:**
- Create: `app/work/[slug]/page.tsx`, `components/work/CaseHero.tsx`, `components/work/Business.tsx`, `components/work/Walkthrough.tsx`, `components/work/Architecture.tsx`, `components/work/NextProject.tsx`
- Modify: `app/globals.css`, `app/sitemap.ts`

**Interfaces:**
- Consumes: `Project`, `projects`, `DEMO_EMAIL` (Task 2); `Capture`, `Device`, view-transition name `capture-<slug>` (Task 4); `Diagram` (Task 2); `ScrubText`, `SplitReveal`, `Reveal` (Task 3); `DataTable`, `StatusBadge`, `Ordinal`, `SectionRule`, `Container`; `Footer` (Task 1).
- Produces: static routes `/work/arogyam`, `/work/streamline`, `/work/ordio`, `/work/ssc`.

- [ ] **Step 1: Append the walkthrough live rules to `app/globals.css`**

Insert directly after the `[data-live] [data-work-item]` rule:

```css
/* Walkthrough (components/work/Walkthrough.tsx): one sticky device swaps
   screens while live; otherwise each step shows its own device inline. */
[data-walk-stage] {
  display: none;
}

[data-live] [data-walk-stage] {
  display: block;
}

[data-live] [data-inline-device] {
  display: none;
}

[data-step] {
  transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

[data-live] [data-step]:not([data-active]) {
  opacity: 0.35;
}
```

- [ ] **Step 2: Create `components/work/CaseHero.tsx`**

```tsx
import { ViewTransition } from "react";
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { Capture } from "@/components/site/Capture";
import type { Project } from "@/lib/projects";

export function CaseHero({ project }: { project: Project }) {
  const sector = project.table.find((row) => row.label === "SECTOR")?.value;

  return (
    <section data-tone="ink" className="pt-28 md:pt-36">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <p className="flex items-baseline gap-3">
            <Ordinal n={project.n} dot className="text-[15px] normal-case tracking-normal text-accent" />
            <span>{sector}</span>
          </p>
          <StatusBadge status={project.status} />
        </div>
        <h1 className="mt-8 text-[clamp(3.5rem,13vw,12rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
          <span className="line-mask">
            <span className="line-rise">{project.name}</span>
          </span>
        </h1>
        <p className="mt-8 max-w-[28ch] text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.025em] text-balance">
          {project.tagline}
        </p>
      </Container>

      <div className="mt-16 px-5 md:mt-24 md:px-10">
        <div className="relative mx-auto aspect-[16/10] max-w-[1440px] overflow-hidden border border-ink-rule bg-bg-card">
          <ViewTransition name={`capture-${project.slug}`}>
            <div className="absolute inset-0">
              <Capture shot={project.capture} sizes="100vw" priority />
            </div>
          </ViewTransition>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/work/Business.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";
import type { Project } from "@/lib/projects";

export function Business({ project }: { project: Project }) {
  const [problem, answer] = project.business;

  return (
    <section data-tone="bone" aria-label="The business" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={1} label="The business" className="md:col-span-3" />
          <div className="md:col-span-9">
            <ScrubText className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
              {problem}
            </ScrubText>
            <Reveal>
              <p data-reveal className="mt-10 max-w-prose text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-ink-muted text-balance">
                {answer}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/work/Walkthrough.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { Container } from "@/components/primitives/Container";
import { Ordinal } from "@/components/primitives/Ordinal";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Device } from "@/components/site/Device";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

/**
 * Desktop with motion: one sticky frame swaps screens as each step's caption
 * crosses the middle of the viewport. Otherwise every step shows its own
 * device inline.
 */
export function Walkthrough({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        el.setAttribute("data-live", "");
        const screens = gsap.utils.toArray<HTMLElement>("[data-screen]", el);
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
        const show = (index: number) => {
          gsap.to(screens, { autoAlpha: (j: number) => (j === index ? 1 : 0), duration: 0.5, overwrite: true });
          steps.forEach((s, j) => s.toggleAttribute("data-active", j === index));
        };
        gsap.set(screens, { autoAlpha: (j: number) => (j === 0 ? 1 : 0) });
        steps[0]?.setAttribute("data-active", "");
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              if (self.isActive) show(i);
            },
          });
        });
        return () => {
          el.removeAttribute("data-live");
          steps.forEach((s) => s.removeAttribute("data-active"));
        };
      });
    },
    { scope: root },
  );

  return (
    <section data-tone="ink" aria-labelledby="walk-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={2} label="In use" className="md:col-span-3" />
          <SplitReveal
            id="walk-title"
            className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance md:col-span-9"
          >
            How it <span className="font-accent text-accent">runs.</span>
          </SplitReveal>
        </div>

        <div ref={root} className="mt-20 grid gap-4 md:mt-28 md:grid-cols-12 md:gap-10">
          <div data-walk-stage className="md:col-span-7">
            <div className="sticky top-24 aspect-[5/4] border border-ink-rule bg-bg-card">
              {project.walkthrough.map((step) => (
                <div
                  key={step.alt}
                  data-screen
                  className="absolute inset-0 flex items-center justify-center p-8 lg:p-12"
                >
                  <Device
                    step={step}
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className={step.device === "phone" ? "h-full" : "w-full"}
                  />
                </div>
              ))}
            </div>
          </div>

          <ol className="md:col-span-5">
            {project.walkthrough.map((step, i) => (
              <li
                key={step.alt}
                data-step
                className="flex flex-col gap-6 border-t border-ink-rule py-10 md:min-h-[70svh] md:justify-center md:border-t-0"
              >
                <div data-inline-device>
                  <Device
                    step={step}
                    sizes="100vw"
                    className={step.device === "phone" ? "mx-auto w-full max-w-[280px]" : "w-full"}
                  />
                </div>
                <Ordinal n={i + 1} dot className="text-2xl text-accent" />
                <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance">
                  {step.caption}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Create `components/work/Architecture.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import { DataTable } from "@/components/primitives/DataTable";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Diagram } from "@/components/site/Diagram";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DEMO_EMAIL, type Project } from "@/lib/projects";

export function Architecture({ project }: { project: Project }) {
  return (
    <section data-tone="carbon" aria-labelledby="arch-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={3} label="Architecture" className="md:col-span-3" />
          <SplitReveal
            id="arch-title"
            className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance md:col-span-9"
          >
            How it is <span className="font-mono font-medium tracking-[-0.07em] text-accent">built.</span>
          </SplitReveal>
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-10">
          <figure className="border border-ink-rule bg-bg-card p-5 md:p-7 lg:col-span-7 lg:self-start">
            <figcaption className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
              <span>System diagram</span>
              <span className="tabular-nums">{project.diagramLabel}</span>
            </figcaption>
            <div className="mt-4">
              <Diagram name={project.diagram} />
            </div>
          </figure>

          <div className="lg:col-span-5">
            <Reveal>
              {project.description.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} data-reveal className="mb-5 text-[17px] leading-[1.65] text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </Reveal>
            <div className="mt-8">
              <DataTable caption={`${project.name} at a glance`} rows={project.table} />
            </div>
            {project.status === "operating" && (
              <a
                href={`mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(`Demo request — ${project.name}`)}`}
                className="mt-10 inline-flex items-center justify-between gap-3 border border-accent px-5 py-3 font-mono text-[13px] text-accent transition-colors duration-150 hover:bg-accent hover:text-bg"
              >
                Ask for a demo <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Create `components/work/NextProject.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import type { Project } from "@/lib/projects";

export function NextProject({ project }: { project: Project }) {
  return (
    <section data-tone="ink" aria-label="Next project" className="border-t border-ink-rule">
      <Link href={`/work/${project.slug}`} className="group block">
        <Container className="py-24 md:py-40">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            Next project <span aria-hidden="true">→</span>
          </p>
          <p className="mt-6 text-[clamp(3.5rem,12vw,11rem)] font-normal leading-[0.85] tracking-[-0.05em] transition-[font-weight,color] duration-700 group-hover:font-extrabold group-hover:text-accent group-focus-visible:font-extrabold group-focus-visible:text-accent">
            {project.name}
          </p>
          <p className="mt-6 max-w-[40ch] text-lg leading-[1.5] text-ink-muted">{project.tagline}</p>
        </Container>
      </Link>
    </section>
  );
}
```

- [ ] **Step 7: Create `app/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Architecture } from "@/components/work/Architecture";
import { Business } from "@/components/work/Business";
import { CaseHero } from "@/components/work/CaseHero";
import { NextProject } from "@/components/work/NextProject";
import { Walkthrough } from "@/components/work/Walkthrough";
import { Footer } from "@/components/site/Footer";
import { projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} · Corner Software`,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.tagline,
    url: `https://corsw.in/work/${project.slug}`,
    creator: { "@type": "Organization", "@id": "https://corsw.in/#organization", name: "Corner Software" },
  };

  return (
    <main id="content" data-tone-start="ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CaseHero project={project} />
      <Business project={project} />
      <Walkthrough project={project} />
      <Architecture project={project} />
      <NextProject project={next} />
      <Footer tone="ink" />
    </main>
  );
}
```

- [ ] **Step 8: List the case studies in `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

// ponytail: no lastModified (a build timestamp would be a lie).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://corsw.in" },
    ...projects.map((p) => ({ url: `https://corsw.in/work/${p.slug}` })),
  ];
}
```

- [ ] **Step 9: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all green; the build output lists `/work/[slug]` with the four prerendered paths.

- [ ] **Step 10: Check it in the browser**

Run: `pnpm dev`. On `/` click the first project's capture: in Chrome the frame morphs into the case study hero. On `/work/ordio`: ink hero, bone business with brightening lines, walkthrough with one sticky frame swapping four screens (placeholders), carbon architecture with the Ordio diagram assembling, `Ask for a demo →`, `Next project` SSC. `/work/ssc` has no demo button. At 390px wide every step shows its own device. Stop the server.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(work): case study pages with walkthrough, architecture and next project

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Open Graph image and the site's law documents

**Files:**
- Modify: `app/opengraph-image.tsx`, `DESIGN.md`, `CLAUDE.md`, `BRIEF.md`, `PRODUCT.md`

**Interfaces:**
- Consumes: everything built in Tasks 1–6 (the docs describe it).
- Produces: documents future sessions obey.

- [ ] **Step 1: Replace `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const alt = "Corner Software · Software at every corner.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERIF_TEXT = "Software at every corner.";
const SANS_TEXT = "Corner Software builds software, and runs it.";
const MONO_TEXT = "CORNER SOFTWARE · EST. 2024 · INDIA";

async function loadGoogleFont(family: string, axes: string, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axes}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { cache: "force-cache" })).text();
  const resource = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!resource) {
    throw new Error(`Could not resolve font face for ${family}`);
  }
  const response = await fetch(resource[1], { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Could not load font data for ${family}`);
  }
  return response.arrayBuffer();
}

export default async function OpengraphImage() {
  const [garamond, schibsted, mono] = await Promise.all([
    loadGoogleFont("EB Garamond", "ital,wght@1,400", SERIF_TEXT),
    loadGoogleFont("Schibsted Grotesk", "wght@600", SANS_TEXT),
    loadGoogleFont("JetBrains Mono", "wght@400", MONO_TEXT),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ECE6DA",
          color: "#141310",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: "#141310", position: "relative", display: "flex" }}>
            <div style={{ width: 20, height: 20, background: "#ECE6DA", position: "absolute", top: 5, left: 5 }} />
            <div style={{ width: 10, height: 10, background: "#A8341E", position: "absolute", top: 10, left: 10 }} />
          </div>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 16, letterSpacing: "0.22em", color: "#45423C" }}>
            CORNER SOFTWARE · EST. 2024 · INDIA
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            fontFamily: "EB Garamond",
            fontStyle: "italic",
            fontSize: 132,
            lineHeight: 0.86,
            letterSpacing: "-0.03em",
          }}
        >
          <span>Software</span>
          <span style={{ display: "flex", gap: 28 }}>
            <span>at every</span>
            <span style={{ color: "#A8341E" }}>corner.</span>
          </span>
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid #D3CBBD",
            display: "flex",
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Corner Software builds software, and runs it.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "EB Garamond", data: garamond, weight: 400, style: "italic" },
        { name: "Schibsted Grotesk", data: schibsted, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
```

- [ ] **Step 2: Rewrite `DESIGN.md`**

Replace the whole file. It must contain, in this order, with the values from the code (copy them, do not invent):
1. Title `# Design System: Corner Software` and a one-paragraph pointer: `PRODUCT.md` is truth, `BRIEF.md` is structure and copy.
2. `## Overview`: North Star "The Issue, the Press and the Drawing": one identity in three chapters the page scrolls through (bone paper issue, ink press, carbon drawing), motion as proof of craft; the old Paper/Schematic toggle is gone and survives as chapters.
3. `## Chapters`: the token table from `lib/tones.ts` (all nine roles × three tones, exact hex), the rule that components read roles only, the `data-tone-start` / `data-tone` / `tones-live` mechanism, the textures (column grid on bone, dot grid on carbon), and the AA floor enforced by `lib/tones.test.mjs`.
4. `## Typography`: Schibsted Grotesk variable 400–900 (headlines 600, body 400–500, weight shifts 400→800 on scroll and hover), EB Garamond italic through `font-accent` (hero display, accent words on bone and ink), JetBrains Mono (facts, tables, labels, bar, carbon accent words); the display sizes used (`clamp(3.25rem,12.5vw,12rem)` hero, `clamp(2.75rem,8vw,7.5rem)` section heads, `clamp(3.5rem,13vw,12rem)` case hero); face-swap emphasis rule; `text-balance` and `tabular-nums` rules.
5. `## Layout`: fixed 56px bar (mark + `Start a project →`, no menu), `Container` 1200px with 32/64px gutters, the 3/9 folio split (`SectionRule` in 3 columns, content in 9), section padding 128–176px, the pinned Work stage, the sticky walkthrough frame, breakpoints `md` 768 and `lg` 1024.
6. `## Motion`: stack (GSAP ScrollTrigger/SplitText/MotionPath, Lenis on fine pointers only), the primitives and what each does (`Reveal`, `SplitReveal`, `ScrubText`, `Drift`, `Marquee`, `Diagram`, `Work`, `Walkthrough`, `ToneScroller`), eases (`expo.out` for entrances, `none` for scrubs, CSS `cubic-bezier(0.16, 1, 0.3, 1)` for the hero and view transitions), the `data-live` pattern (desktop layouts that only exist while motion runs), and the rules: every animation inside `useGSAP` + `gsap.matchMedia()`, reduced motion shows final states, no CSS hidden states, hero animates in CSS.
7. `## Components`: Bar, Section folio, Buttons (bordered accent, hover fill), Links (`link-draw`), Capture and Device (placeholder until a file exists), System diagram (desktop SVG + mobile stack; never an edge the desktop lacks), Data rows, Status badge, Footer.
8. `## Do's and Don'ts`: square corners, no shadows or glows, no gradients except the two textures, no icon library, accent marks and never fills at rest (button hover fill excepted), no nav menu, captures only from public pages or seeded demo data.

- [ ] **Step 3: Update `CLAUDE.md`**

Make these exact edits:
- Opening paragraph under `## What this is`: replace the sentence about two switchable themes with: `one identity in three scroll chapters: **bone** (paper, Garamond), **ink** (the work) and **carbon** (diagrams, dot grid). Case studies live at /work/<slug>.`
- `## How we work` item 2: `**Dependencies are fixed:** next, react, react-dom, gsap, @gsap/react, lenis. No others.`
- `## How we work` item 3: `**Every chapter, every change.** Check bone, ink and carbon, desktop and phone, and reduced motion (DevTools → Rendering).`
- `## Code style`: replace the `framer-motion`/`lib/motion.ts` bullets with: `Motion lives in components/motion/* and client sections, always inside useGSAP with gsap.matchMedia() gating (prefers-reduced-motion: no-preference). Import gsap only from @/lib/gsap.`; replace the `schematic:` bullet with: `Colours come from lib/tones.ts roles; a section declares data-tone, a page's main declares data-tone-start.`; keep `font-accent` for Garamond emphasis.
- `## Never`: delete `A contact form, nav menu or sticky header.` and add `A contact form or a nav menu. The fixed bar holds the mark and one call to action only.`; delete `Translate more than 8px in a reveal.`; replace `Gradients, rounded corners, font-bold.` with `Gradients (except the column and dot grid textures), rounded corners, shadows or glows.`; add `Captures from production Arogyam, StreamLine or Ordio. Only public pages or seeded demo data.`
- `## Always`: add `Hidden start states only in gsap.from() on hydration, never in CSS, so content survives without JS.` and `Keep lib/tones.test.mjs, lib/diagrams.test.mjs and lib/projects.test.mjs passing.`

- [ ] **Step 4: Update `BRIEF.md`**

- `## 2. Information architecture`: replace the `/` block with the new order `Bar · Hero (bone) · 1 Foundation (bone) · 2 Work (ink, pinned) · 3 Approach (carbon, diagram) · 4 Company (carbon) · 5 Contact (carbon) · Footer`, add `/work/<slug>` (`Hero (ink) · 1 The business (bone) · 2 In use (ink) · 3 Architecture (carbon) · Next project (ink)`), keep `/demo` and the `proxy.ts` notes unchanged.
- `## 3. Themes`: rename to `## 3. Chapters` and replace the table with the tone table from `lib/tones.ts`; state that there is no visitor toggle.
- `## 4. Copy bank`: Masthead becomes **Hero**: eyebrow `Est. 2024 · India`; H1 `Software at every *corner*.`; line `Corner Software builds software, and **runs** it.`; `Start a project →` · `See a platform running →`. Foundation: no H2; the two paragraphs unchanged; marquee `Healthcare · Manufacturing · Food service · Distribution`. Work: H2 `Selected *work*.`, intro `Software Corsw designs, builds and operates for businesses in healthcare, manufacturing, food service and distribution.`, per project the tagline, status and `Read the case study →`. Approach: H2 `How Corsw **works**.` with the four principles unchanged. Company rows unchanged. Contact: H2 `Start a **project**.`, both paragraphs unchanged. Add **Case studies**: section labels `The business`, `In use` (H2 `How it *runs*.`), `Architecture` (H2 `How it is **built**.`), `Next project →`, `Ask for a demo →` on operating projects; the `business` and walkthrough captions live in `lib/projects.ts` and need owner review before launch. **404**: `Not found` / `Nothing at this *corner*.` / `Back to Corner Software →`.
- `## 5. Hard rules`: under **Never**, replace the nav/sticky header line with `A contact form or nav menu`; replace the gradients line with `Rounded corners, gradients (the column and dot grids excepted), shadows, an icon library`; add `Captures from production systems`. Under **Always**, replace `Both themes checked` with `All three chapters, phone and reduced motion checked`.

- [ ] **Step 5: Update `PRODUCT.md`**

- `## Operating Context`: replace `Visitors can switch between two visual themes; the choice persists per browser.` with `The site scrolls through three chapters (bone, ink, carbon); there is no theme toggle.`
- `## Capabilities and Constraints` first bullet: `Next.js 16.2.4 (App Router, proxy.ts), React 19.2.4, Tailwind CSS 4, GSAP 3.15 (ScrollTrigger, SplitText, MotionPath), Lenis. No other runtime dependencies.`
- `## Brand Commitments`: replace the bullet about keeping both looks as switchable themes with `The two incumbent looks survive as scroll chapters: corsw's editorial world (bone and ink, vermillion, EB Garamond italic) and Modlio's engineered world (carbon, mono, schematic diagrams). The owner chose one identity over the toggle on 2026-09-16.`; replace `Square corners. No gradients. No icon library; arrows are →. No contact form.` with `Square corners. No gradients except the column and dot grid textures. No icon library; arrows are →. No contact form.`
- `## Evidence on Hand`: add `Product captures: SSC from its public site; Arogyam, StreamLine and Ordio only from local seeded demo data, pending.`

- [ ] **Step 6: Check for stale references**

Run: `grep -rn "Schematic theme\|ThemeToggle\|framer\|corsw-theme\|8px\|two themes\|Paper (" CLAUDE.md BRIEF.md DESIGN.md PRODUCT.md README.md AGENTS.md || echo CLEAN`
Expected: `CLEAN`, or only historical mentions that say the toggle was replaced. Fix any other hit.

- [ ] **Step 7: Verify and commit**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all green.

```bash
git add -A
git commit -m "docs: design, brief, product and agent rules for the scroll redesign; bone OG image

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Capture runner and SSC captures

**Files:**
- Create: `scripts/capture.sh`, `scripts/captures.txt`, `public/work/ssc/catalogue.png`, `public/work/ssc/product.png`, `public/work/ssc/quote.png`
- Modify: `lib/projects.ts`

**Interfaces:**
- Consumes: `Shot.src` convention `/work/<slug>/<file>` (Task 2), `lib/projects.test.mjs` capture existence check.
- Produces: real SSC captures on the site; a runner the owner uses for the other three products.

- [ ] **Step 1: Create `scripts/captures.txt`**

```
# slug  file           device  url
# Only public pages or local instances running seeded demo data. Never production
# Arogyam, StreamLine or Ordio (real patients and a real café).
ssc     catalogue.png  laptop  https://ssc.corsw.in/catalogue
ssc     product.png    phone   https://ssc.corsw.in/catalogue/yograj-guggulu
ssc     quote.png      phone   https://ssc.corsw.in/contact?product=Yograj%20Guggulu
```

- [ ] **Step 2: Create `scripts/capture.sh`**

```bash
#!/usr/bin/env bash
# Shoots product captures into public/work/<slug>/ with the Playwright CLI.
# Usage: scripts/capture.sh scripts/captures.txt
# Laptop: 1440x900 viewport. Phone: Playwright's "iPhone 13" device (390x844 @3x).
set -euo pipefail

list="${1:?usage: scripts/capture.sh <captures.txt>}"
npx -y playwright install chromium >/dev/null

while read -r slug file device url; do
  [[ -z "${slug:-}" || "$slug" == \#* ]] && continue
  mkdir -p "public/work/$slug"
  out="public/work/$slug/$file"
  if [[ "$device" == "phone" ]]; then
    npx -y playwright screenshot --browser chromium --device "iPhone 13" --wait-for-timeout 2500 "$url" "$out"
  else
    npx -y playwright screenshot --browser chromium --viewport-size "1440, 900" --wait-for-timeout 2500 "$url" "$out"
  fi
  echo "captured $out"
done < "$list"
```

Run: `chmod +x scripts/capture.sh`

- [ ] **Step 3: Shoot the SSC captures**

Run: `scripts/capture.sh scripts/captures.txt`
Expected: three `captured public/work/ssc/…` lines. Open each PNG and confirm it shows the SSC page (not an error page or a cookie wall). If a file looks wrong, re-run with a longer `--wait-for-timeout`.

- [ ] **Step 4: Point SSC's data at the files**

In `lib/projects.ts`, in the SSC entry, set:
- `capture: { src: "/work/ssc/catalogue.png", alt: "SSC catalogue with search and filters" },`
- walkthrough step 1: add `src: "/work/ssc/catalogue.png",`
- walkthrough step 2: add `src: "/work/ssc/product.png",`
- walkthrough step 3: add `src: "/work/ssc/quote.png",`

- [ ] **Step 5: Verify and commit**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: all green; the capture-exists test covers the three files.

```bash
git add -A
git commit -m "feat(captures): playwright capture runner and SSC captures

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: One batched QA round

**Files:**
- Modify: whatever the round finds (one fix commit).

**Interfaces:**
- Consumes: the finished site.
- Produces: screenshots in the session scratchpad, a list of fixed defects, measured Lighthouse numbers.

- [ ] **Step 1: Production build and server**

Run: `pnpm build && pnpm start` (background), wait for `Ready`.

- [ ] **Step 2: Screenshot every page in one batch**

With the Playwright library from the ordio repo (`/Users/apple/Personal/ordio/node_modules/playwright`), write a throwaway script in the session scratchpad (not the repo) that, for each of `/`, `/work/arogyam`, `/work/streamline`, `/work/ordio`, `/work/ssc`, `/demo`, `/nope`:
- desktop 1440×900 and phone 390×844,
- `reducedMotion: "no-preference"` and `"reduce"`,
- scrolls the page in 600px steps with 400ms pauses to trigger scroll animations, then takes a full-page screenshot, and also a viewport screenshot at 25%, 50% and 75% of the scroll height for `/` desktop no-preference (mid-pin states).

Collect all console errors and failed requests per page.

- [ ] **Step 3: Inspect and list defects**

Look at every screenshot. List defects against the spec: overlapping text, clipped headings, unreadable contrast mid-transition, sections stuck invisible, placeholders overflowing, broken layout at 390px, anything visible under reduced motion that should be static or anything missing. Include every console error.

- [ ] **Step 4: Lighthouse**

Run: `npx -y lighthouse http://localhost:3000/ --preset=perf --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless=new" --output=json --output-path=<scratchpad>/lh-home.json` and the same for `/work/ordio`. Read LCP, CLS, TBT from the JSON.
Expected against budget: LCP < 2.5s, CLS < 0.05. If Chrome is not found, set `CHROME_PATH` to Playwright's chromium binary (`npx playwright install chromium --dry-run` prints its path).

- [ ] **Step 5: Fix everything found in one batch**

Fix each listed defect at its root. Re-run `pnpm typecheck && pnpm lint && pnpm test && pnpm build`, then re-shoot only the affected pages once to confirm. Do not start a second round of new findings.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: QA round for the scroll redesign

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Stop the server.
