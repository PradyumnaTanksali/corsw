/** Where demo requests and new projects go. One address, named once. */
export const DEMO_EMAIL = "hello@corsw.in";

export const NEW_PROJECT_HREF = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("New project")}`;

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
  table: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    n: 1,
    name: "Arogyam",
    status: "operating",
    tagline: "Practice management for clinics and physiotherapy practices.",
    description: [
      "Scheduling, patient records, casepapers and home-recovery programmes in one system, with each practice on its own site and domain.",
      "Patients are reached on WhatsApp, in English or Marathi. Consent and audit records are kept from the first visit.",
    ],
    diagram: "arogyam",
    diagramLabel: "arogyam.v2",
    table: [
      { label: "SECTOR", value: "Healthcare · Physiotherapy" },
      { label: "MODULES", value: "Scheduling · Records · Casepapers · Recovery programmes · WhatsApp inbox" },
      { label: "LANGUAGES", value: "English · Marathi" },
      { label: "DELIVERY", value: "Multi-tenant · Custom domains" },
    ],
  },
  {
    n: 2,
    name: "StreamLine",
    status: "operating",
    tagline: "Operations software for small manufacturers.",
    description: [
      "StreamLine runs the business from quotation to dispatch: sales, purchasing, stock, production and payroll in one place.",
      "Every company works in its own secure workspace, with a public site that sends enquiries straight to the team.",
    ],
    diagram: "streamline",
    diagramLabel: "streamline.v1",
    table: [
      { label: "SECTOR", value: "Manufacturing · Fabrication" },
      { label: "MODULES", value: "Quotations · Invoices · Purchasing · Inventory · Production · Payroll" },
      { label: "DELIVERY", value: "Multi-tenant · Installable app" },
    ],
  },
  {
    n: 3,
    name: "Ordio",
    status: "operating",
    tagline: "QR ordering and kitchen display for cafés and restaurants.",
    description: [
      "Guests scan the table's QR code and order from their own phone, with no app to install and no sign-in. Each order reaches the kitchen display, and the guest can follow it to the table.",
      "Owners manage menus, tables, offers and daily reports from one dashboard, with GST-ready invoices.",
    ],
    diagram: "ordio",
    diagramLabel: "ordio.v1",
    table: [
      { label: "SECTOR", value: "Food service" },
      { label: "MODULES", value: "Menu · Ordering · Kitchen display · Invoices · Reports" },
      { label: "DELIVERY", value: "Multi-tenant · Installable app" },
    ],
  },
  {
    n: 4,
    name: "SSC",
    // In build: phone, WhatsApp and licence placeholders still block launch (ssc README).
    status: "in-build",
    tagline: "Catalogue and quote requests for a wholesale distributor.",
    description: [
      "A product catalogue for an Ayurvedic medicine distributor, searchable by name, brand or use and filtered by category and form.",
      "Buyers request a quote in a few steps, by email or on WhatsApp, with the product already filled in.",
    ],
    diagram: "ssc",
    diagramLabel: "ssc.v1",
    table: [
      { label: "SECTOR", value: "Wholesale distribution" },
      { label: "MODULES", value: "Catalogue · Search and filters · Quote requests" },
      { label: "DELIVERY", value: "Website · Installable app" },
    ],
  },
];
