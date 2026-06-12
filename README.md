# Corsw

The site for Corner Software — the parent holding company behind two
software product divisions, Modlio (enterprise) and Scene Studio (indie).
One page. Nine sections. No nav, no forms, no icons. A directory and a
manifesto, set like a printed annual report.

`BRIEF.md` is the source of truth for copy, tokens, and rules. `CLAUDE.md`
holds the operating instructions. Read both before changing anything.

## Stack

- Next.js 16, App Router, TypeScript strict
- Tailwind CSS 4
- framer-motion
- Inter, EB Garamond, JetBrains Mono via `next/font`

## Commands

```bash
pnpm dev          # local dev server
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm build        # production build
pnpm start        # serve the build
```

## Deploy

Deploys to [corsw.in](https://corsw.in). The divisions live on their own
subdomains: `modlio.corsw.in` and `scenestudio.corsw.in`.

© Corner Software Pvt. Ltd.
