// Run: powershell -NoProfile -File scripts/extract-volvo-media.ps1
//      node scripts/convert-volvo-assets.mjs
// The web page uses extracted source assets, never flattened portfolio slides.
import { readFile, readdir, mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { getDocument, OPS } from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'scratch/volvo/media');
const out = path.join(root, 'public/volvo/assets');
await mkdir(out, { recursive: true });
const manifest = [];

// Asset IDs refer to the supplied Slutpresentation_kandidatarbetet.pptx.
const pictures = [
  ['image13.png', 'aurora-cab', 1920, 'Slide 14: concept video poster'],
  ['image11.jpg', 'life-on-the-road', 1024, 'Slide 12: Volvo Trucks scene'],
  ['image6.png', 'driver', 1200, 'Slide 7: Volvo Trucks driver photograph'],
  ['image7.png', 'young-people', 988, 'Slide 8: young people photograph'],
  ['image12.jpg', 'mood-northern-lights', 2000, 'Slide 17: Northern lights cab concept'],
  ['image23.jpg', 'mood-fire', 2000, 'Slide 18: Fire cab concept'],
  ['image25.jpg', 'mood-forest', 2000, 'Slide 19: Forest cab concept'],
  ['image22.jpg', 'mood-sea', 2000, 'Slide 20: Sea cab concept'],
  ['image28.jpg', 'mood-sunset', 2000, 'Slide 21: Sunset cab concept'],
  ['image18.jpg', 'nature-northern-lights', 720, 'Slide 17: nature reference'],
  ['image20.png', 'nature-fire', 720, 'Slide 18: nature reference'],
  ['image24.jpg', 'nature-forest', 720, 'Slide 19: nature reference'],
  ['image26.jpg', 'nature-sea', 720, 'Slide 20: nature reference'],
  ['image27.png', 'nature-sunset', 720, 'Slide 21: nature reference'],
  ['image16.jpg', 'default-morning', 1200, 'Slide 16: morning lighting concept'],
  ['image17.jpg', 'default-evening', 1200, 'Slide 16: evening lighting concept'],
  ['greeting-poster.jpg', 'greeting-poster', 1600, 'Slide 22: media7.mp4 at 6.5 seconds'],
];
for (const [file, name, width, origin] of pictures) {
  const result = await sharp(path.join(source, file))
    .resize({ width, withoutEnlargement: true }).webp({ quality: 88 })
    .toFile(path.join(out, `${name}.webp`));
  manifest.push({ file: `${name}.webp`, source: file, origin, width: result.width, height: result.height });
}

const reportName = (await readdir(path.join(root, 'public/volvo'))).find(n => n.startsWith('Grupp') && n.endsWith('.pdf'));
if (!reportName) throw new Error('Original Volvo report not found.');
const reportTask = getDocument({ data: new Uint8Array(await readFile(path.join(root, 'public/volvo', reportName))) });
const report = await reportTask.promise;
for (const [pageNumber, name, imageIndex] of [[47, 'research-kj', 0], [67, 'concept-lux', 0], [68, 'concept-inmotion', 0], [70, 'concept-embrace', 0]]) {
  const page = await report.getPage(pageNumber);
  const operators = await page.getOperatorList();
  const ids = operators.fnArray.flatMap((op, i) => op === OPS.paintImageXObject ? [operators.argsArray[i][0]] : []);
  const image = await new Promise(resolve => page.objs.get(ids[imageIndex], resolve));
  if (image.kind !== 2) throw new Error(`Unexpected image format on report page ${pageNumber}.`);
  const result = await sharp(Buffer.from(image.data), { raw: { width: image.width, height: image.height, channels: 3 } })
    .webp({ quality: 90 }).toFile(path.join(out, `${name}.webp`));
  manifest.push({ file: `${name}.webp`, source: reportName, page: pageNumber, width: result.width, height: result.height });
}
await reportTask.destroy();
for (const [original, name, slide] of [['media1.mp4', 'aurora-cab.mp4', 14], ['media7.mp4', 'greeting.mp4', 22]]) {
  await copyFile(path.join(source, original), path.join(out, name));
  manifest.push({ file: name, source: original, slide, width: 1920, height: 1080 });
}
await sharp(path.join(root, 'public/home/avatar.jpg')).resize(48, 48).png().toFile(path.join(out, 'icon.png'));
manifest.push({ file: 'icon.png', source: 'public/home/avatar.jpg', origin: 'Existing portfolio avatar', width: 48, height: 48 });
await writeFile(path.join(out, 'sources.json'), JSON.stringify({ deck: 'Slutpresentation_kandidatarbetet.pptx', assets: manifest }, null, 2) + '\n');
console.log(`Prepared ${manifest.length} Volvo assets in public/volvo/assets.`);
