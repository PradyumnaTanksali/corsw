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
