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
