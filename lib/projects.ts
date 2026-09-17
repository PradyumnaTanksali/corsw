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
      "Owners run menus, offers, tables, staff and analytics from one dashboard, with GST invoices and a branded website for each restaurant.",
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
