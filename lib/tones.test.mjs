// Run with `pnpm test` (Node strips the types from tones.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { TONES, toneCss } from "./tones.ts";

const luminance = (hex) => {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .map((c) => parseInt(c, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("every tone defines the same roles", () => {
  const roles = Object.keys(TONES.bone).sort();
  for (const vars of Object.values(TONES)) {
    assert.deepEqual(Object.keys(vars).sort(), roles);
  }
});

test("css sets each page's starting tone and each static section", () => {
  const css = toneCss();
  assert.match(css, /^:root\{--bg:#ece6da;/);
  for (const [name, vars] of Object.entries(TONES)) {
    assert.ok(css.includes(`html:has(main[data-tone-start="${name}"]){--bg:${vars["--bg"]};`), name);
    assert.ok(css.includes(`html:not(.tones-live) [data-tone="${name}"]{--bg:${vars["--bg"]};`), name);
  }
});

test("small text clears 4.5:1 on ground and card in every tone", () => {
  for (const [name, vars] of Object.entries(TONES)) {
    for (const fg of ["--ink", "--ink-muted", "--ink-faint", "--accent"]) {
      for (const bg of ["--bg", "--bg-card"]) {
        const ratio = contrast(vars[fg], vars[bg]);
        assert.ok(ratio >= 4.5, `${name} ${fg} on ${bg} is ${ratio.toFixed(2)}`);
      }
    }
  }
});
