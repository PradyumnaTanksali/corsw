# corsw.in Product-Company Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite corsw.in's content so Corner Software reads as a software company with product lines (Arogyam, StreamLine, Ordio) and an engineering practice (SSC as an engagement), with every claim shipped in code.

**Architecture:** Content lives in `lib/projects.ts` (now with `kind: "product" | "engagement"`) and `lib/diagrams.ts` (a new `platform` schematic; Arogyam and Ordio rebuilt to the shipped stack). Detail pages move to `/products/[slug]` and `/engineering/[slug]`, both rendered by one shared `ProjectPage`. Home sections are renamed and rewritten (Statement, Products, Platform, Engineering, Contact); visual design and motion are unchanged.

**Tech Stack:** Next.js 16.2.4 App Router, React 19.2.4 + React Compiler, Tailwind CSS 4, GSAP 3.15 + Lenis (existing), node:test.

**Spec:** `docs/superpowers/specs/2026-09-17-product-company-content-design.md` (all copy is quoted verbatim there and in this plan).

## Global Constraints

- Work in `/Users/apple/Personal/corsw/.claude/worktrees/redesign-scroll` on branch `redesign/scroll`. Never touch the main checkout.
- Done for every task: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` all green.
- Runtime dependencies stay exactly: next, react, react-dom, gsap, @gsap/react, lenis.
- Copy is verbatim from the spec. The company is the subject ("Corner Software…", "Corsw…"), never "we". No counts in prose, no exclamation marks, no emoji, no external links. Banned words: transform, innovative, cutting-edge, world-class, next-generation, leading, best-in-class, seamless.
- Never claim (verified 2026-09-17): Arogyam WhatsApp messaging/automation, ABDM/ABHA, AI/RAG, desktop app, Hindi, India data residency/DPDP, payments, multi-doctor scheduling, multi-location; StreamLine self-serve signup/billing, POS/retail, multi-warehouse, TDS as certified, leave/TDS on by default; Ordio live payments, chains/multi-outlet, delivery/takeaway, reservations, loyalty, inventory; any customer counts, testimonials, uptime, benchmarks, certifications.
- Colours only via role tokens; square corners; no shadows; arrows are `→` with `aria-hidden="true"`; `text-balance` on headings; `tabular-nums` on figures.
- Every JS animation stays inside `useGSAP` + `gsap.matchMedia()`; reuse existing motion components, add no new motion.
- `lib/host.ts`, `proxy.ts`, `lib/host.test.mjs`, `lib/tones.ts` are not modified.
- Conventional Commits ending with `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

## File Structure

| Path | Change |
|---|---|
| `lib/projects.ts` | Rewrite: `kind`, new copy, `projectHref`, `DEMO_HREF` |
| `lib/projects.test.mjs` | Kind, href and extended copy-rule tests |
| `lib/diagrams.ts` | `platform` schematic; Arogyam and Ordio rebuilt |
| `lib/diagrams.test.mjs` | Retired-claims guard |
| `components/work/ProjectPage.tsx` | New shared detail page + `projectMetadata` |
| `app/products/[slug]/page.tsx`, `app/engineering/[slug]/page.tsx` | New thin routes |
| `app/work/[slug]/page.tsx` | Deleted |
| `components/work/{Business,CaseHero,Architecture,NextProject}.tsx` | Kind-aware labels |
| `components/home/Statement.tsx` (from Foundation), `Products.tsx` (from Work), `Platform.tsx` (from Built), `Engineering.tsx` (new), `Contact.tsx`, `Hero.tsx` | Home content |
| `app/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `app/demo/page.tsx`, `components/site/Bar.tsx` | Composition, metadata, links |
| `PRODUCT.md`, `BRIEF.md`, `DESIGN.md`, `CLAUDE.md` | Rules documents |

---

### Task 1: Project data, platform diagram and corrected schematics

**Files:**
- Modify: `lib/projects.ts` (full rewrite), `lib/projects.test.mjs`, `lib/diagrams.ts`, `lib/diagrams.test.mjs`

**Interfaces:**
- Produces: `type ProjectKind = "product" | "engagement"`; `Project.kind: ProjectKind`; `projectHref(p: Pick<Project, "kind" | "slug">): string` → `/products/<slug>` or `/engineering/<slug>`; `DEMO_HREF: string` (mailto, subject "Demo request"); existing `DEMO_EMAIL`, `NEW_PROJECT_HREF`, `Shot`, `Step`, `ProjectStatus` unchanged; `DiagramKey` gains `"platform"`; `SCHEMATICS.platform`.

- [ ] **Step 1: Write the failing diagram guard**

Append to `lib/diagrams.test.mjs`:

```js
test("diagrams name only shipped systems, and the platform schematic exists", () => {
  const retired = /Gupshup|tRPC|\bRust\b|LangGraph|pgvector|ABDM|DPDP|PhonePe|before payment/i;
  for (const [key, s] of Object.entries(SCHEMATICS)) {
    const text = [
      s.title,
      s.desc,
      ...s.boxes.flatMap((b) => [b.label, b.sub ?? ""]),
      ...s.annotations.map((a) => a.text),
    ].join(" ");
    assert.doesNotMatch(text, retired, key);
  }
  assert.ok(SCHEMATICS.platform, "platform schematic");
});
```

- [ ] **Step 2: Write the failing project tests**

In `lib/projects.test.mjs`, change the import line to:

```js
import { projectHref, projects } from "./projects.ts";
```

Replace the existing `copy stays inside the brand rules` test with:

```js
test("copy stays inside the brand rules", () => {
  const banned =
    /\b(transform\w*|innovative|cutting-edge|world-class|next-generation|leading|best-in-class|seamless\w*)\b|!/i;
  for (const p of projects) {
    const texts = [p.tagline, ...p.description, ...p.business, ...p.walkthrough.map((s) => s.caption)];
    for (const text of texts) assert.doesNotMatch(text, banned, text);
  }
});
```

Add after the slug test:

```js
test("every entry is a product or an engagement, with products first-class", () => {
  for (const p of projects) assert.ok(p.kind === "product" || p.kind === "engagement", `${p.name} kind`);
  assert.ok(projects.some((p) => p.kind === "product"));
});

