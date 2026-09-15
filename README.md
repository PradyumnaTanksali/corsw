# Corsw

The site for Corner Software — one company, run by Pradyumna Tanksali, that builds and runs four projects: Arogyam, StreamLine, Ordio and SSC. One page with a system diagram per project, a `/demo` page, and two themes a visitor can switch between (Paper and Schematic).

`PRODUCT.md` holds what is true, `BRIEF.md` the structure, copy and rules, `DESIGN.md` the visual system. `CLAUDE.md` has the working rules.

## Stack

- Next.js 16 (App Router, `proxy.ts`), TypeScript strict
- Tailwind CSS 4
- framer-motion
- Inter, EB Garamond, JetBrains Mono via `next/font`

## Commands

```bash
pnpm dev          # local dev server
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # host routing check (node --test)
pnpm build        # production build
pnpm start        # serve the build
```

## Deploy

Vercel project `corsw`, production branch `main`. Domains: `corsw.in` and the `*.corsw.in` wildcard — any subdomain not assigned to another project lands on `/demo`; `www.corsw.in` redirects to the apex.

Contact: hello@corsw.in
