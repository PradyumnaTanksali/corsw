// Run with `pnpm test` (Node 22 strips the types from host.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { decide } from "./host.ts";

test("apex serves the site and stays indexable", () => {
  assert.deepEqual(decide("corsw.in", "/", ""), { kind: "next", noindex: false });
});

test("www redirects to the apex, path and query kept", () => {
  assert.deepEqual(decide("WWW.corsw.in", "/demo", "?a=1"), {
    kind: "redirect",
    url: "https://corsw.in/demo?a=1",
  });
});

test("www redirect cannot be bent into an open redirect", () => {
  const d = decide("www.corsw.in", "//evil.example", "");
  assert.equal(d.kind, "redirect");
  assert.equal(new URL(d.url).host, "corsw.in");
});

test("unassigned subdomain root shows the demo, noindexed", () => {
  assert.deepEqual(decide("anything.corsw.in", "/", ""), {
    kind: "rewrite",
    path: "/demo",
    noindex: true,
  });
});

test("unassigned subdomain deep path passes through, noindexed", () => {
  assert.deepEqual(decide("anything.corsw.in", "/robots.txt", ""), {
    kind: "next",
    noindex: true,
  });
});

test("preview and local hosts are never indexed", () => {
  assert.equal(decide("corsw-git-x.vercel.app", "/", "").noindex, true);
  assert.equal(decide("localhost:3000", "/", "").noindex, true);
});
