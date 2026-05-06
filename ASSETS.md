# Assets Manifest — Corsw

> The sandbox couldn't fetch binary assets directly, but every URL is documented below. Run the script on your machine before starting work.

---

## Existing Corsw assets (legacy favicons)

```
public/brand/
├── logo-light-64.png   ← https://corsw.in/CORSW_BG_LIGHT_64x64.png
├── logo-dark-64.png    ← https://corsw.in/CORSW_BG_DARK_64x64.png
├── logo-light-32.png   ← https://corsw.in/CORSW_BG_LIGHT_32x32.png
└── logo-dark-32.png    ← https://corsw.in/CORSW_BG_DARK_32x32.png
```

**Note:** These are favicon-resolution. The brief calls for a **vector mark** in §6 — a custom-built SVG monogram (corner shape with vermillion inset square). Don't try to upscale these PNGs. Treat the existing favicon as a style reference only.

---

## Fetch script

Add this to your repo root as `scripts/fetch-assets.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/brand

curl -sLo public/brand/logo-light-64.png "https://corsw.in/CORSW_BG_LIGHT_64x64.png"
curl -sLo public/brand/logo-dark-64.png  "https://corsw.in/CORSW_BG_DARK_64x64.png"
curl -sLo public/brand/logo-light-32.png "https://corsw.in/CORSW_BG_LIGHT_32x32.png"
curl -sLo public/brand/logo-dark-32.png  "https://corsw.in/CORSW_BG_DARK_32x32.png"

echo "Done. Now build the new SVG monogram per BRIEF §6.1."
```

Run with:

```bash
chmod +x scripts/fetch-assets.sh && ./scripts/fetch-assets.sh
```

---

## What this site does NOT need

- **No portfolio screenshots.** Corsw is the parent holding company; it doesn't show product screenshots. Project work is shown on Modlio's and Scene's sites, not here.
- **No team photos.** §4.7 (Provenance) is plaintext only.
- **No icons.** Zero icons by design — see BRIEF §9.
- **No gradient images, no blob renders.** That's Scene's territory.

---

## New SVG monogram to build

Per BRIEF §6.1, build this in `public/brand/monogram.svg`:

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="24" height="24" fill="#0E0E0E"/>
  <path d="M0 0 L12 0 L12 12 L0 12 Z" fill="#F5F1E8"/>
  <rect x="3" y="3" width="6" height="6" fill="#D4452C"/>
</svg>
```

Use it for: favicon, OG image, masthead.
