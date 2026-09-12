import sharp from "sharp";

const overlay = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="760" viewBox="0 0 760 760">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#111" flood-opacity=".18"/>
    </filter>
  </defs>
  <g transform="translate(470 515) rotate(-29)" filter="url(#shadow)">
    <path d="M-61-31h77l31 31-31 31h-77z" fill="#d8e5df" stroke="#4f5c57" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-45-21h52l21 21-21 21h-52z" fill="#c5d6cf" stroke="#65736d" stroke-width="2"/>
    <path d="M-19-17v34M3-17v34" stroke="#7d8d86" stroke-width="2"/>
    <path d="M-58-23v46" stroke="#46534e" stroke-width="5"/>
    <circle cx="0" cy="0" r="6" fill="#f8f8f8" stroke="#6d7772" stroke-width="2"/>
  </g>
</svg>`;

await sharp("public/maritime-hmi/corridor/outside-horizontal-v2.webp")
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .webp({ quality: 94 })
  .toFile(".tmp/corridor-outside-horizontal-v7.webp");
