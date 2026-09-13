"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import {
  diagramViewport,
  drawPath,
  ease,
  fadeIn,
  fadeUpSm,
} from "@/lib/motion";

type Box = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
};

type Connector = {
  from: string;
  to: string;
  via?: { x: number; y: number }[];
};

type Annotation = { x: number; y: number; text: string };

type Schematic = {
  title: string;
  desc: string;
  viewBox: { w: number; h: number };
  boxes: Box[];
  connectors: Connector[];
  annotations: Annotation[];
  /** Parallel entry points, rendered side by side at the top of the mobile stack. */
  mobileClients: string[];
  /** The rest of the system, stacked top-to-bottom below the clients. */
  mobileChain: string[];
};

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
    { x: 310, y: 332, text: "bilingual MR / EN / HI" },
    { x: 532, y: 332, text: "DPDP-native" },
  ],
  mobileClients: ["web", "wa"],
  mobileChain: ["api", "pg", "pgv", "ws", "lg", "abdm"],
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
  mobileChain: ["act", "pg", "ledger", "doc", "mail", "audit"],
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
  mobileChain: ["act", "pay", "orders", "pg", "pdf", "hand"],
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
  mobileChain: ["pages", "data", "tax", "facets", "api", "mail"],
};

function anchor(self: Box, other: Box) {
  const sx = self.x + self.w / 2;
  const sy = self.y + self.h / 2;
  const ox = other.x + other.w / 2;
  const oy = other.y + other.h / 2;
  const dx = ox - sx;
  const dy = oy - sy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      x: dx > 0 ? self.x + self.w : self.x,
      y: self.y + self.h / 2,
    };
  }
  return {
    x: self.x + self.w / 2,
    y: dy > 0 ? self.y + self.h : self.y,
  };
}

export function ArogyamDiagram() {
  return <SystemSchematic schematic={AROGYAM} />;
}

export function StreamlineDiagram() {
  return <SystemSchematic schematic={STREAMLINE} />;
}

export function OrdioDiagram() {
  return <SystemSchematic schematic={ORDIO} />;
}

export function SscDiagram() {
  return <SystemSchematic schematic={SSC} />;
}

function SystemSchematic({ schematic }: { schematic: Schematic }) {
  const reduced = useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const { boxes, connectors, annotations, viewBox } = schematic;

  const boxById = (id: string) => {
    const b = boxes.find((b) => b.id === id);
    if (!b) throw new Error(`box ${id} missing`);
    return b;
  };

  const pathFor = (c: Connector) => {
    const from = boxById(c.from);
    const to = boxById(c.to);
    const pts = [anchor(from, to), ...(c.via ?? []), anchor(to, from)];
    return pts
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className="w-full h-auto hidden md:block font-mono"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={titleId}>{schematic.title}</title>
        <desc id={descId}>{schematic.desc}</desc>

        {annotations.map((a, i) => (
          <text
            key={i}
            x={a.x}
            y={a.y}
            textAnchor="middle"
            className="fill-ink-faint"
            style={{ fontSize: 9.5, letterSpacing: 0.4 }}
          >
            {a.text}
          </text>
        ))}

        {connectors.map((c, i) => (
          <motion.path
            key={`${c.from}-${c.to}-${i}`}
            d={pathFor(c)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
            strokeLinecap="square"
            strokeLinejoin="miter"
            variants={drawPath}
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "visible"}
            viewport={diagramViewport}
            transition={{
              duration: 1.0,
              ease,
              delay: 0.4 + i * 0.08,
            }}
          />
        ))}

        {connectors.map((c, i) => {
          const tip = anchor(boxById(c.to), boxById(c.from));
          return (
            <motion.circle
              key={`tip-${c.from}-${c.to}-${i}`}
              cx={tip.x}
              cy={tip.y}
              r={1.6}
              fill="var(--accent)"
              variants={fadeIn}
              initial={reduced ? false : "hidden"}
              whileInView={reduced ? undefined : "visible"}
              viewport={diagramViewport}
              transition={{
                duration: 0.3,
                delay: 0.4 + i * 0.08 + 0.85,
              }}
            />
          );
        })}

        {boxes.map((b, i) => (
          <motion.g
            key={b.id}
            variants={fadeUpSm}
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "visible"}
            viewport={diagramViewport}
            transition={{ duration: 0.4, delay: i * 0.06, ease }}
          >
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
            <text
              x={b.x + 12}
              y={b.y + 22}
              className="fill-ink"
              style={{ fontSize: 12, fontWeight: 500 }}
            >
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
            {b.accent && (
              <rect
                x={b.x + b.w - 6}
                y={b.y + 4}
                width={2}
                height={6}
                fill="var(--accent)"
              />
            )}
          </motion.g>
        ))}
      </svg>

      <MobileStack schematic={schematic} boxById={boxById} />
    </div>
  );
}

function MobileBox({ box }: { box: Box }) {
  return (
    <div
      className={
        box.accent
          ? "border border-accent bg-bg-card p-4"
          : "border border-ink-rule bg-bg-card p-4"
      }
    >
      <div className="text-[13px] font-medium text-ink">{box.label}</div>
      {box.sub && (
        <div className="mt-1 text-[10.5px] tracking-[0.04em] text-ink-faint">
          {box.sub}
        </div>
      )}
    </div>
  );
}

function MobileConnector() {
  return (
    <div
      aria-hidden
      className="mx-auto my-1.5 h-5 w-px bg-accent"
      style={{ opacity: 0.6 }}
    />
  );
}

/**
 * BRIEF §3.6 — diagrams collapse to a vertical flow on mobile.
 * Same boxes and annotations as the desktop schematic: the parallel
 * clients side by side, then the chain stacked top-to-bottom with
 * accent connectors. No connector is drawn between the clients, so
 * the stack never asserts an edge the system lacks.
 */
function MobileStack({
  schematic,
  boxById,
}: {
  schematic: Schematic;
  boxById: (id: string) => Box;
}) {
  return (
    <div className="md:hidden flex flex-col font-mono">
      <div className="grid grid-cols-2 gap-2">
        {schematic.mobileClients.map((id) => (
          <MobileBox key={id} box={boxById(id)} />
        ))}
      </div>
      <MobileConnector />
      {schematic.mobileChain.map((id, i) => (
        <div key={id}>
          <MobileBox box={boxById(id)} />
          {i < schematic.mobileChain.length - 1 && <MobileConnector />}
        </div>
      ))}

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-[0.04em] text-ink-faint">
        {schematic.annotations.map((a) => (
          <span key={a.text}>· {a.text}</span>
        ))}
      </div>
    </div>
  );
}
