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

/** Sutherland-Hodgman clip of a ring to [lon0, lat0, lon1, lat1]. The whole file is inlined
 *  into the page's HTML by inline-svg.tsx, so geometry outside the frame is pure page weight:
 *  Lake Victoria alone is mostly Tanzanian and never visible here. */
function clipRing(ring, boxExt) {
  const [x0, y0, x1, y1] = boxExt;
  const edges = [
    [(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]],
  ];
  let out = ring;
  for (const [inside, cross] of edges) {
    const src = out;
    out = [];
    for (let i = 0; i < src.length; i++) {
      const cur = src[i];
      const prev = src[(i + src.length - 1) % src.length];
      const curIn = inside(cur);
      if (curIn !== inside(prev)) out.push(cross(prev, cur));
      if (curIn) out.push(cur);
    }
    if (!out.length) return [];
  }
  return out;
}

const toPath = (ring, project, tol, clip) => {
  const r = clip ? clipRing(ring, clip) : ring;
  if (r.length < 3) return '';
  return (
    simplify(r, tol)
      .map(project)
      .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1))
      .join('') + 'Z'
  );
};

const pathsOf = (geom, project, tol, minPts = 8, clip) =>
  outerRings(geom)
    .filter((r) => r.length >= minPts)
    .map((r) => toPath(r, project, tol, clip))
    .filter(Boolean)
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
const seme = centroid(subcounties.features.find((f) => f.properties.shapeName === 'Seme').geometry);

// WHICH COUNTY. The booklet header says "Seme, Siaya County", and that is wrong. Grid-sampling
// the Seme ADM2 polygon against every ADM1 county puts 99.7% of its area in KISUMU County (the
// 0.3% in Siaya is boundary-sampling noise), and Seme is one of Kisumu's seven constituencies —
// created in 2012, 268 sq km, pop. 121,667, which also matches content.ts's own "about 450 per
// square kilometre". Siaya is the county next door, immediately west. Labels follow the data.
const host = counties.features.find((f) => f.properties.shapeName === 'Kisumu').geometry;
// The county's own centroid lands on the gulf shore, where the label would straddle water. This
// anchor was picked by testing the label's whole width for "inside Kisumu and clear of the lake".
const hostLabelAt = [35.0, -0.15];

// Canvas. 1000 units wide; the figure renders at .ph-v2-map's 340px cap, so the smallest label
// here is ~9px on screen. Anything that could not survive that is not drawn at all.
//
// LAYOUT: two panels, stacked and fully separated — no shared edge, no overlap, and no
// projection lines between them. Reading order is carried by the two numbered titles and by one
// small arrow standing in the gap.
const W = 1000;
const P1 = { x: 335, y: 74, w: 330, h: 350 };  // panel 01 — the whole country
const P2 = { x: 24, y: 634, w: 952, h: 660 };  // panel 02 — the local map
// The arrow lives entirely in the gap, clear of panel 02's title — it is the only mark that
// crosses between the panels, and it never touches either frame.
const ARROW = { y: 468, top: 486, tip: 536 };
const H = P2.y + P2.h + 26;

const KENYA_EXTENT = [33.85, -4.78, 41.95, 5.06];
// 1.80 x 1.248 deg, matching P2's aspect. Wide enough east to hold all of Kisumu County, far
// enough south and west that Lake Victoria fills the corner and reads as a lake, not a bay.
const LOCAL_EXTENT = [33.55, -0.688, 35.35, 0.56];

// Kenya sits centred in panel 01, at its true 0.823 aspect.
const INSET = { x: P1.x + (P1.w - 239) / 2, y: P1.y + (P1.h - 290) / 2, w: 239, h: 290 };

const pKenya = projector(KENYA_EXTENT, INSET);
const pLocal = projector(LOCAL_EXTENT, P2);

// The highlight in panel 01 is exactly what panel 02 shows — the same extent, drawn twice.
const c0 = pKenya([LOCAL_EXTENT[0], LOCAL_EXTENT[3]]);
const c1 = pKenya([LOCAL_EXTENT[2], LOCAL_EXTENT[1]]);
const box = {
  x: Math.min(c0[0], c1[0]),
  y: Math.min(c0[1], c1[1]),
  w: Math.abs(c1[0] - c0[0]),
  h: Math.abs(c1[1] - c0[1]),
};

// Everything in panel 02 is clipped to the extent (plus a hair, so the clip seam falls outside
// the visible rect) before it is simplified. inline-svg.tsx injects this file into the page's
// HTML, so geometry that is never drawn is pure page weight.
const CLIP = [
  LOCAL_EXTENT[0] - 0.02,
  LOCAL_EXTENT[1] - 0.02,
  LOCAL_EXTENT[2] + 0.02,
  LOCAL_EXTENT[3] + 0.02,
];

// Kenya's landmass in panel 02 is the union of its 47 counties, not the 1:50m national outline:
// at this scale the coarse national polygon leaves visible slivers of "not Kenya" along the lake
// shore. Filled, never stroked — internal county lines would be noise here.
const kenyaLocal = counties.features
  .map((f) => pathsOf(f.geometry, pLocal, 0.004, 6, CLIP))
  .filter(Boolean)
  .join(' ');

// Panel 01 keeps a clean country silhouette: the lake is clipped to Kenya, so the Ugandan and
// Tanzanian two thirds of Lake Victoria do not trail off its west side as an unexplained blob.
const kenyaInsetPath = pathsOf(kenya, pKenya, 0.045, 20);

