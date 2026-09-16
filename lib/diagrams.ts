export type Box = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
};

export type Connector = {
  from: string;
  to: string;
  via?: { x: number; y: number }[];
};

export type Annotation = { x: number; y: number; text: string };

export type Schematic = {
  title: string;
  desc: string;
  viewBox: { w: number; h: number };
  boxes: Box[];
  connectors: Connector[];
  annotations: Annotation[];
  /** Parallel entry points, rendered side by side at the top of the mobile stack. */
  mobileClients: string[];
};

export type DiagramKey = "arogyam" | "streamline" | "ordio" | "ssc";

const AROGYAM: Schematic = {
  title: "Arogyam architecture",
  desc:
    "A schematic system diagram of Arogyam. A Next.js web client and Gupshup " +
    "WhatsApp gateway both reach a tRPC API. The API talks to Postgres with " +
    "row-level security, pgvector embeddings, a Rust Axum WebSocket sidecar, " +
    "and a Python LangGraph orchestrator. LangGraph reaches pgvector and the " +
    "ABDM sandbox.",
  viewBox: { w: 620, h: 360 },
  boxes: [
    { id: "web", x: 24, y: 32, w: 156, h: 52, label: "Web", sub: "Next.js" },
    { id: "wa", x: 24, y: 116, w: 156, h: 52, label: "WhatsApp", sub: "Gupshup" },
    { id: "api", x: 232, y: 76, w: 156, h: 52, label: "API", sub: "tRPC", accent: true },
    { id: "ws", x: 232, y: 168, w: 156, h: 52, label: "Rust WS sidecar", sub: "Axum · Tokio" },
    { id: "lg", x: 232, y: 252, w: 156, h: 52, label: "Python LangGraph", sub: "RAG · evals" },
    { id: "pg", x: 440, y: 32, w: 156, h: 52, label: "Postgres", sub: "RLS · pgcrypto" },
    { id: "pgv", x: 440, y: 116, w: 156, h: 52, label: "pgvector", sub: "embeddings" },
    { id: "abdm", x: 440, y: 252, w: 156, h: 52, label: "ABDM", sub: "Sandbox · M2" },
  ],
  connectors: [
    { from: "web", to: "api" },
    { from: "wa", to: "api" },
    { from: "api", to: "pg" },
    { from: "api", to: "pgv" },
    { from: "api", to: "ws", via: [{ x: 310, y: 102 }, { x: 310, y: 194 }] },
    { from: "api", to: "lg", via: [{ x: 310, y: 102 }, { x: 310, y: 278 }] },
    { from: "lg", to: "abdm" },
    { from: "lg", to: "pgv", via: [{ x: 412, y: 278 }, { x: 412, y: 142 }] },
  ],
  annotations: [
    { x: 310, y: 24, text: "multi-tenant via RLS" },
    { x: 310, y: 332, text: "EN / MR" },
    { x: 532, y: 332, text: "built for DPDP" },
  ],
  mobileClients: ["web", "wa"],
};

const STREAMLINE: Schematic = {
  title: "StreamLine architecture",
  desc:
    "A schematic system diagram of StreamLine. A Next.js web client and Better " +
    "Auth sessions both reach org-scoped server actions. The actions write to " +
    "Neon Postgres under row-level security, append to the stock ledger and the " +
    "audit log, and render quotation PDFs that go out over Resend.",
  viewBox: { w: 620, h: 360 },
  boxes: [
    { id: "web", x: 24, y: 32, w: 156, h: 52, label: "Web", sub: "Next.js 16" },
    { id: "auth", x: 24, y: 116, w: 156, h: 52, label: "Better Auth", sub: "orgs · roles" },
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
    { id: "doc", x: 232, y: 168, w: 156, h: 52, label: "Documents", sub: "react-pdf" },
    { id: "mail", x: 232, y: 252, w: 156, h: 52, label: "Email", sub: "Resend" },
    { id: "pg", x: 440, y: 32, w: 156, h: 52, label: "Neon Postgres", sub: "RLS per org" },
    { id: "ledger", x: 440, y: 116, w: 156, h: 52, label: "Stock ledger", sub: "append-only" },
    { id: "audit", x: 440, y: 252, w: 156, h: 52, label: "Audit log", sub: "every mutation" },
  ],
  connectors: [
    { from: "web", to: "act" },
    { from: "auth", to: "act" },
    { from: "act", to: "pg" },
    { from: "act", to: "ledger" },
    { from: "act", to: "doc", via: [{ x: 310, y: 128 }, { x: 310, y: 194 }] },
    { from: "doc", to: "mail" },
    { from: "act", to: "audit", via: [{ x: 412, y: 102 }, { x: 412, y: 278 }] },
  ],
  annotations: [
    { x: 310, y: 24, text: "one org per tenant" },
    { x: 310, y: 332, text: "money in integer paise" },
    { x: 532, y: 332, text: "stock = sum(movements)" },
  ],
  mobileClients: ["web", "auth"],
};

