import { test } from "node:test";
import assert from "node:assert/strict";
import { SCHEMATICS, mobileLayout, pathFor, tipFor } from "./diagrams.ts";

for (const [key, s] of Object.entries(SCHEMATICS)) {
  test(`${key}: connectors join boxes that exist, once each`, () => {
    const ids = new Set(s.boxes.map((b) => b.id));
    const pairs = new Set();
    for (const c of s.connectors) {
      assert.ok(ids.has(c.from) && ids.has(c.to), `${c.from} → ${c.to}`);
      const pair = `${c.from}-${c.to}`;
      assert.ok(!pairs.has(pair), `duplicate ${pair}`);
      pairs.add(pair);
      assert.match(pathFor(s, c), /^M \d+(\.\d+)? \d+(\.\d+)?( L \d+(\.\d+)? \d+(\.\d+)?)+$/);
      const tip = tipFor(s, c);
      assert.ok(Number.isFinite(tip.x) && Number.isFinite(tip.y));
    }
  });

  test(`${key}: exactly one core box and real mobile clients`, () => {
    assert.equal(s.boxes.filter((b) => b.accent).length, 1);
    for (const id of s.mobileClients) assert.ok(s.boxes.some((b) => b.id === id), id);
  });

  test(`${key}: the mobile stack places every box exactly once`, () => {
    const { clients, core, direct, rest } = mobileLayout(s);
    const placed = [...clients, core, ...direct, ...rest.map((r) => r.box)].map((b) => b.id);
    assert.equal(new Set(placed).size, placed.length);
    assert.deepEqual([...placed].sort(), s.boxes.map((b) => b.id).sort());
  });
}
