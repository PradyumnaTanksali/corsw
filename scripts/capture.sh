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

# Crops one screen (device px, top-left origin) out of a full-page shot with
# sharp, which ships as a transitive dependency of next; resolved from Node
# so this stays dependency-free instead of adding a CLI image tool.
tmpdirs=()
cleanup() { for d in "${tmpdirs[@]:-}"; do [[ -n "$d" ]] && rm -rf "$d"; done; }
trap cleanup EXIT

crop_screen() {
  local src="$1" dst="$2" width="$3" height="$4" y="$5"
  node -e '
    const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));
    const [src, dst, width, height, y] = process.argv.slice(1);
    const w = Number(width), h = Number(height), top = Number(y);
    sharp(src).metadata().then((meta) => {
      if (top + h > meta.height) {
        console.error(`crop out of bounds for ${dst}: top ${top} + height ${h} exceeds image height ${meta.height}`);
        process.exit(1);
      }
      return sharp(src).extract({ left: 0, top, width: w, height: h }).toFile(dst);
    }).catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
  ' "$src" "$dst" "$width" "$height" "$y"
}

while read -r slug file device url top; do
  [[ -z "${slug:-}" || "$slug" == \#* ]] && continue
  mkdir -p "public/work/$slug"
  out="public/work/$slug/$file"
  if [[ "$device" == "phone" ]]; then
    if [[ -z "${top:-}" || "$top" == "0" ]]; then
      npx -y playwright screenshot --device "iPhone 13" --wait-for-timeout 2500 "$url" "$out"
    else
      tmpdir="$(mktemp -d)"
      tmpdirs+=("$tmpdir")
      tmp="$tmpdir/full.png"
      # --full-page: crop_screen below then slices out exactly one screen
      # starting at $top so the captioned content (below the fold on the
      # short iPhone 13 viewport) ends up in the shipped capture.
      npx -y playwright screenshot --device "iPhone 13" --wait-for-timeout 2500 --full-page "$url" "$tmp"
      crop_screen "$tmp" "$out" 1170 2532 $((top * 3))
    fi
  else
    if [[ -z "${top:-}" || "$top" == "0" ]]; then
      npx -y playwright screenshot --browser chromium --viewport-size "1440, 900" --wait-for-timeout 2500 "$url" "$out"
    else
      tmpdir="$(mktemp -d)"
      tmpdirs+=("$tmpdir")
      tmp="$tmpdir/full.png"
      npx -y playwright screenshot --browser chromium --viewport-size "1440, 900" --wait-for-timeout 2500 --full-page "$url" "$tmp"
      crop_screen "$tmp" "$out" 1440 900 "$top"
    fi
  fi
  echo "captured $out"
done < "$list"
