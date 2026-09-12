import sharp from "sharp";

const basePath = "public/maritime-hmi/corridor/outside-horizontal-v2.webp";
const cleanReference = "public/maritime-hmi/corridor/outside-vertical-v2.webp";

// The vertical state has the same instrument and corridor geometry, with this target
// area free of a vessel. Use it as a pixel-faithful patch over the old sideways vessel.
const cleanTarget = await sharp(cleanReference)
  .extract({ left: 390, top: 438, width: 150, height: 178 })
  .toBuffer();

const overlay = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="760" viewBox="0 0 760 760">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#111" flood-opacity=".2"/>
    </filter>
  </defs>
  <path d="M300 600L463 505" fill="none" stroke="#161616" stroke-width="2.5" stroke-dasharray="7 8"/>
  <g transform="translate(470 515) rotate(-29)" filter="url(#shadow)">
    <path d="M-55-22h71l24 22-24 22h-71z" fill="#d8e5df" stroke="#4f5c57" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-40-14h48l16 14-16 14h-48z" fill="#c5d6cf" stroke="#65736d" stroke-width="2"/>
    <path d="M-16-11v22M5-11v22" stroke="#7d8d86" stroke-width="2"/>
    <path d="M-52-16v32" stroke="#46534e" stroke-width="4"/>
    <circle cx="0" cy="0" r="5" fill="#f8f8f8" stroke="#6d7772" stroke-width="2"/>
  </g>
</svg>`;

await sharp(basePath)
  .composite([
    { input: cleanTarget, left: 390, top: 438 },
    { input: Buffer.from(overlay), left: 0, top: 0 },
  ])
  .webp({ quality: 94 })
  .toFile(".tmp/corridor-outside-horizontal-v10.webp");