test("products and engagements route to their own sections", () => {
  for (const p of projects) {
    const expected = p.kind === "product" ? `/products/${p.slug}` : `/engineering/${p.slug}`;
    assert.equal(projectHref(p), expected);
  }
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL — `projects.test.mjs` errors on the missing `projectHref` export, and the diagram guard fails on `arogyam` (Gupshup/tRPC/Rust/LangGraph/pgvector/ABDM/DPDP) and `ordio` (PhonePe).

- [ ] **Step 4: Rewrite `lib/projects.ts`**

```ts
import type { DiagramKey } from "./diagrams";

/** Where demo requests and new projects go. One address, named once. */
export const DEMO_EMAIL = "hello@corsw.in";

export const NEW_PROJECT_HREF = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("New project")}`;

export const DEMO_HREF = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("Demo request")}`;

export type ProjectStatus = "operating" | "in-build";

/** Products are Corsw's own platforms; engagements are platforms engineered for a client. */
export type ProjectKind = "product" | "engagement";

/**
 * A product capture. `src` stays unset until the file exists in
 * public/work/<slug>/ (scripts/capture.sh); the site shows a placeholder frame
 * meanwhile. Captures come only from public pages or seeded demo data.
 */
export type Shot = { src?: string; alt: string };

export type Step = Shot & { caption: string; device: "phone" | "laptop" };

export type Project = {
  kind: ProjectKind;
  n: number;
  slug: string;
  name: string;
  status: ProjectStatus;
  tagline: string;
  description: string[];
  /** Detail page opener: what the business runs into, then what the software does about it. */
  business: [string, string];
  diagram: DiagramKey;
  /** Mono slug shown above the schematic, e.g. `arogyam.v2`. */
  diagramLabel: string;
  table: { label: string; value: string }[];
  capture: Shot;
  walkthrough: Step[];
};

/** Products live under /products, engineering engagements under /engineering. */
export function projectHref(p: Pick<Project, "kind" | "slug">): string {
  return `/${p.kind === "product" ? "products" : "engineering"}/${p.slug}`;
}

export const projects: Project[] = [
  {
    kind: "product",
    n: 1,
    slug: "arogyam",
    name: "Arogyam",
    status: "operating",
    tagline: "Practice management and patient engagement for outpatient clinics.",
    description: [
      "Arogyam runs the clinical and front-desk work of a practice: scheduling, patient records, versioned casepapers, intake questionnaires and home-recovery programmes. Patients reach the practice through a private portal, in English or Marathi.",
      "Every practice gets its own website and domain, with consent records and an append-only audit trail from the first visit.",
    ],
    business: [
      "A practice runs on appointments, clinical notes and the care patients continue at home. Kept in diaries, paper files and chat threads, none of it can be searched, audited or followed up.",
      "Arogyam keeps the practice in one system, from the first booking to the last session of a recovery programme.",
    ],
    diagram: "arogyam",
    diagramLabel: "arogyam.v2",
    table: [
      { label: "BUILT FOR", value: "Physiotherapy · Rehabilitation · Outpatient clinics" },
      {
        label: "MODULES",
        value:
          "Scheduling · Patient records · Casepapers · Questionnaires and triage · Recovery programmes · Patient portal · Practice website",
      },
      { label: "LANGUAGES", value: "English · Marathi" },
      { label: "DELIVERY", value: "Multi-tenant · Custom domains" },
    ],
    capture: { alt: "Arogyam front desk with the day's agenda" },
    walkthrough: [
      {
        device: "laptop",
        alt: "Arogyam daily agenda with patient search",
        caption: "The day's agenda, with every patient one search away.",
      },
      {
        device: "laptop",
        alt: "Arogyam casepaper with version history",
        caption: "Casepapers are versioned. An edit adds a version and never overwrites the record.",
      },
      {
        device: "phone",
        alt: "Arogyam patient portal on a phone",
        caption: "Patients complete intake, questionnaires and recovery programmes from one private link.",
      },
      {
        device: "laptop",
        alt: "Arogyam triage results with red flags",
        caption: "Red-flag answers reach the clinician before the visit.",
      },
    ],
  },
  {
    kind: "product",
    n: 2,
    slug: "streamline",
    name: "StreamLine",
    status: "operating",
    tagline: "Operations platform for manufacturers and trading businesses.",
    description: [
      "StreamLine runs the order from quotation to dispatch: sales, purchasing, inventory, production and payroll on one set of records.",
      "Each company works in an isolated workspace with its own roles, audit log and a public website that routes enquiries to sales.",
    ],
    business: [
      "A manufacturer's margin is decided between the quotation and the dispatch note: a revised price, a late purchase order, stock no one counted.",
      "StreamLine records every step of the order, so sales, stores, production and payroll work from the same numbers.",
    ],
    diagram: "streamline",
    diagramLabel: "streamline.v1",
    table: [
      { label: "BUILT FOR", value: "Make-to-order manufacturing · Fabrication · Trading" },
      {
        label: "MODULES",
        value: "Quotations · Invoicing · Purchasing · Inventory · Production · Payroll · Company website",
      },
      { label: "CONTROLS", value: "Roles · Audit log · Module access per company" },
      { label: "DELIVERY", value: "Multi-tenant · Installable app" },
    ],
    capture: { alt: "StreamLine production board" },
    walkthrough: [
      {
        device: "laptop",
        alt: "StreamLine quotation with revisions",
        caption: "Customers review and accept quotations from a secure link, and every revision is kept.",
      },
      {
        device: "laptop",
        alt: "StreamLine production board",
        caption: "The production board follows each job through stages the company defines.",
      },
      {
        device: "laptop",
        alt: "StreamLine stock ledger",
        caption: "Stock on hand is derived from every movement, never typed in.",
      },
      {
        device: "laptop",
        alt: "StreamLine payroll run",
        caption: "Payroll runs produce locked payslips, with PF and ESI calculated.",
      },
    ],
  },
  {
    kind: "product",
    n: 3,
    slug: "ordio",
    name: "Ordio",
    status: "operating",
    tagline: "Ordering, kitchen and guest platform for restaurants and cafés.",
    description: [
      "Guests order from the table on their own phone, with no app and no sign-in. Orders reach a kitchen display and thermal printer, and guests follow their ticket to the table.",
      "Owners run menus, offers, tables, staff and analytics from one dashboard, with GST invoices and a branded website for every outlet.",
    ],
    business: [
      "Service at a busy restaurant is limited by the counter: guests wait to order, and tickets reach the kitchen by hand.",
      "Ordio moves ordering to the guest's phone and every ticket onto the kitchen display, so the floor team serves instead of taking orders.",
    ],
    diagram: "ordio",
    diagramLabel: "ordio.v1",
    table: [
      { label: "BUILT FOR", value: "Restaurants · Cafés · Quick service" },
      {
        label: "MODULES",
        value:
          "QR ordering · Kitchen display · Order tracking · GST invoices · Offers and coupons · Analytics · Outlet website · Display board",
      },
      { label: "ROLES", value: "Owner · Kitchen · Server · Staff" },
      { label: "DELIVERY", value: "Multi-tenant · Installable app" },
    ],
    capture: { alt: "Ordio kitchen display" },
    // No payment step: payments are not live (PRODUCT.md, Not claimable).
    walkthrough: [
      {
        device: "phone",
        alt: "Ordio menu after scanning a table code",
        caption: "Guests scan the table's code and order. No app, no sign-in.",
      },
      {
        device: "phone",
        alt: "Ordio cart with add-ons and a kitchen note",
        caption: "Sizes, add-ons and kitchen notes, with GST calculated on the bill.",
      },
      {
        device: "laptop",
        alt: "Ordio kitchen display",
        caption: "Every ticket moves across the kitchen display, and prints if needed.",
      },
      {
        device: "laptop",
        alt: "Ordio analytics",
        caption: "Analytics break down items, peak hours, kitchen timing and coupons.",
      },
    ],
  },
  {
    kind: "engagement",
    n: 1,
    slug: "ssc",
    name: "SSC",
    // In build: phone, WhatsApp and licence placeholders still block launch (ssc README).
    status: "in-build",
    tagline: "B2B catalogue and quoting for a wholesale distributor.",
    description: [
      "A product catalogue buyers search by name, brand or use, with faceted filters by category and form.",
      "A quote request starts with the product filled in and reaches the sales desk by email or WhatsApp.",
    ],
    business: [
      "A wholesale distributor needed buyers to find products and ask for rates without a phone call for every line.",
      "Corsw designed and built a catalogue and quoting site, with enquiries validated on the server and no lead dropped silently.",
    ],
    diagram: "ssc",
    diagramLabel: "ssc.v1",
    table: [
      { label: "SECTOR", value: "Wholesale distribution" },
      { label: "SCOPE", value: "Catalogue · Search and filters · Quote requests · WhatsApp handoff" },
      { label: "DELIVERY", value: "Website · Installable app" },
    ],
    capture: { src: "/work/ssc/catalogue.png", alt: "SSC catalogue with search and filters" },
    walkthrough: [
      {
        device: "laptop",
        src: "/work/ssc/catalogue.png",
        alt: "SSC catalogue with filters",
        caption: "Search by name, brand or use, and filter by category and form.",
      },
      {
        device: "phone",
        src: "/work/ssc/product.png",
        alt: "SSC product page on a phone",
        caption: "Each product page carries its brand, form and uses.",
      },
      {
        device: "phone",
        src: "/work/ssc/quote.png",
        alt: "SSC quote request with the product filled in",
        caption: "A quote request starts with the product already filled in.",
      },
    ],
  },
];
```

- [ ] **Step 5: Update `lib/diagrams.ts`**

1. Replace the `DiagramKey` line with:

```ts
export type DiagramKey = "platform" | "arogyam" | "streamline" | "ordio" | "ssc";
```

2. Insert this constant directly above `const AROGYAM`:

```ts
const PLATFORM: Schematic = {
  title: "Corsw platform architecture",
  desc:
    "A schematic system diagram of the foundation Corsw products share. Staff apps " +
    "and customer surfaces (portals, sites and QR pages) reach a tenant-scoped " +
    "server that sets the organisation for every request. The server reads and " +
    "writes Postgres under row-level security, appends to audit logs and ledgers, " +
    "and renders documents, which go out by email with sign-in codes.",
  viewBox: { w: 620, h: 360 },
  boxes: [
    { id: "staff", x: 24, y: 32, w: 156, h: 52, label: "Staff apps", sub: "web · installable" },
    { id: "surfaces", x: 24, y: 116, w: 156, h: 52, label: "Customer surfaces", sub: "portals · sites · QR" },
    { id: "server", x: 232, y: 76, w: 156, h: 52, label: "Tenant server", sub: "org scope per request", accent: true },
    { id: "docs", x: 232, y: 168, w: 156, h: 52, label: "Documents", sub: "PDF · invoices" },
    { id: "mail", x: 232, y: 252, w: 156, h: 52, label: "Email", sub: "sign-in · documents" },
    { id: "pg", x: 440, y: 32, w: 156, h: 52, label: "Postgres", sub: "row-level security" },
    { id: "records", x: 440, y: 116, w: 156, h: 52, label: "Audit + ledgers", sub: "append-only" },
  ],
  connectors: [
    { from: "staff", to: "server" },
    { from: "surfaces", to: "server" },
    { from: "server", to: "pg" },
    { from: "server", to: "records" },
    { from: "server", to: "docs", via: [{ x: 310, y: 128 }, { x: 310, y: 194 }] },
    { from: "docs", to: "mail" },
  ],
  annotations: [
    { x: 310, y: 24, text: "one tenant per subdomain or domain" },
    { x: 310, y: 332, text: "money in whole paise" },
    { x: 532, y: 332, text: "nothing overwritten" },
  ],
  mobileClients: ["staff", "surfaces"],
};
```

3. Replace the whole `const AROGYAM: Schematic = { … };` block with:

```ts
const AROGYAM: Schematic = {
  title: "Arogyam architecture",
  desc:
    "A schematic system diagram of Arogyam. Clinic staff on the web and patients " +
    "on a private portal link both reach a tenant-scoped server. The server writes " +
    "Postgres under row-level security per practice and an append-only audit log, " +
    "renders casepaper PDFs in English and Marathi, serves each practice's website " +
    "from content blocks, and signs staff in with one-time codes by email.",
  viewBox: { w: 620, h: 360 },
  boxes: [
    { id: "staff", x: 24, y: 32, w: 156, h: 52, label: "Clinic staff", sub: "web · calendar" },
    { id: "portal", x: 24, y: 116, w: 156, h: 52, label: "Patient portal", sub: "private link" },
    { id: "server", x: 232, y: 76, w: 156, h: 52, label: "Server", sub: "tenant-scoped", accent: true },
    { id: "pdf", x: 232, y: 168, w: 156, h: 52, label: "Casepaper PDFs", sub: "English · Marathi" },
    { id: "site", x: 232, y: 252, w: 156, h: 52, label: "Practice site", sub: "block renderer" },
    { id: "pg", x: 440, y: 32, w: 156, h: 52, label: "Postgres", sub: "RLS per practice" },
    { id: "audit", x: 440, y: 116, w: 156, h: 52, label: "Audit log", sub: "append-only" },
    { id: "mail", x: 440, y: 252, w: 156, h: 52, label: "Email sign-in", sub: "one-time code" },
  ],
  connectors: [
    { from: "staff", to: "server" },
    { from: "portal", to: "server" },
    { from: "server", to: "pg" },
    { from: "server", to: "audit" },
    { from: "server", to: "pdf", via: [{ x: 310, y: 128 }, { x: 310, y: 194 }] },
    { from: "server", to: "site", via: [{ x: 310, y: 128 }, { x: 310, y: 278 }] },
    { from: "server", to: "mail", via: [{ x: 412, y: 102 }, { x: 412, y: 278 }] },
  ],
  annotations: [
    { x: 310, y: 24, text: "each practice on its own domain" },
    { x: 310, y: 332, text: "casepapers never overwritten" },
    { x: 532, y: 332, text: "consent tied to policy version" },
  ],
  mobileClients: ["staff", "portal"],
};
```

4. Replace the whole `const ORDIO: Schematic = { … };` block with:

```ts
const ORDIO: Schematic = {
  title: "Ordio architecture",
  desc:
    "A schematic system diagram of Ordio. A guest phone reached by a table code " +
    "and a kitchen display both talk to org-scoped server actions. The actions " +
    "write to Neon Postgres under row-level security and to the orders table, and " +
    "render A5 PDF receipts shared over WhatsApp or SMS links. The kitchen display " +
    "prints tickets to a thermal printer.",
  viewBox: { w: 620, h: 360 },
  boxes: [
    { id: "guest", x: 24, y: 32, w: 156, h: 52, label: "Guest", sub: "QR scan · phone" },
    { id: "kds", x: 24, y: 116, w: 156, h: 52, label: "Kitchen display", sub: "live tickets" },
    {
      id: "act",
      x: 232,
      y: 76,
      w: 156,
      h: 52,
      label: "Server actions",
      sub: "org-scoped",
      accent: true,
    },
    { id: "printer", x: 232, y: 168, w: 156, h: 52, label: "Kitchen printer", sub: "thermal KOT" },
    { id: "pdf", x: 232, y: 252, w: 156, h: 52, label: "Receipts", sub: "pdf-lib A5" },
    { id: "pg", x: 440, y: 32, w: 156, h: 52, label: "Neon Postgres", sub: "RLS per café" },
    { id: "orders", x: 440, y: 116, w: 156, h: 52, label: "Orders", sub: "status timeline" },
    { id: "hand", x: 440, y: 252, w: 156, h: 52, label: "WhatsApp / SMS", sub: "share links" },
  ],
  connectors: [
    { from: "guest", to: "act" },
    { from: "kds", to: "act" },
    { from: "act", to: "pg" },
    { from: "act", to: "orders" },
    { from: "kds", to: "printer" },
    { from: "act", to: "pdf", via: [{ x: 310, y: 128 }, { x: 310, y: 278 }] },
    { from: "pdf", to: "hand" },
  ],
  annotations: [
    { x: 310, y: 24, text: "one café per subdomain" },
    { x: 310, y: 332, text: "money in integer paise" },
    { x: 532, y: 332, text: "tickets print on the kitchen line" },
  ],
  mobileClients: ["guest", "kds"],
};
```

5. Add `platform: PLATFORM,` as the first entry of `SCHEMATICS`.

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS, 0 failures (1 LAUNCH-gated skip). The existing per-schematic tests now also cover `platform`.

- [ ] **Step 7: Verify and commit**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all green (pages still render at `/work/[slug]` until Task 2).

```bash
git add lib/projects.ts lib/projects.test.mjs lib/diagrams.ts lib/diagrams.test.mjs
git commit -m "feat(content): product and engagement data, platform diagram, shipped-only schematics

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Product and engineering routes

**Files:**
- Create: `components/work/ProjectPage.tsx`, `app/products/[slug]/page.tsx`, `app/engineering/[slug]/page.tsx`
- Delete: `app/work/[slug]/page.tsx`
- Modify: `components/work/Business.tsx`, `components/work/CaseHero.tsx`, `components/work/Architecture.tsx`, `components/work/NextProject.tsx`, `components/home/Work.tsx`, `app/page.tsx`, `app/sitemap.ts`, `app/demo/page.tsx`

**Interfaces:**
- Consumes: `projects`, `projectHref`, `DEMO_HREF`, `Project` (Task 1).
- Produces: `<ProjectPage project={Project} />`; `projectMetadata(project: Project): Metadata`; `<NextProject next={Project | null} />`; routes `/products/{arogyam,streamline,ordio}`, `/engineering/ssc`.

- [ ] **Step 1: Create `components/work/ProjectPage.tsx`**

```tsx
import type { Metadata } from "next";
import { Architecture } from "@/components/work/Architecture";
import { Business } from "@/components/work/Business";
import { CaseHero } from "@/components/work/CaseHero";
import { NextProject } from "@/components/work/NextProject";
import { Walkthrough } from "@/components/work/Walkthrough";
import { Footer } from "@/components/site/Footer";
import { projectHref, projects, type Project } from "@/lib/projects";

const ORG = { "@id": "https://corsw.in/#organization" };

export function projectMetadata(project: Project): Metadata {
  const title = `${project.name} · Corner Software`;
  const { tagline: description } = project;
  const url = projectHref(project);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    // Without these the page shares with the root layout's home title,
    // description and og:url, so every page's card collapses to one.
    openGraph: {
      title,
      description,
      url,
      siteName: "Corner Software",
      type: "article",
      images: "/opengraph-image",
    },
    twitter: { card: "summary_large_image", title, description, images: "/opengraph-image" },
  };
}

