/* Builds public/post-harvest/diagram/seme-locator.svg — the Section 02 locator graphic.
 *
 * Redrawn from real geodata (see SOURCES) rather than traced off the booklet page, because
 * the traced version started at an unfamiliar local scale: no country context, and water and
 * land were near-identical near-whites. See CHANGELOG.md.
 *
 * Composition is two-level:
 *   1. a small inset of the whole of Kenya, with the study region boxed in deep blue
 *   2. a larger simplified local map: Lake Victoria, Siaya County, and the Seme marker
 * Deep blue (--blue #17357a) is reserved for the Seme marker and the inset -> detail cue.
 * Everything else is pale grey; water is a cooler, darker grey so it can never read as land.
 *
 * Run:  node scripts/build-seme-locator.mjs
 * Source geometry is fetched once and cached in scripts/.cache/ (not committed).
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/post-harvest/diagram/seme-locator.svg';
const CACHE = 'scripts/.cache';

// SOURCES — all public domain / open, pinned to an immutable ref where the host allows it.
const SOURCES = {
  // Natural Earth 1:50m countries (public domain) — the Kenya national outline for the inset.
  countries: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson',
  // Natural Earth 1:10m lakes (public domain) — Lake Victoria's true shoreline.
  lakes: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson',
  // geoBoundaries gbOpen KEN ADM1 (public domain, RCMRD via Africa GeoPortal) — county boundaries.
  counties: 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/KEN/ADM1/geoBoundaries-KEN-ADM1_simplified.geojson',
  // geoBoundaries gbOpen KEN ADM2 — sub-counties, used only to place the Seme marker honestly.
  subcounties: 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/KEN/ADM2/geoBoundaries-KEN-ADM2_simplified.geojson',
};

async function load(key) {
  const file = path.join(CACHE, key + '.geojson');
  if (!fs.existsSync(file)) {
    fs.mkdirSync(CACHE, { recursive: true });
    const res = await fetch(SOURCES[key]);
    if (!res.ok) throw new Error(key + ': HTTP ' + res.status);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/* ---------- geometry helpers (lon/lat degrees in, SVG user units out) ---------- */

const ringsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
const outerRings = (g) => ringsOf(g).map((p) => p[0]);
const biggest = (g) => outerRings(g).slice().sort((a, b) => b.length - a.length)[0];

/** Ramer-Douglas-Peucker, tolerance in degrees. Keeps the shape, drops the noise. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const sq = (v) => v * v;
  const segDist = (p, a, b) => {
    let x = a[0];
    let y = a[1];
    const dx = b[0] - x;
    const dy = b[1] - y;
    if (dx || dy) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (sq(dx) + sq(dy));
      if (t > 1) { x = b[0]; y = b[1]; }
      else if (t > 0) { x += dx * t; y += dy * t; }
    }
    return sq(p[0] - x) + sq(p[1] - y);
  };
  const keep = new Array(pts.length).fill(false);
  keep[0] = true;
  keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    let maxD = 0;
    let idx = -1;
    for (let k = i + 1; k < j; k++) {
      const d = segDist(pts[k], pts[i], pts[j]);
      if (d > maxD) { maxD = d; idx = k; }
    }
    if (maxD > sq(tol) && idx > 0) { keep[idx] = true; stack.push([i, idx], [idx, j]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Equirectangular fit of [lon0, lat0, lon1, lat1] into an SVG rect. The whole subject sits
 *  within ~5 deg of the equator, so cos(lat) is 0.996-1.0 and no correction is worth it. */
function projector(extent, box) {
  const [lon0, lat0, lon1, lat1] = extent;
  return (c) => [
    box.x + ((c[0] - lon0) / (lon1 - lon0)) * box.w,
    box.y + ((lat1 - c[1]) / (lat1 - lat0)) * box.h,
  ];
}

const toPath = (ring, project, tol) =>
  simplify(ring, tol)
    .map(project)
    .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1))
    .join('') + 'Z';

const pathsOf = (geom, project, tol, minPts = 8) =>
  outerRings(geom)
    .filter((r) => r.length >= minPts)
    .map((r) => toPath(r, project, tol))
    .join(' ');

function centroid(geom) {
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (const r of outerRings(geom)) for (const c of r) { sx += c[0]; sy += c[1]; n++; }
  return [sx / n, sy / n];
}

/* ---------- build ---------- */

const [countries, lakes, counties, subcounties] = await Promise.all(
  ['countries', 'lakes', 'counties', 'subcounties'].map(load)
);

const kenya = countries.features.find((f) => f.properties.ADMIN === 'Kenya').geometry;
const victoria = lakes.features.find((f) => /^Lake Victoria$/i.test(f.properties.name || '')).geometry;
const siaya = counties.features.find((f) => f.properties.shapeName === 'Siaya').geometry;
const seme = centroid(subcounties.features.find((f) => f.properties.shapeName === 'Seme').geometry);

// Canvas. 1000 units wide; the figure renders at .ph-v2-map's 340px cap, so the smallest
// label here is ~9px on screen. Anything that could not survive that is not drawn at all.
const W = 1000;
const H = 1216;
const INSET = { x: 24, y: 76, w: 214, h: 260 };   // Kenya, whole country
const FRAME = { x: 24, y: 396, w: 952, h: 798 };  // the local map
const KENYA_EXTENT = [33.85, -4.78, 41.95, 5.06];
const LOCAL_EXTENT = [33.02, -1.52, 35.62, 0.66]; // 2.60 x 2.18 deg — matches FRAME's aspect

