const CANONICAL = "corsw.in";

export type HostDecision =
  | { kind: "redirect"; url: string }
  | { kind: "rewrite"; path: string; noindex: boolean }
  | { kind: "next"; noindex: boolean };

/**
 * corsw.in owns the *.corsw.in wildcard. Project subdomains (stream., ordio.,
 * drtanvis., ssc., …) are assigned to their own Vercel projects and never reach
 * this code; any other subdomain does, and its root shows the demo page.
 */
export function decide(host: string, pathname: string, search: string): HostDecision {
  const name = host.toLowerCase();

  // Absolute origin + a pathname that always starts with "/" keeps the
  // redirect on corsw.in, even for "//other.host".
  if (name === `www.${CANONICAL}`) {
    return { kind: "redirect", url: `https://${CANONICAL}${pathname}${search}` };
  }

  // Wildcard subdomains, previews and localhost are duplicates of the apex.
  const noindex = name !== CANONICAL;

  if (name.endsWith(`.${CANONICAL}`) && pathname === "/") {
    return { kind: "rewrite", path: "/demo", noindex };
  }
  return { kind: "next", noindex };
}
