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
 * meanwhile. Captures never show client names, contact details, personal names,
 * revenue or payment screens (scripts/crop-captures.mjs).
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
    capture: { src: "/work/arogyam/exercises.png", alt: "Arogyam exercise library in English and Marathi" },
    walkthrough: [
      {
        device: "laptop",
        src: "/work/arogyam/schedule.png",
        alt: "Arogyam calendar in agenda view",
        caption: "Appointments by agenda, week or month, confirmed from the front desk.",
      },
      {
        device: "laptop",
        src: "/work/arogyam/triage.png",
        alt: "Arogyam patient record with a pre-visit link and triage result",
        caption: "A pre-visit link collects consent, and triage answers are flagged before the visit.",
      },
      {
        device: "laptop",
        src: "/work/arogyam/exercises.png",
        alt: "Arogyam exercise library in English and Marathi",
        caption: "An exercise library in English and Marathi, ready to build into home programmes.",
      },
      {
        device: "laptop",
        src: "/work/arogyam/questionnaires.png",
        alt: "Arogyam triage questionnaires",
        caption: "Triage questionnaires come built in, in English and Marathi, and practices can write their own.",
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
    capture: { src: "/work/streamline/dashboard.png", alt: "StreamLine dashboard" },
    walkthrough: [
      {
        device: "laptop",
        src: "/work/streamline/dashboard.png",
        alt: "StreamLine dashboard with sales, quotes, production and payroll",
        caption: "The month at a glance: sales, open quotes, production, payroll and low stock.",
      },
      {
        device: "laptop",
        src: "/work/streamline/quotations.png",
        alt: "StreamLine quotations by status",
        caption: "Quotations move from draft to sent, accepted and converted, with every revision kept.",
      },
      {
        device: "laptop",
        src: "/work/streamline/attendance.png",
        alt: "StreamLine attendance grid with absences and leave",
        caption: "Attendance records only the exceptions, and absences flow into payroll as loss of pay.",
      },
      {
        device: "laptop",
        src: "/work/streamline/public-site.png",
        alt: "A StreamLine company public site with an order enquiry form",
        caption: "Each company's public site sends order enquiries straight to the team.",
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
    capture: { src: "/work/ordio/tables.png", alt: "Ordio floor plan with a QR code per table" },
    // No payment screens: payments are not live (PRODUCT.md, Not claimable).
    walkthrough: [
      {
        device: "phone",
        src: "/work/ordio/menu.png",
        alt: "Ordio menu on a guest's phone",
        caption: "Guests open the menu from the table's code. No app, no sign-in.",
      },
      {
        device: "phone",
        src: "/work/ordio/item.png",
        alt: "Ordio item options with sizes, extras and a kitchen note",
        caption: "Sizes, extras and a note for the kitchen on every item.",
      },
      {
        device: "laptop",
        src: "/work/ordio/tables.png",
        alt: "Ordio floor plan with a QR code per table",
        caption: "Tables are laid out on a floor plan, each with its own printable QR code.",
      },
      {
        device: "laptop",
        src: "/work/ordio/summary.png",
        alt: "Ordio daily summary by hour, item and table",
        caption: "The daily summary shows orders by hour, item velocity and takings by table.",
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

export const products = projects.filter((p) => p.kind === "product");
export const engagements = projects.filter((p) => p.kind === "engagement");
