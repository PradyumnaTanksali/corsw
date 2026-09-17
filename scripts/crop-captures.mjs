// Crops owner-supplied product screenshots (2026-09-03) into site captures and covers
// client names, contact details, personal names and takings. Payment screens are not used.
// Usage: node scripts/crop-captures.mjs <screenshots-dir> public/work
// Coordinates are in the 2000px-wide preview space of the 3456px desktop screenshots
// (x1.728 to source pixels); phone emulator shots use source pixels.
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

// sharp ships with next; resolved through it so this adds no dependency.
const localRequire = createRequire(import.meta.url);
const sharp = localRequire(localRequire.resolve("sharp", { paths: [localRequire.resolve("next")] }));

const [SRC, OUT] = process.argv.slice(2);
if (!SRC || !OUT) {
  console.error("usage: node scripts/crop-captures.mjs <screenshots-dir> <out-dir>");
  process.exit(1);
}
const DESKTOP = 3456 / 2000;

const img = (stamp) => path.join(SRC, `Pasted image ${stamp}.png`);

async function cover(buf, scale, rects) {
  let out = sharp(buf);
  const overlays = [];
  for (const { x, y, w, h, sx, sy } of rects) {
    const { data } = await sharp(buf)
      .extract({ left: Math.round(sx * scale), top: Math.round(sy * scale), width: 1, height: 1 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const [r, g, b] = data;
    const W = Math.round(w * scale), H = Math.round(h * scale);
    overlays.push({
      input: Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="rgb(${r},${g},${b})"/></svg>`),
      left: Math.round(x * scale),
      top: Math.round(y * scale),
    });
  }
  return out.composite(overlays).png().toBuffer();
}

async function make({ file, scale, crop, covers = [], size, out }) {
  let buf = fs.readFileSync(file);
  if (covers.length) buf = await cover(buf, scale, covers);
  const r = (v) => Math.round(v * scale);
  const target = path.join(OUT, out);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await sharp(buf)
    .extract({ left: r(crop.x), top: r(crop.y), width: r(crop.w), height: r(crop.h) })
    .resize(size.w, size.h, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toFile(target);
  const m = await sharp(target).metadata();
  console.log(`${out} ${m.width}x${m.height} ${(fs.statSync(target).size / 1024).toFixed(0)}KB`);
}

const LAPTOP = { w: 2400, h: 1500 };
const PHONE = { w: 780, h: 1688 };
// 16:10 app frame without browser chrome, sidebar kept (height 1151 display rows).
const APP = { x: 8, y: 135, w: 1832, h: 1145 };
// Arogyam: below the header row (drops the clinic name and account email).
const AROGYAM_APP = { x: 8, y: 208, w: 1715.2, h: 1072 };
// Ordio admin: below the café name and monthly takings, nav tabs kept.
const ORDIO_ADMIN = { x: 128, y: 190, w: 1744, h: 1090 };

const jobs = [
  // StreamLine (demo tenant)
  { file: img("20260903162723"), scale: DESKTOP, crop: APP, size: LAPTOP, out: "streamline/dashboard.png" },
  {
    file: img("20260903162736"),
    scale: DESKTOP,
    // Content only: drops the sidebar's hover-URL tooltip and keeps the header buttons whole.
    crop: { x: 320, y: 135, w: 1656, h: 1035 },
    covers: [{ x: 700, y: 470, w: 100, h: 28, sx: 880, sy: 484 }],
    size: LAPTOP,
    out: "streamline/quotations.png",
  },
  { file: img("20260903162815"), scale: DESKTOP, crop: { x: 336, y: 205, w: 1624, h: 1015 }, size: LAPTOP, out: "streamline/attendance.png" },
  { file: img("20260903162918"), scale: DESKTOP, crop: { x: 84, y: 135, w: 1832, h: 1145 }, size: LAPTOP, out: "streamline/public-site.png" },

  // Arogyam (client tenant: clinic name, email and phone numbers removed)
  { file: img("20260903163208"), scale: DESKTOP, crop: AROGYAM_APP, size: LAPTOP, out: "arogyam/exercises.png" },
  {
    file: img("20260903163142"),
    scale: DESKTOP,
    crop: AROGYAM_APP,
    covers: [
      { x: 752, y: 466, w: 110, h: 26, sx: 1000, sy: 478 },
      { x: 752, y: 490, w: 150, h: 26, sx: 1000, sy: 503 },
    ],
    size: LAPTOP,
    out: "arogyam/schedule.png",
  },
  { file: img("20260903163112"), scale: DESKTOP, crop: { x: 418, y: 380, w: 1440, h: 900 }, size: LAPTOP, out: "arogyam/triage.png" },
  { file: img("20260903163217"), scale: DESKTOP, crop: AROGYAM_APP, size: LAPTOP, out: "arogyam/questionnaires.png" },

  // Ordio (client tenant: café name and takings cropped out; no payment screens)
  { file: img("20260903173653"), scale: DESKTOP, crop: ORDIO_ADMIN, size: LAPTOP, out: "ordio/tables.png" },
  { file: img("20260903173703"), scale: DESKTOP, crop: ORDIO_ADMIN, size: LAPTOP, out: "ordio/summary.png" },
  { file: img("20260903163559"), scale: 1, crop: { x: 522, y: 124, w: 800, h: 1731 }, size: PHONE, out: "ordio/menu.png" },
  { file: img("20260903163613"), scale: 1, crop: { x: 530, y: 128, w: 800, h: 1731 }, size: PHONE, out: "ordio/item.png" },
];

(async () => {
  for (const job of jobs) await make(job);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
