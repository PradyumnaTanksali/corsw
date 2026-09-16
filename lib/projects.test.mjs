import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projects } from "./projects.ts";
import { SCHEMATICS } from "./diagrams.ts";

test("slugs are unique and URL-safe", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
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
  const banned = /transform|innovative|cutting-edge|world-class|next-generation|!/i;
  for (const p of projects) {
    for (const text of [...p.business, ...p.walkthrough.map((s) => s.caption)]) {
      assert.doesNotMatch(text, banned, text);
    }
  }
});
