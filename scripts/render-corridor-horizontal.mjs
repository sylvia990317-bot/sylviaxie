import sharp from "sharp";

const overlay = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="760" viewBox="0 0 760 760">
  <defs>
    <radialGradient id="disc" cx="50%" cy="44%" r="62%">
      <stop offset="0" stop-color="#fff"/>
      <stop offset=".78" stop-color="#f8f8f8"/>
      <stop offset="1" stop-color="#ececec"/>
    </radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#111" flood-opacity=".2"/>
    </filter>
  </defs>
  <!-- The base image supplies the original circle, corridor, compass marks, and indicators. -->
  <path d="M300 600L463 505" fill="none" stroke="#161616" stroke-width="2.5" stroke-dasharray="7 8"/>
  <path d="M470 505L587 428" fill="none" stroke="#111" stroke-width="3"/>

  <!-- CSTRIDER vessel: aligned with the route, with only a small sideways deviation -->
  <g transform="translate(470 505) rotate(-29)" filter="url(#shadow)">
    <path d="M-55-20h73l24 20-24 20h-73z" fill="#d8e5df" stroke="#4f5c57" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-38-13h50l15 13-15 13h-50z" fill="#c5d6cf" stroke="#65736d" stroke-width="2"/>
    <path d="M-12-10v20M7-10v20" stroke="#7d8d86" stroke-width="2"/>
    <path d="M-51-14v28" stroke="#46534e" stroke-width="4"/>
    <circle cx="0" cy="0" r="5" fill="#f8f8f8" stroke="#6d7772" stroke-width="2"/>
  </g>

</svg>`;

const base = sharp("public/maritime-hmi/corridor/outside-horizontal-v2.webp");
const softenedVesselArea = await base.clone().extract({ left: 390, top: 438, width: 150, height: 178 }).blur(7).toBuffer();
await base
  .composite([
    { input: softenedVesselArea, top: 438, left: 390 },
    { input: Buffer.from(overlay), top: 0, left: 0 },
  ])
  .webp({ quality: 94 })
  .toFile(".tmp/corridor-outside-horizontal-v4.webp");
