/** Where demo requests go. One address, named once. */
export const DEMO_EMAIL = "tanksalipradyumna@gmail.com";

export type ProjectStatus = "operating" | "in-build";

export type Project = {
  n: number;
  name: string;
  status: ProjectStatus;
  tagline: string;
  description: string[];
  diagram: "arogyam" | "streamline" | "ordio" | "ssc";
  /** Mono slug shown above the schematic, e.g. `arogyam.v2`. */
  diagramLabel: string;
  table: { label: string; value: string; meta: string }[];
  link: { label: string; href: string };
};

export const projects: Project[] = [
  {
    n: 1,
    name: "Arogyam",
    status: "operating",
    tagline: "Practice OS for Indian healthcare practitioners.",
    description: [
      "A multi-tenant platform for Indian doctors and clinics, in English, Marathi and Hindi. Built for the DPDP Act 2023, and for ABHA-linked records through the ABDM M2 sandbox.",
      "Arogyam runs scheduling against per-clinic availability, append-only casepapers, triage questionnaires before the visit, home-recovery programs, and a WhatsApp inbox with one thread per patient. Currently operating one practice in Solapur.",
    ],
    diagram: "arogyam",
    diagramLabel: "arogyam.v2",
    table: [
      { label: "TENANTS", value: "1 active · 12 in pipeline", meta: "tnt" },
      { label: "LANGUAGES", value: "English · Marathi · Hindi", meta: "lng/03" },
      { label: "BUILT FOR", value: "DPDP Act 2023 · ABDM M2 sandbox", meta: "cmp" },
      {
        label: "STACK",
        value: "Next.js · Postgres · Rust · Python LangGraph · pgvector",
        meta: "stk",
      },
    ],
    link: { label: "drtanvis.corsw.in", href: "https://drtanvis.corsw.in/en" },
  },
  {
    n: 2,
    name: "StreamLine",
    status: "operating",
    tagline: "Quote-to-dispatch ERP for small manufacturers.",
    description: [
      "A multi-tenant ERP for small manufacturing businesses, rebuilt from a single-machine desktop system into a hosted platform. Every business row belongs to an org and no query runs unscoped. Isolation is enforced in Postgres, not in application conditionals.",
      "StreamLine runs the quote-to-dispatch pipeline: quotations with revisions and PDF delivery, purchase orders that receive into stock in one transaction, and a catalog whose stock levels are derived from an append-only movement ledger. Money is stored as numeric(12,2) and computed in integer paise.",
    ],
    diagram: "streamline",
    diagramLabel: "streamline.v1",
    table: [
      {
        label: "OPERATING",
        value: "Quotations · Invoices · Purchase orders · Work orders · Payroll",
        meta: "mod",
      },
      {
        label: "ISOLATION",
        value: "Org-scoped queries · RLS on every business table",
        meta: "iso",
      },
      {
        label: "STACK",
        value: "Next.js · Neon Postgres · Drizzle · Better Auth",
        meta: "stk",
      },
    ],
    link: { label: "stream.corsw.in", href: "https://stream.corsw.in" },
  },
  {
    n: 3,
    name: "Ordio",
    status: "operating",
    tagline: "QR ordering and kitchen display for café counters.",
    description: [
      "A multi-tenant ordering platform for cafés and small restaurants. Each café is its own subdomain with its own menu and its own row-level security scope. A guest scans the QR on the table and orders from their own phone. The kitchen gets the ticket only after checkout.",
      "Ordio runs the counter loop end to end: a menu with variants, add-ons and offers, a PhonePe checkout that gates the KOT, a kitchen display that polls for new tickets, A5 PDF receipts, and a receipt book a guest can reopen with their phone number. Currently operating one café in Solapur.",
    ],
    diagram: "ordio",
    diagramLabel: "ordio.v1",
    table: [
      {
        label: "TENANTS",
        value: "1 active · Cafe Sips N Bites, Solapur",
        meta: "tnt",
      },
      {
        label: "OPERATING",
        value: "Menu · Ordering · Payments · Kitchen display",
        meta: "mod",
      },
      {
        label: "PAYMENTS",
        value: "PhonePe pay-before-KOT · merchant KYC pending",
        meta: "pay",
      },
      {
        label: "STACK",
        value: "Next.js 16 · Neon Postgres · Drizzle · Better Auth",
        meta: "stk",
      },
    ],
    link: { label: "ordio.corsw.in", href: "https://ordio.corsw.in" },
  },
  {
    n: 4,
    name: "SSC",
    // In build: phone, WhatsApp and licence placeholders still block launch (ssc README).
    status: "in-build",
    tagline: "Catalogue and quote requests for an Ayurvedic wholesale distributor.",
    description: [
      "A catalogue-led site for Shivam Sales Corporation, a wholesale distributor of Ayurvedic medicines. The catalogue lives in typed files, not a CMS: a product that names a brand or category that does not exist fails the build.",
      "Buyers search by name, brand or indication, narrow by a faceted rail, and send a quote request that is validated on the server and delivered by email, or open WhatsApp with the product already named. Headline figures are derived from the data, so they cannot drift.",
    ],
    diagram: "ssc",
    diagramLabel: "ssc.v1",
    table: [
      { label: "CATALOGUE", value: "41 product lines · 8 categories", meta: "cat" },
      { label: "BRANDS", value: "12 stocked", meta: "brd" },
      { label: "REACH", value: "18 cities · 5 states", meta: "rch" },
      { label: "STACK", value: "Next.js 15 · Tailwind 4 · Resend", meta: "stk" },
    ],
    link: { label: "ssc.corsw.in", href: "https://ssc.corsw.in" },
  },
];
