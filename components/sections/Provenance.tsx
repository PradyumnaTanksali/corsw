"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/primitives/Container";
import { SectionRule } from "@/components/primitives/SectionRule";
import { reveal, revealTransition, viewport } from "@/lib/motion";

const cities = [
  { name: "Hyderabad", coord: "17.385° N · 78.486° E" },
  { name: "Pune", coord: "18.520° N · 73.856° E" },
  { name: "Solapur", coord: "17.660° N · 75.906° E" },
];

export function Provenance() {
  return (
    <section className="py-32 md:py-40">
      <Container>
        <motion.div
          variants={reveal}
          initial="initial"
          whileInView="whileInView"
          viewport={viewport}
          transition={revealTransition}
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16"
        >
          <div className="md:col-span-4">
            <SectionRule numeral="VI" label="Provenance" />
            <ul className="mt-10 space-y-3 font-mono text-[13px] leading-[1.7] tabular-nums">
              {cities.map((city) => (
                <li key={city.name} className="text-ink-muted">
                  <span className="block uppercase tracking-[0.18em] text-ink">
                    {city.name}
                  </span>
                  <span className="block">{city.coord}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <div className="max-w-prose space-y-6 text-[15px] leading-[1.6] text-ink md:text-base">
              <p>
                Corner Software is operated by a small group of{" "}
                <span className="font-serif italic font-normal text-accent">
                  people
                </span>{" "}
                across Hyderabad, Pune, and Solapur. We are designers,
                engineers, and one accountant. The company is privately held
                and has no investors.
              </p>
              <p className="text-ink-muted">
                We are not hiring publicly. The team grows by invitation.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