/** One detail page for products and engagements; labels differ by kind. */
export function ProjectPage({ project }: { project: Project }) {
  const products = projects.filter((p) => p.kind === "product");
  const next =
    project.kind === "product"
      ? products[(products.findIndex((p) => p.slug === project.slug) + 1) % products.length]
      : null;
  const url = `https://corsw.in${projectHref(project)}`;

  const jsonLd =
    project.kind === "product"
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.name,
          description: project.tagline,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url,
          publisher: ORG,
        }
      : {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          description: project.tagline,
          url,
          creator: ORG,
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
      <NextProject next={next} />
      <Footer tone="ink" />
    </main>
  );
}
```

- [ ] **Step 2: Create `app/products/[slug]/page.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ProjectPage, projectMetadata } from "@/components/work/ProjectPage";
import { projects } from "@/lib/projects";
import { TONES } from "@/lib/tones";

type Props = { params: Promise<{ slug: string }> };

const products = projects.filter((p) => p.kind === "product");

export const dynamicParams = false;

// Opens in the ink chapter, not the root layout's bone default.
export const viewport: Viewport = { themeColor: TONES.ink["--bg"] };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  return product ? projectMetadata(product) : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProjectPage project={product} />;
}
```

- [ ] **Step 3: Create `app/engineering/[slug]/page.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ProjectPage, projectMetadata } from "@/components/work/ProjectPage";
import { projects } from "@/lib/projects";
import { TONES } from "@/lib/tones";

