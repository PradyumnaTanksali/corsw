// Run with `pnpm test` (Node 22 strips the types from next.config.ts).
// Host routing is declarative config, resolved by the platform router, so there
// is no proxy.ts function on the request path. This pins the rules' shape; the
// matching itself is checked end to end against `next start` (see the PR).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import config from "../next.config.ts";

const hostOf = (rule) => rule.has.find((h) => h.type === "host").value;
const matches = (rule, host) => new RegExp(`^${hostOf(rule)}$`).test(host);

test("no proxy.ts: every request would run a Node function", () => {
  assert.equal(existsSync(new URL("../proxy.ts", import.meta.url)), false);
});

test("www redirects permanently to the apex, path and query kept by Next", async () => {
  const [r] = await config.redirects();
  assert.equal(r.permanent, true);
  assert.equal(r.destination, "https://corsw.in/:path*");
  assert.ok(matches(r, "www.corsw.in"));
  assert.ok(!matches(r, "corsw.in"));
  assert.ok(!matches(r, "anything.corsw.in"));
});

test("unassigned subdomain root shows the demo", async () => {
  const { beforeFiles: [r] } = await config.rewrites();
  assert.equal(r.source, "/");
  assert.equal(r.destination, "/demo");
  assert.ok(matches(r, "anything.corsw.in"));
  assert.ok(!matches(r, "corsw.in"));
});

test("every host except the apex is noindexed", async () => {
  const [r] = await config.headers();
  assert.deepEqual(r.headers, [{ key: "X-Robots-Tag", value: "noindex" }]);
  assert.ok(!matches(r, "corsw.in"));
  for (const h of ["anything.corsw.in", "www.corsw.in", "corsw-git-x.vercel.app", "localhost"]) {
    assert.ok(matches(r, h), h);
  }
});