const pKenya = projector(KENYA_EXTENT, INSET);
const pLocal = projector(LOCAL_EXTENT, FRAME);

// The inset's blue box is exactly what the frame below shows — same extent, drawn twice.
const c0 = pKenya([LOCAL_EXTENT[0], LOCAL_EXTENT[3]]);
const c1 = pKenya([LOCAL_EXTENT[2], LOCAL_EXTENT[1]]);
const box = {
  x: Math.min(c0[0], c1[0]),
  y: Math.min(c0[1], c1[1]),
  w: Math.abs(c1[0] - c0[0]),
  h: Math.abs(c1[1] - c0[1]),
};

const semePt = pLocal(seme);

const C = {
  paper: '#fbfbfa',
  land: '#eceae6',     // land inside Kenya
  landOut: '#f4f3f1',  // land outside Kenya — quietly answers "which side is Kenya"
  region: '#dbd9d4',   // Siaya County
  line: '#c6c4bf',
  water: '#b9c4d2',    // cooler AND darker than every land tone: never reads as land
  waterLine: '#98a6b8',
  ink: '#454b54',
  muted: '#787d85',
  blue: '#17357a',     // reserved: the Seme marker and the inset -> detail cue
};

const n = (v) => v.toFixed(1);

const svg = `<svg font-family="Geist, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Two part locator map. A small inset of the whole of Kenya boxes the study region in the far west of the country. The larger detail map below shows Lake Victoria as darker grey water, Siaya County on its north east shore, and the Seme field site marked in deep blue.">
<rect width="${W}" height="${H}" fill="${C.paper}"/>
<defs><clipPath id="loc-frame"><rect x="${FRAME.x}" y="${FRAME.y}" width="${FRAME.w}" height="${FRAME.h}"/></clipPath></defs>

<!-- ===== 1 / inset: the whole of Kenya, so the reader starts from a shape they know ===== -->
<text x="${INSET.x}" y="${INSET.y - 24}" class="m" font-size="27" letter-spacing="0.15em" fill="${C.muted}">KENYA</text>
<path d="${pathsOf(kenya, pKenya, 0.045, 20)}" fill="${C.land}" stroke="${C.line}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${toPath(biggest(victoria), pKenya, 0.05)}" fill="${C.water}"/>
<rect x="${n(box.x)}" y="${n(box.y)}" width="${n(box.w)}" height="${n(box.h)}" fill="none" stroke="${C.blue}" stroke-width="3.2"/>

<!-- the connecting cue: the boxed region opens downward into the detail frame -->
<path d="M${n(box.x)},${n(box.y + box.h)}L${FRAME.x},${FRAME.y} M${n(box.x + box.w)},${n(box.y + box.h)}L${FRAME.x + FRAME.w},${FRAME.y}" stroke="${C.blue}" stroke-width="1.6" opacity="0.4" fill="none"/>

<text x="${INSET.x + INSET.w + 48}" y="${INSET.y + 44}" class="s" font-size="42" font-weight="600" letter-spacing="-0.015em" fill="${C.ink}">Western Kenya</text>
<text x="${INSET.x + INSET.w + 48}" y="${INSET.y + 96}" class="m" font-size="26" letter-spacing="0.13em" fill="${C.muted}">LAKE VICTORIA BASIN</text>

<!-- ===== 2 / detail: Lake Victoria, Siaya County, Seme ===== -->
<g clip-path="url(#loc-frame)">
  <rect x="${FRAME.x}" y="${FRAME.y}" width="${FRAME.w}" height="${FRAME.h}" fill="${C.landOut}"/>
  <path d="${pathsOf(kenya, pLocal, 0.008, 20)}" fill="${C.land}" stroke="${C.line}" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="${pathsOf(siaya, pLocal, 0.005)}" fill="${C.region}" stroke="${C.line}" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="${toPath(biggest(victoria), pLocal, 0.006)}" fill="${C.water}" stroke="${C.waterLine}" stroke-width="1.8" stroke-linejoin="round"/>
</g>
<rect x="${FRAME.x}" y="${FRAME.y}" width="${FRAME.w}" height="${FRAME.h}" fill="none" stroke="${C.line}" stroke-width="1.6"/>

<text x="${FRAME.x + 30}" y="${FRAME.y + FRAME.h - 36}" class="s" font-size="40" font-style="italic" fill="#3d4a5c">Lake Victoria</text>
<text x="${FRAME.x + 26}" y="${FRAME.y + 58}" class="m" font-size="27" letter-spacing="0.14em" fill="${C.muted}">SIAYA COUNTY</text>

<circle cx="${n(semePt[0])}" cy="${n(semePt[1])}" r="31" fill="none" stroke="${C.blue}" stroke-width="2.6" opacity="0.5"/>
<circle cx="${n(semePt[0])}" cy="${n(semePt[1])}" r="13" fill="${C.blue}"/>
<text x="${n(semePt[0] + 48)}" y="${n(semePt[1] + 13)}" class="s" font-size="35" font-weight="600" letter-spacing="0.015em" fill="${C.blue}">SEME — FIELD SITE</text>
</svg>
`;

fs.writeFileSync(OUT, svg);
console.log('wrote ' + OUT + ' (' + svg.length + ' bytes); Seme marker at ' + seme.map((v) => v.toFixed(3)).join(', '));