type Props = { params: Promise<{ slug: string }> };

const engagements = projects.filter((p) => p.kind === "engagement");

export const dynamicParams = false;

// Opens in the ink chapter, not the root layout's bone default.
export const viewport: Viewport = { themeColor: TONES.ink["--bg"] };

export function generateStaticParams() {
  return engagements.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engagement = engagements.find((p) => p.slug === slug);
  return engagement ? projectMetadata(engagement) : {};
}

export default async function EngagementPage({ params }: Props) {
  const { slug } = await params;
  const engagement = engagements.find((p) => p.slug === slug);
  if (!engagement) notFound();
  return <ProjectPage project={engagement} />;
}
```

- [ ] **Step 4: Delete the old route**

Run: `git rm -r app/work`

- [ ] **Step 5: Replace `components/work/NextProject.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { projectHref, type Project } from "@/lib/projects";

/** Products cycle to the next product; engagements point back to the products. */
export function NextProject({ next }: { next: Project | null }) {
  const href = next ? projectHref(next) : "/#products";
  const label = next ? "Next product" : "All products";
  const title = next ? next.name : "Products";
  const line = next ? next.tagline : "Arogyam, StreamLine and Ordio.";

  return (
    <section data-tone="ink" aria-label={label} className="border-t border-ink-rule">
      <Link href={href} className="group block">
        <Container className="py-24 md:py-40">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            {label} <span aria-hidden="true">→</span>
          </p>
          <p className="mt-6 text-[clamp(3.5rem,12vw,11rem)] font-normal leading-[0.85] tracking-[-0.05em] transition-[font-weight,color] duration-700 group-hover:font-extrabold group-hover:text-accent group-focus-visible:font-extrabold group-focus-visible:text-accent">
            {title}
          </p>
          <p className="mt-6 max-w-[40ch] text-lg leading-[1.5] text-ink-muted">{line}</p>
        </Container>
      </Link>
    </section>
  );
}
```

- [ ] **Step 6: Kind-aware labels in `Business`, `CaseHero`, `Architecture`**

In `components/work/Business.tsx`, add as the first line inside the function (before `const [problem, answer]`):

```tsx
  const label = project.kind === "product" ? "What it solves" : "The engagement";
