/**
 * Dependency-free PWA icon generator for RETRO CALC.
 *
 * Draws a 16x16 pixel-art calculator (LCD + 3x3 keypad) in the app palette and
 * rasterises it to public/icon-192.png and public/icon-512.png using only the
 * Node built-in `zlib`. Re-run with:  node scripts/generate-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

// ---- palette (matches src/app/globals.css @theme) --------------------------
const C = {
  caseBody: [0xf6, 0xd0, 0xdc, 0xff], // soft pink plastic case
  caseEdge: [0xe0, 0xa2, 0xbc, 0xff], // case border
  lcdFrame: [0x5a, 0x26, 0x36, 0xff], // bezel around the screen
  wine: [0x3c, 0x15, 0x21, 0xff], // dark CRT glass
  lcdInk: [0xf4, 0xb8, 0xd3, 0xff], // glowing pink digits
  num: [0x49, 0x21, 0x2f, 0xff], // dark aubergine number keys
  hot: [0xef, 0x78, 0xa7, 0xff], // hot-pink operator column
  bright: [0xe8, 0x5f, 0x97, 0xff], // brighter "=" key
};

const GRID = 16;

/** color of logical cell (row r, col c) on the 16x16 design grid */
function cell(r, c) {
  // outer 1-cell case border
  if (r === 0 || r === GRID - 1 || c === 0 || c === GRID - 1) return C.caseEdge;

  // LCD screen: bezel rows 1..5 / cols 1..14, glass rows 2..4 / cols 2..13
  if (r >= 1 && r <= 5 && c >= 1 && c <= 14) {
    if (r >= 2 && r <= 4 && c >= 2 && c <= 13) {
      // hint of a right-aligned number on the display
      if (r === 3 && c >= 8 && c <= 12) return C.lcdInk;
      return C.wine;
    }
    return C.lcdFrame;
  }

  // 4-column keypad: 3 dark number columns + 1 hot-pink operator column
  const rowsInBtn =
    (r >= 7 && r <= 8) || (r >= 10 && r <= 11) || (r >= 13 && r <= 14);
  const col =
    c >= 2 && c <= 3
      ? 0
      : c >= 6 && c <= 7
        ? 1
        : c >= 9 && c <= 10
          ? 2
          : c >= 12 && c <= 13
            ? 3
            : -1;
  if (rowsInBtn && col >= 0) {
    if (col === 3) return r >= 13 ? C.bright : C.hot; // bottom key = "="
    return C.num;
  }

  return C.caseBody;
}

// ---- minimal PNG (RGBA, 8-bit, no interlace) -----------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "latin1");
  const body = Buffer.concat([typeBuf, data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
}

function encodePng(size) {
  const scale = size / GRID;
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);

  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // per-row PNG predictor byte (0 = none)
    const r = Math.floor(y / scale);
    for (let x = 0; x < size; x++) {
      const [rr, gg, bb, aa] = cell(r, Math.floor(x / scale));
      const o = y * (stride + 1) + 1 + x * 4;
      raw[o] = rr;
      raw[o + 1] = gg;
      raw[o + 2] = bb;
      raw[o + 3] = aa;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const size of [192, 512]) {
  const file = join(OUT_DIR, `icon-${size}.png`);
  writeFileSync(file, encodePng(size));
  console.log(`wrote ${file}`);
}
