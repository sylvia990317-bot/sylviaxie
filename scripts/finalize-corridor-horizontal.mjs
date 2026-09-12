import sharp from "sharp";

const originalMarks = await sharp("public/maritime-hmi/corridor/outside-horizontal-v2.webp")
  .extract({ left: 615, top: 120, width: 145, height: 280 })
  .toBuffer();

await sharp("public/maritime-hmi/corridor/outside-horizontal-v3.webp")
  .composite([{ input: originalMarks, left: 615, top: 120 }])
  .webp({ quality: 94 })
  .toFile(".tmp/corridor-outside-horizontal-v5.webp");