const semePt = pLocal(seme);
const hostLabel = pLocal(hostLabelAt);

const C = {
  paper: '#fbfbfa',
  panel: '#ffffff',
  land: '#e8e6e0',     // land inside Kenya
  landOut: '#f5f4f2',  // land outside Kenya — quietly answers "which side is Kenya"
  region: '#dbd9d4',   // the county the field site is in
  line: '#c6c4bf',
  water: '#b9c4d2',    // cooler AND darker than every land tone: never reads as land
  waterLine: '#98a6b8',
  ink: '#454b54',
  muted: '#787d85',
  blue: '#17357a',     // reserved: the Seme marker, the panel-01 highlight, the ZOOM IN arrow
};

const n = (v) => v.toFixed(1);
const mid = P1.x + P1.w / 2;

const svg = `<svg font-family="Geist, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Locator in two stacked panels. Panel 01, western Kenya: the outline of the whole country with a deep blue box over its far west. An arrow labelled zoom in points down to panel 02, Seme field site: a local map in which Lake Victoria is darker grey water, Kisumu County is the pale grey region on its north east shore, and Seme is marked in deep blue at that county's western tip.">
<rect width="${W}" height="${H}" fill="${C.paper}"/>
<defs>
<clipPath id="loc-frame"><rect x="${P2.x}" y="${P2.y}" width="${P2.w}" height="${P2.h}"/></clipPath>
<clipPath id="loc-kenya"><path d="${kenyaInsetPath}"/></clipPath>
</defs>

<!-- ===== panel 01 — the whole country, so the reader starts from a shape they know ===== -->
<text x="${P1.x}" y="${P1.y - 22}" class="m" font-size="28" letter-spacing="0.15em" fill="${C.muted}">01 / <tspan fill="${C.ink}">WESTERN KENYA</tspan></text>
<rect x="${P1.x}" y="${P1.y}" width="${P1.w}" height="${P1.h}" fill="${C.landOut}" stroke="${C.line}" stroke-width="1.6"/>
<path d="${kenyaInsetPath}" fill="${C.land}" stroke="${C.line}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${toPath(biggest(victoria), pKenya, 0.05)}" fill="${C.water}" clip-path="url(#loc-kenya)"/>
<rect x="${n(box.x)}" y="${n(box.y)}" width="${n(box.w)}" height="${n(box.h)}" fill="${C.blue}" fill-opacity="0.14" stroke="${C.blue}" stroke-width="3.2"/>

<!-- ===== the only thing joining the panels: one arrow, standing in the gap ===== -->
<text x="${mid}" y="${ARROW.y}" text-anchor="middle" class="m" font-size="26" letter-spacing="0.19em" fill="${C.blue}">ZOOM IN</text>
<path d="M${mid},${ARROW.top}L${mid},${ARROW.tip - 16}" stroke="${C.blue}" stroke-width="3"/>
<path d="M${mid - 13},${ARROW.tip - 22}L${mid},${ARROW.tip}L${mid + 13},${ARROW.tip - 22}Z" fill="${C.blue}"/>

<!-- ===== panel 02 — Lake Victoria, the county, and the field site ===== -->
<text x="${P2.x}" y="${P2.y - 22}" class="m" font-size="28" letter-spacing="0.15em" fill="${C.muted}">02 / <tspan fill="${C.blue}">SEME — FIELD SITE</tspan></text>
<g clip-path="url(#loc-frame)">
  <rect x="${P2.x}" y="${P2.y}" width="${P2.w}" height="${P2.h}" fill="${C.landOut}"/>
  <path d="${kenyaLocal}" fill="${C.land}" stroke="${C.land}" stroke-width="2" stroke-linejoin="round"/>
  <path d="${pathsOf(host, pLocal, 0.004, 8, CLIP)}" fill="${C.region}" stroke="${C.line}" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="${toPath(biggest(victoria), pLocal, 0.003, CLIP)}" fill="${C.water}" stroke="${C.waterLine}" stroke-width="1.8" stroke-linejoin="round"/>
</g>
<rect x="${P2.x}" y="${P2.y}" width="${P2.w}" height="${P2.h}" fill="none" stroke="${C.line}" stroke-width="1.6"/>

<text x="${P2.x + 30}" y="${P2.y + P2.h - 34}" class="s" font-size="40" font-style="italic" fill="#3d4a5c">Lake Victoria</text>
<text x="${n(hostLabel[0])}" y="${n(hostLabel[1])}" text-anchor="middle" class="m" font-size="27" letter-spacing="0.14em" fill="#56524b">KISUMU COUNTY</text>

<text x="${n(semePt[0])}" y="${n(semePt[1] - 48)}" text-anchor="middle" class="s" font-size="36" font-weight="600" letter-spacing="0.02em" fill="${C.blue}">SEME</text>
<circle cx="${n(semePt[0])}" cy="${n(semePt[1])}" r="31" fill="none" stroke="${C.blue}" stroke-width="2.6" opacity="0.5"/>
<circle cx="${n(semePt[0])}" cy="${n(semePt[1])}" r="13" fill="${C.blue}"/>
</svg>
`;

fs.writeFileSync(OUT, svg);
console.log('wrote ' + OUT + ' (' + svg.length + ' bytes); Seme marker at ' + seme.map((v) => v.toFixed(3)).join(', '));
