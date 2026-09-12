import sharp from "sharp";

await sharp(".tmp/corridor-ppt/horizontal.png")
  .flatten({ background: "#fff" })
  .trim({ background: "#fff", threshold: 8 })
  .resize(760, 760, { fit: "contain", background: "#fff" })
  .webp({ quality: 94 })
  .toFile(".tmp/corridor-outside-horizontal-v13.webp");
