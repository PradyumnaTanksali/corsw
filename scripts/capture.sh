#!/usr/bin/env bash
# Shoots product captures into public/work/<slug>/ with the Playwright CLI.
# Usage: scripts/capture.sh scripts/captures.txt
# Laptop: 1440x900 viewport. Phone: Playwright's "iPhone 13" device (390x844 @3x).
set -euo pipefail

list="${1:?usage: scripts/capture.sh <captures.txt>}"
# Playwright's CLI ties --device to that device's defaultBrowserType and
# ignores --browser when --device is set; "iPhone 13" resolves to webkit.
# Install both engines so laptop (chromium) and phone (webkit) shots work.
npx -y playwright install chromium webkit >/dev/null

while read -r slug file device url; do
  [[ -z "${slug:-}" || "$slug" == \#* ]] && continue
  mkdir -p "public/work/$slug"
  out="public/work/$slug/$file"
  if [[ "$device" == "phone" ]]; then
    # --full-page: the iPhone 13 viewport is short, so content below the
    # fold (a product page's brand/form/uses, a form's filled-in field)
    # would otherwise be cropped out of the shot.
    npx -y playwright screenshot --browser chromium --device "iPhone 13" --wait-for-timeout 2500 --full-page "$url" "$out"
  else
    npx -y playwright screenshot --browser chromium --viewport-size "1440, 900" --wait-for-timeout 2500 "$url" "$out"
  fi
  echo "captured $out"
done < "$list"