```

and replace `aria-label="The business"` with `aria-label={label}` and `label="The business"` with `label={label}`.

In `components/work/CaseHero.tsx`, replace:

```tsx
  const sector = project.table.find((row) => row.label === "SECTOR")?.value;
```

with:

```tsx
  // Products lead with who they are built for; engagements with their sector.
  const sector = project.table.find((row) => row.label === "BUILT FOR" || row.label === "SECTOR")?.value;
```

In `components/work/Architecture.tsx`, replace the condition `project.status === "operating"` with `project.kind === "product" && project.status === "operating"`, and the button text `Ask for a demo` with `Request a demo`.

- [ ] **Step 7: Point every `/work/` link at the new routes**

In `components/home/Work.tsx`:
- change `import type { Project } from "@/lib/projects";` to `import { projectHref, type Project } from "@/lib/projects";`
- change the type to `type WorkProject = Pick<Project, "kind" | "slug" | "n" | "name" | "status" | "tagline" | "capture">;`
- replace each of the three `` href={`/work/${p.slug}`} `` with `href={projectHref(p)}`.

In `app/page.tsx`:
- change the import to `import { DEMO_EMAIL, projectHref, projects } from "@/lib/projects";`
- in the JSON-LD `ItemList`, replace `` url: `https://corsw.in/work/${p.slug}`, `` with `` url: `https://corsw.in${projectHref(p)}`, ``
- in the `<Work … />` props mapping, change `({ slug, n, name, status, tagline, capture }) => ({` to `({ kind, slug, n, name, status, tagline, capture }) => ({` and add `kind,` as the first property of the returned object.

Replace `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { projectHref, projects } from "@/lib/projects";

// ponytail: no lastModified (a build timestamp would be a lie).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://corsw.in" }, ...projects.map((p) => ({ url: `https://corsw.in${projectHref(p)}` }))];
}
```

In `app/demo/page.tsx`:
- change `import { DEMO_EMAIL, projects } from "@/lib/projects";` to `import { DEMO_EMAIL, DEMO_HREF, projects } from "@/lib/projects";`
- delete the line `const demoHref = …;` and replace every `demoHref` with `DEMO_HREF`
- change `projects.filter((p) => p.status === "operating")` to `projects.filter((p) => p.kind === "product" && p.status === "operating")`.

- [ ] **Step 8: Check nothing still links to `/work/`**

Run: `grep -rn '/work/' app components lib | grep -v 'src: "/work/\|public/work'`
Expected: no output.

- [ ] **Step 9: Verify with a production build and smoke checks**

First clear generated route types that still reference the deleted `/work` route (tsc reads `.next/types`): `rm -rf .next/types .next/dev/types`.

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: green; build lists `/products/[slug]` (arogyam, streamline, ordio) and `/engineering/[slug]` (ssc).

Then `pnpm start -p 3150` in the background and:
- `curl -s -o /dev/null -w "%{http_code}" localhost:3150/products/ordio` → `200`; body contains `What it solves`, `Request a demo`, `Next product`, `SoftwareApplication`.
- `curl -s localhost:3150/engineering/ssc` → 200; contains `The engagement`, `All products`, `CreativeWork`; does not contain `Request a demo`.
- `/products/ssc` → `404`; `/engineering/ordio` → `404`; `/work/ordio` → `404`.
- `/sitemap.xml` contains `https://corsw.in/products/arogyam` and `https://corsw.in/engineering/ssc`.
Stop the server.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(routes): product and engineering pages replace /work

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Home content, site-wide copy and metadata

**Files:**
- Rename + modify: `components/home/Foundation.tsx` → `Statement.tsx`, `Work.tsx` → `Products.tsx`, `Built.tsx` → `Platform.tsx`
- Create: `components/home/Engineering.tsx`
- Modify: `components/home/Hero.tsx`, `components/home/Contact.tsx`, `app/page.tsx`, `components/site/Bar.tsx`, `app/layout.tsx`, `app/opengraph-image.tsx`

**Interfaces:**
- Consumes: `DEMO_HREF`, `NEW_PROJECT_HREF`, `DEMO_EMAIL`, `projectHref`, `projects`, `Project` (Task 1); `Diagram name="platform"` (Task 1); existing `SectionRule`, `Ordinal`, `StatusBadge`, `Capture`, `Container`, `Reveal`, `SplitReveal`, `ScrubText`, `Marquee`, `Drift`, `Footer`.
- Produces: `<Statement />`, `<Products products={ProductItem[]} />`, `<Platform />`, `<Engineering engagements={Engagement[]} />`, `<Contact />`; home section ids `products`, `platform`, `engineering`, `contact`.

- [ ] **Step 1: Rename the sections**

Run:

```bash
git mv components/home/Foundation.tsx components/home/Statement.tsx
git mv components/home/Work.tsx components/home/Products.tsx
git mv components/home/Built.tsx components/home/Platform.tsx
```

