import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projectHref, projects } from "./projects.ts";
import { SCHEMATICS } from "./diagrams.ts";

test("slugs are unique and URL-safe", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});

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

test("every project has a diagram, business copy and a walkthrough", () => {
  for (const p of projects) {
    assert.ok(SCHEMATICS[p.diagram], `${p.name} diagram`);
    assert.equal(p.business.length, 2, `${p.name} business`);
    assert.ok(p.walkthrough.length >= 3 && p.walkthrough.length <= 4, `${p.name} walkthrough`);
    assert.ok(p.capture.alt.length > 0, `${p.name} capture alt`);
  }
});

test("every named capture exists in public/", () => {
  for (const p of projects) {
    for (const shot of [p.capture, ...p.walkthrough]) {
      if (!shot.src) continue;
      assert.ok(existsSync(new URL(`../public${shot.src}`, import.meta.url)), shot.src);
    }
  }
});

test("copy stays inside the brand rules", () => {
  const banned =
    /\b(transform\w*|innovative|cutting-edge|world-class|next-generation|leading|best-in-class|seamless\w*)\b|!/i;
  for (const p of projects) {
    const texts = [p.tagline, ...p.description, ...p.business, ...p.walkthrough.map((s) => s.caption)];
    for (const text of texts) assert.doesNotMatch(text, banned, text);
  }
});

// Gate a real launch on every placeholder capture being replaced: run with
// LAUNCH=1 pnpm test. Off by default so in-build projects can still ship copy
// and captures separately, ahead of their own capture.src landing.
test("launch: every capture is real", { skip: !process.env.LAUNCH }, () => {
  for (const p of projects) {
    assert.ok(p.capture.src, `${p.name} capture.src`);
    for (const step of p.walkthrough) {
      assert.ok(step.src, `${p.name} walkthrough step src (${step.alt})`);
    }
  }
});
