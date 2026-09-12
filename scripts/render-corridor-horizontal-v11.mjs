import sharp from "sharp";

const basePath = "public/maritime-hmi/corridor/outside-horizontal-v2.webp";
const cleanTarget = await sharp("public/maritime-hmi/corridor/outside-vertical-v2.webp")
  .extract({ left: 395, top: 500, width: 140, height: 116 })
  .toBuffer();
const overlay = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="760" viewBox="0 0 760 760">
  <defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#111" flood-opacity=".2"/></filter></defs>
  <path d="M300 600L463 505" fill="none" stroke="#161616" stroke-width="2.5" stroke-dasharray="7 8"/>
  <g transform="translate(470 515) rotate(-29)" filter="url(#s)">
    <path d="M-61-27h77l29 27-29 27h-77z" fill="#d8e5df" stroke="#4f5c57" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-45-17h52l18 17-18 17h-52z" fill="#c5d6cf" stroke="#65736d" stroke-width="2"/>
    <path d="M-18-13v26M4-13v26" stroke="#7d8d86" stroke-width="2"/><path d="M-58-20v40" stroke="#46534e" stroke-width="4"/>
    <circle cx="0" cy="0" r="5" fill="#f8f8f8" stroke="#6d7772" stroke-width="2"/>
  </g>
</svg>`;
await sharp(basePath).composite([{ input: cleanTarget, left: 395, top: 500 }, { input: Buffer.from(overlay), left: 0, top: 0 }]).webp({ quality: 94 }).toFile(".tmp/corridor-outside-horizontal-v11.webp");
