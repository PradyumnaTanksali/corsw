import { NextResponse, type NextRequest } from "next/server";
import { decide } from "@/lib/host";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const d = decide(req.headers.get("host") ?? "", pathname, search);

  if (d.kind === "redirect") return NextResponse.redirect(new URL(d.url), 308);

  const res =
    d.kind === "rewrite"
      ? NextResponse.rewrite(new URL(d.path, req.url))
      : NextResponse.next();
  if (d.noindex) res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|brand/|icon|apple-icon).*)"],
};