const ORDIO: Schematic = {
  title: "Ordio architecture",
  desc:
    "A schematic system diagram of Ordio. A guest phone reached by QR scan and " +
    "a kitchen display both talk to org-scoped server actions. The actions " +
    "write to Neon Postgres under row-level security and to the orders table, " +
    "open a PhonePe checkout whose webhook releases the order to the kitchen, " +
    "and render A5 PDF receipts handed off over WhatsApp or SMS deep links.",
  viewBox: { w: 620, h: 360 },
  boxes: [
    { id: "guest", x: 24, y: 32, w: 156, h: 52, label: "Guest", sub: "QR scan · phone" },
    { id: "kds", x: 24, y: 116, w: 156, h: 52, label: "Kitchen display", sub: "SWR polling" },
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
    { id: "pay", x: 232, y: 168, w: 156, h: 52, label: "PhonePe", sub: "pay before KOT" },
    { id: "pdf", x: 232, y: 252, w: 156, h: 52, label: "Receipts", sub: "pdf-lib A5" },
    { id: "pg", x: 440, y: 32, w: 156, h: 52, label: "Neon Postgres", sub: "RLS per café" },
    { id: "orders", x: 440, y: 116, w: 156, h: 52, label: "Orders", sub: "status timeline" },
    { id: "hand", x: 440, y: 252, w: 156, h: 52, label: "WhatsApp / SMS", sub: "deep links" },
  ],
  connectors: [
    { from: "guest", to: "act" },
    { from: "kds", to: "act" },
    { from: "act", to: "pg" },
    { from: "act", to: "orders" },
    { from: "act", to: "pay", via: [{ x: 310, y: 128 }, { x: 310, y: 194 }] },
    { from: "act", to: "pdf", via: [{ x: 310, y: 128 }, { x: 310, y: 278 }] },
    { from: "pay", to: "orders", via: [{ x: 412, y: 194 }, { x: 412, y: 142 }] },
    { from: "pdf", to: "hand" },
  ],
  annotations: [
    { x: 310, y: 24, text: "one café per subdomain" },
    { x: 310, y: 332, text: "money in integer paise" },
    { x: 532, y: 332, text: "no ticket before payment" },
  ],
  mobileClients: ["guest", "kds"],
};

const SSC: Schematic = {
  title: "SSC architecture",
  desc:
    "A schematic system diagram of SSC. A buyer reaches statically built catalogue " +
    "pages, which read a typed catalogue and a brand and category taxonomy, run " +
    "search and faceted filtering, hand off to WhatsApp with the product named, " +
    "and post quote requests to a server-validated enquiry API that sends email " +
    "through Resend.",
  viewBox: { w: 620, h: 360 },
  boxes: [
    { id: "buyer", x: 24, y: 32, w: 156, h: 52, label: "Buyer", sub: "phone · desktop" },
    { id: "wa", x: 24, y: 116, w: 156, h: 52, label: "WhatsApp", sub: "product pre-filled" },
    {
      id: "pages",
      x: 232,
      y: 76,
      w: 156,
      h: 52,
      label: "Catalogue pages",
      sub: "Next.js · static",
      accent: true,
    },
    { id: "facets", x: 232, y: 168, w: 156, h: 52, label: "Search + facets", sub: "derived counts" },
    { id: "api", x: 232, y: 252, w: 156, h: 52, label: "Enquiry API", sub: "validated server-side" },
    { id: "data", x: 440, y: 32, w: 156, h: 52, label: "Typed catalogue", sub: "TS files · no DB" },
    { id: "tax", x: 440, y: 116, w: 156, h: 52, label: "Brands + taxonomy", sub: "slugs checked at build" },
    { id: "mail", x: 440, y: 252, w: 156, h: 52, label: "Resend", sub: "email to the depot" },
  ],
  connectors: [
    { from: "buyer", to: "pages" },
    { from: "pages", to: "wa" },
    { from: "pages", to: "data" },
    { from: "pages", to: "tax" },
    { from: "pages", to: "facets", via: [{ x: 310, y: 128 }, { x: 310, y: 194 }] },
    { from: "pages", to: "api", via: [{ x: 310, y: 128 }, { x: 310, y: 278 }] },
    { from: "facets", to: "tax", via: [{ x: 412, y: 194 }, { x: 412, y: 142 }] },
    { from: "api", to: "mail" },
  ],
  annotations: [
    { x: 310, y: 24, text: "no CMS, no database" },
    { x: 310, y: 332, text: "figures derived, never typed" },
    { x: 532, y: 332, text: "no lead dropped silently" },
  ],
  mobileClients: ["buyer", "wa"],
};

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