- [ ] **Step 2: Replace `components/home/Statement.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";

export function Statement() {
  return (
    <section data-tone="bone" aria-label="Overview" className="pb-24 pt-32 md:pb-32 md:pt-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={1} label="Overview" className="md:col-span-3" />
          <div className="md:col-span-9">
            <ScrubText className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
              Every business runs on a handful of systems it cannot afford to lose: the front desk, the
              order book, the kitchen ticket. Corner Software builds those systems as platforms,
              operates them, and improves them for every customer at once.
            </ScrubText>
            <Reveal>
              <p data-reveal className="mt-10 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                Arogyam, StreamLine and Ordio serve healthcare, manufacturing and food service. The same
                engineering practice builds custom platforms for businesses no product fits yet.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
      <Marquee
        items={["Healthcare practices", "Manufacturing", "Trading", "Restaurants and cafés", "Wholesale distribution"]}
        className="mt-24 md:mt-36"
      />
    </section>
  );
}
```

- [ ] **Step 3: Edit `components/home/Products.tsx`**

Make exactly these replacements:
1. `type WorkProject = Pick<` → `type ProductItem = Pick<`
2. `export function Work({ projects }: { projects: WorkProject[] }) {` → `export function Products({ products }: { products: ProductItem[] }) {`
3. Both `{projects.map((p` → `{products.map((p` (the rail and the articles).
4. `<section data-tone="ink" id="work" aria-labelledby="work-title"` → `<section data-tone="ink" id="products" aria-labelledby="products-title"`
5. `<SectionRule n={2} label="Work"` → `<SectionRule n={2} label="Products"`
6. `id="work-title"` → `id="products-title"`
7. `Selected <span className="font-accent text-accent">work.</span>` → `Built for whole <span className="font-accent text-accent">industries.</span>`
8. The intro paragraph text `Software Corsw designs, builds and operates for businesses in healthcare, manufacturing, food service and distribution.` → `Each platform is designed around how an industry works, then configured for every business that runs on it.`
9. Both `` `work-${p.slug}` `` → `` `product-${p.slug}` `` (the article's `aria-labelledby` and the h3 `id`).
10. `<span className="link-draw">Read the case study</span>` → `<span className="link-draw">Explore {p.name}</span>`
11. In the doc comment, `plays the projects in turn` → `plays the products in turn`.

- [ ] **Step 4: Replace `components/home/Platform.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Diagram } from "@/components/site/Diagram";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

const pillars = [
  {
    label: "Isolation",
    copy: "Each customer's data is isolated in the database itself, with row-level security on every business table.",
  },
  {
    label: "History",
    copy: "Critical records are append-only: audit logs, casepaper versions, stock movements and payments are added to, never overwritten.",
  },
  {
    label: "Money",
    copy: "Amounts are stored in whole paise and recalculated on the server, never trusted from the screen.",
  },
  {
    label: "Identity",
    copy: "Every customer runs under its own address, branding and settings, on a subdomain or its own domain.",
  },
  {
    label: "India-ready",
    copy: "GST invoices, PF and ESI, English and Marathi, built into the products that need them.",
  },
  {
    label: "Operated",
    copy: "Hosted and updated by Corsw. One release reaches every customer.",
  },
];

/** Chapter C. The foundation every product shares, beside its diagram. */
export function Platform() {
  return (
    <section data-tone="carbon" id="platform" aria-labelledby="platform-title" className="py-32 md:py-44">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={3} label="Platform" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="platform-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              Built on one <span className="font-mono font-medium tracking-[-0.07em] text-accent">foundation.</span>
            </SplitReveal>
            <p className="mt-8 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
              Every Corsw product runs on the same engineering foundation. Work on security, reliability
              and performance reaches every product and every customer.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-10">
          <figure className="border border-ink-rule bg-bg-card p-5 md:p-7 lg:col-span-7 lg:self-start">
            <figcaption className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
              <span>System diagram</span>
              <span>Platform</span>
            </figcaption>
            <div className="mt-4">
              <Diagram name="platform" />
            </div>
          </figure>

          <Reveal className="lg:col-span-5">
            <dl>
              {pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  data-reveal
                  className="border-b border-ink-rule py-5 first:pt-0 last:border-b-0"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{pillar.label}</dt>
                  <dd className="mt-2 text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.4] tracking-[-0.01em] text-ink text-balance">
                    {pillar.copy}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Create `components/home/Engineering.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { Capture } from "@/components/site/Capture";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { projectHref, type Project } from "@/lib/projects";

const services = ["Product design", "Engineering", "Hosting and operations", "Ongoing support"];

type Engagement = Pick<Project, "kind" | "slug" | "name" | "status" | "tagline" | "capture">;

/** Chapter C. Custom platforms, and the engagements that show them. */
export function Engineering({ engagements }: { engagements: Engagement[] }) {
  return (
    <section
      data-tone="carbon"
      id="engineering"
      aria-labelledby="engineering-title"
      className="pb-32 pt-8 md:pb-44"
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={4} label="Engineering" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="engineering-title"
              className="text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-balance"
            >
              Custom platforms. Same{" "}
              <span className="font-mono font-medium tracking-[-0.07em] text-accent">standards.</span>
            </SplitReveal>

            <Reveal>
              <p data-reveal className="mt-12 max-w-prose text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-ink text-balance">
                When no product fits, Corsw designs and builds the platform, then hosts and runs it the way
                it runs its own products.
              </p>
              <p data-reveal className="mt-6 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                From the first workshop to production support, one team owns the outcome.
              </p>
              <ul
                data-reveal
                aria-label="Services"
                className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-ink-rule pt-5 font-mono text-[13px] text-ink"
              >
                {services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-20">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">Selected engagement</p>
              {engagements.map((e) => (
                <article
                  key={e.slug}
                  aria-labelledby={`engagement-${e.slug}`}
                  className="mt-6 grid gap-6 border-t border-ink-rule pt-6 md:grid-cols-12"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border border-ink-rule bg-bg-card md:col-span-5">
                    <Capture shot={e.capture} sizes="(min-width: 768px) 30vw, 100vw" />
                  </div>
                  <div className="flex flex-col md:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3
                        id={`engagement-${e.slug}`}
                        className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-balance"
                      >
                        {e.name}
                      </h3>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.5] text-ink-muted">{e.tagline}</p>
                    <Link
                      href={projectHref(e)}
                      className="mt-6 inline-flex items-center gap-2 font-mono text-[13px] text-accent"
                    >
                      <span className="link-draw">Read the engagement</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Replace `components/home/Contact.tsx`**

```tsx
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { DEMO_EMAIL, DEMO_HREF, NEW_PROJECT_HREF } from "@/lib/projects";

const rows = [
  { label: "Company", value: "Corner Software (Corsw)" },
  { label: "Founded", value: "2024" },
  { label: "Based", value: "India" },
  { label: "Products", value: "Arogyam · StreamLine · Ordio" },
  { label: "Industries", value: "Healthcare · Manufacturing · Trading · Food service · Distribution" },
  { label: "Services", value: "Product engineering · Hosting and operations · Support" },
];

/** Chapter C, closing: the company at a glance, then the two ways to start. */
export function Contact() {
  return (
    <section data-tone="carbon" id="contact" aria-labelledby="contact-title" className="pb-24 pt-8 md:pb-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <SectionRule n={5} label="Company" className="md:col-span-3" />
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
          <SectionRule n={6} label="Contact" className="md:col-span-3" />
          <div className="md:col-span-9">
            <SplitReveal
              id="contact-title"
              className="text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-balance"
            >
              Start a <span className="font-mono font-medium tracking-[-0.08em] text-accent">conversation.</span>
            </SplitReveal>

            <Reveal>
              <p data-reveal className="mt-12 max-w-prose text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] text-ink text-balance">
                See a platform running against your own workflow, or scope one Corsw builds for you.
              </p>
              <p data-reveal className="mt-6 max-w-prose text-[17px] leading-[1.6] text-ink-muted">
                Share what you run today and where it slows you down. The reply sets out what the platform
                covers, the timeline and the cost.
              </p>
            </Reveal>

            <a
              href={DEMO_HREF}
              className="group mt-16 flex items-center justify-between gap-6 border-y border-ink-rule py-6 text-[clamp(2rem,5vw,4.25rem)] font-normal leading-none tracking-[-0.035em] transition-[font-weight,color] duration-500 hover:font-extrabold hover:text-accent focus-visible:font-extrabold focus-visible:text-accent"
            >
              <span>Request a demo</span>
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-3">→</span>
            </a>

            <div className="mt-8 flex flex-col gap-4 font-mono text-[13px] sm:flex-row sm:items-center sm:justify-between">
              <a
                href={NEW_PROJECT_HREF}
                className="inline-flex items-center gap-2 text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <span className="link-draw">Start a project</span>
                <span aria-hidden="true">→</span>
              </a>
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

- [ ] **Step 7: Update `components/home/Hero.tsx`**

1. Replace `import Link from "next/link";` — delete that line (no `Link` remains).
2. Replace `import { NEW_PROJECT_HREF } from "@/lib/projects";` with `import { DEMO_HREF } from "@/lib/projects";`
3. Replace the subline paragraph content `Corner Software builds software, and <span className="font-extrabold">runs</span> it.` with:

```tsx
            Industry platforms for healthcare, manufacturing and food service. Built, hosted and{" "}
            <span className="font-extrabold">run</span> by Corner Software.
```

4. Replace the whole actions `<div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[13px] md:col-span-6 md:justify-end">…</div>` with:

```tsx
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[13px] md:col-span-6 md:justify-end">
            <a href={DEMO_HREF} className="inline-flex items-center gap-2 text-accent">
              <span className="link-draw">Request a demo</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#engineering"
              className="inline-flex items-center gap-2 text-ink transition-colors duration-150 hover:text-accent"
            >
              <span className="link-draw">Build with Corsw</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
```

- [ ] **Step 8: Replace `app/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { Products } from "@/components/home/Products";
import { Platform } from "@/components/home/Platform";
import { Engineering } from "@/components/home/Engineering";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/site/Footer";
import { DEMO_EMAIL, projectHref, projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Corner Software · Industry platforms, built and run.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

const ORG_ID = "https://corsw.in/#organization";

const products = projects.filter((p) => p.kind === "product");
const engagements = projects.filter((p) => p.kind === "engagement");

// Client components get only the fields they render.
const pick = ({ kind, slug, n, name, status, tagline, capture }: (typeof projects)[number]) => ({
  kind,
  slug,
  n,
  name,
  status,
  tagline,
  capture,
});

// Only facts stated on the page (Hero, Products, Company, Contact).
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
      description: "Industry platforms, built and run.",
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
      itemListElement: products.map((p) => ({
        "@type": "ListItem",
        position: p.n,
        item: {
          "@type": "SoftwareApplication",
          name: p.name,
          description: p.tagline,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `https://corsw.in${projectHref(p)}`,
          publisher: { "@id": ORG_ID },
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
      <Statement />
      <Products products={products.map(pick)} />
      <Platform />
      <Engineering engagements={engagements.map(pick)} />
      <Contact />
      <Footer tone="carbon" />
    </main>
  );
}
```

- [ ] **Step 9: Bar, layout metadata and OG image**

In `components/site/Bar.tsx`: replace `import { NEW_PROJECT_HREF } from "@/lib/projects";` with `import { DEMO_HREF } from "@/lib/projects";`, `href={NEW_PROJECT_HREF}` with `href={DEMO_HREF}`, and `<span className="link-draw">Start a project</span>` with `<span className="link-draw">Request a demo</span>`.

In `app/layout.tsx`:
- `const shareDescription = "Software, built and run. Arogyam · StreamLine · Ordio · SSC.";` → `const shareDescription = "Industry platforms, built and run. Arogyam · StreamLine · Ordio.";`
- the root `description` string → `"Corner Software (Corsw) builds and operates industry platforms for healthcare practices, manufacturers and restaurants, and engineers custom platforms to the same standards. Founded 2024, based in India."`

In `app/opengraph-image.tsx`:
- `const SANS_TEXT = "Corner Software builds software, and runs it.";` → `const SANS_TEXT = "Industry platforms, built and run by Corner Software.";`
- the rendered line `Corner Software builds software, and runs it.` → `Industry platforms, built and run by Corner Software.`
- `export const alt = …` → `export const alt = "Corner Software · Industry platforms, built and run.";`

- [ ] **Step 10: Check for stale copy**

Run: `grep -rn "Selected work\|Read the case study\|See a platform running\|builds software, and\|Software, built and run\|How Corsw\|Foundation\|Built\b" app components | grep -v "components/work\|Built for whole\|Built on one\|Built, hosted"`
Expected: no output (`/demo` keeps its own `Everything Corsw builds →` link, which is fine).

- [ ] **Step 11: Verify with a build and smoke checks**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: green.

`pnpm start -p 3151` in the background, then `curl -s localhost:3151/` must contain: `Industry platforms for healthcare`, `Built for whole`, `id="products"`, `id="platform"`, `id="engineering"`, `Custom platforms. Same`, `Read the engagement`, `href="/engineering/ssc"`, `Start a`, `conversation.`, `Request a demo`, `SoftwareApplication`, `Healthcare practices · Manufacturing · Trading`; and must not contain `Selected`, `/work/`, `Read the case study`. `curl -s -o /dev/null -w "%{http_code}" localhost:3151/opengraph-image` → `200`. Stop the server.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat(content): product-company home, platform and engineering chapters

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Rules documents

**Files:**
- Modify: `PRODUCT.md`, `BRIEF.md`, `DESIGN.md`, `CLAUDE.md`

**Interfaces:**
- Consumes: the spec and the code from Tasks 1–3 (documents describe what exists).
- Produces: documents future sessions obey.

- [ ] **Step 1: `PRODUCT.md`**

- `## Product Purpose`: replace the paragraph with: `corsw.in is the public home of Corner Software (Corsw), a software company that builds and operates industry platforms (Arogyam, StreamLine, Ordio) on one engineering foundation, and engineers custom platforms to the same standards. Success: a visitor understands what each platform does and for which industry, and requests a demo or starts a project.`
- `## Positioning`: replace with: `Corsw is a platform and engineering company. Its products are built for whole industries, not for the customers they serve today: Arogyam for outpatient clinics, StreamLine for manufacturers and trading businesses, Ordio for restaurants and cafés. Corsw hosts, updates and supports every platform it builds. The system diagrams show the architecture as deployed.`
- `## Capabilities and Constraints`: replace the "Work on the site" bullet with: `Products on the site: Arogyam, StreamLine, Ordio (all operating). Engineering engagements: SSC (in build; pre-launch placeholders). Product copy describes each product at market scope and names only shipped capabilities.`
- `## Evidence on Hand`: add a sub-list `Not claimable (verified against the product repos, 2026-09-17):` followed by the four bullets of the spec's "Not claimable" section, verbatim.
- `## Users`: replace "Prospective clients deciding whether to start a project with Corsw." with "Businesses evaluating a Corsw product for their industry, or scoping a custom platform with Corsw."

- [ ] **Step 2: `BRIEF.md`**

- `## 1. Brand`: positioning line → `Industry platforms for healthcare, manufacturing and food service, built, hosted and run by Corner Software, plus custom platforms engineered to the same standards.`; one-line → `Corner Software · Industry platforms, built and run.`; extend the Never-words list with `leading`, `best-in-class`, `seamless`, and add `Corsw is the subject; never "we".`
- `## 2. Information architecture`: home order → `Bar · Hero (bone) · 1 Overview (bone) · 2 Products (ink, pinned) · 3 Platform (carbon, diagram) · 4 Engineering (carbon) · 5 Company (carbon) · 6 Contact (carbon) · Footer`; detail routes → `/products/<slug>` (`Hero · 1 What it solves · 2 In use · 3 Architecture · Next product`) and `/engineering/<slug>` (`Hero · 1 The engagement · 2 In use · 3 Architecture · All products`); keep `/demo` and the proxy notes.
- `## 4. Copy bank`: replace every home subsection and the case-study notes with the spec's Home, Site-wide and Product and engagement pages copy, verbatim (quote the strings exactly as the components render them). Product tables and captions live in `lib/projects.ts`; say so.
- `## 5. Hard rules` Never: add `Any capability on the PRODUCT.md Not claimable list.`
- `## 6. Changing the project list`: step 1 → `Edit lib/projects.ts (set kind: "product" or "engagement"; add a schematic in lib/diagrams.ts if new).`; step 2 → `Update the Company rows in components/home/Contact.tsx, the Statement follow-up and the metadata descriptions if a product or industry changes.`

- [ ] **Step 3: `DESIGN.md`**

Rename the documented sections to match the code: Foundation → Statement (`components/home/Statement.tsx`, folio "Overview"), Work → Products (`components/home/Products.tsx`), Approach / How it's built → Platform (`components/home/Platform.tsx`, pillars as a `dl` with mono accent labels), add Engineering (`components/home/Engineering.tsx`: services list, engagement card with capture), Company and Contact folio numbers 5 and 6. Replace `/work/<slug>` with `/products/<slug>` and `/engineering/<slug>`, and case-study wording with product and engagement pages (`components/work/ProjectPage.tsx`). Grep afterwards: `grep -n "work/\|Foundation\|Selected work\|How Corsw" DESIGN.md` must return nothing except the data attribute names `data-work-item` (kept in code).

- [ ] **Step 4: `CLAUDE.md`**

In `## What this is`, replace the first paragraph with: `corsw.in — the site of Corner Software (Corsw), a software company with industry platforms (Arogyam, StreamLine, Ordio) and an engineering practice (SSC is an engagement). Product pages live at /products/<slug>, engagements at /engineering/<slug>. A /demo page also serves every unassigned *.corsw.in subdomain. One identity in three scroll chapters: **bone** (paper, Garamond), **ink** (the products) and **carbon** (platform, engineering, diagrams).` In `## How we work` item 1, append: `Product copy names only shipped capabilities; check PRODUCT.md's Not claimable list.`

- [ ] **Step 5: Verify and commit**

Run: `grep -rn "/work/<slug>\|Selected work\|case stud" PRODUCT.md BRIEF.md DESIGN.md CLAUDE.md README.md`
Expected: no output (fix README.md too if it matches).

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: green.

```bash
git add -A
git commit -m "docs: product-company positioning, copy bank and not-claimable list

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Fit pass

**Files:**
- Modify: whatever the pass finds (one fix commit, or none).

**Interfaces:**
- Consumes: the finished content.
- Produces: screenshots in the session scratchpad and a short list of fixed layout issues.

- [ ] **Step 1: Build and serve**

Run: `pnpm build && pnpm start -p 3152` (background).

- [ ] **Step 2: Screenshot the pages whose copy changed length**

Using the Playwright library at `/Users/apple/Personal/ordio/node_modules/playwright` from a throwaway script in the session scratchpad, capture viewport screenshots (reduced motion off) of:
- `/` at 1440×900 and 1280×720: hero bottom (scrollY 0), each of the three pinned product states in the Products stage (scroll to the stage start + 0.55, 1.55, 2.55 viewport heights), the Platform section with pillars, the Engineering section with the SSC card, Contact.
- `/` at 390×844: hero, Products list, Platform, Engineering card.
- `/products/arogyam` (the longest tagline and table) and `/engineering/ssc` at 1440×900 and 390×844: hero and the table area.
Also collect console errors.

- [ ] **Step 3: Inspect and fix in one batch**

Look for: taglines or headings clipped or overflowing, the pinned product item exceeding the viewport at 1280×720, pillar list or engagement card breaking at 390px, table labels (`BUILT FOR`, `CONTROLS`, `ROLES`, `SCOPE`) wrapping badly, horizontal scroll at 390px, console errors. Fix at the root within the constraints (sizes and spacing only; copy stays verbatim). Re-run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` and re-shoot only affected views once.

- [ ] **Step 4: Commit (only if something changed)**

```bash
git add -A
git commit -m "fix(layout): fit the product-company copy

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Stop the server.
