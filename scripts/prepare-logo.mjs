import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const source = "logo.jpeg";
const outputDirectory = "public/brand";

await mkdir(outputDirectory, { recursive: true });

async function removeWhiteBackground(input, extract) {
  let pipeline = sharp(input);
  if (extract) pipeline = pipeline.extract(extract);

  const { data, info } = await pipeline
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const output = Buffer.alloc(info.width * info.height * 4);

  for (let sourceIndex = 0, outputIndex = 0; sourceIndex < data.length; sourceIndex += 3, outputIndex += 4) {
    const red = data[sourceIndex];
    const green = data[sourceIndex + 1];
    const blue = data[sourceIndex + 2];
    const distanceFromWhite = Math.max(255 - red, 255 - green, 255 - blue);
    const alpha = distanceFromWhite <= 5
      ? 0
      : distanceFromWhite >= 22
        ? 255
        : Math.round(((distanceFromWhite - 5) / 17) * 255);
    const opacity = alpha / 255;

    output[outputIndex] = alpha === 0 ? 0 : Math.max(0, Math.min(255, Math.round((red - 255 * (1 - opacity)) / opacity)));
    output[outputIndex + 1] = alpha === 0 ? 0 : Math.max(0, Math.min(255, Math.round((green - 255 * (1 - opacity)) / opacity)));
    output[outputIndex + 2] = alpha === 0 ? 0 : Math.max(0, Math.min(255, Math.round((blue - 255 * (1 - opacity)) / opacity)));
    output[outputIndex + 3] = alpha;
  }

  return sharp(output, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .extend({ top: 28, right: 28, bottom: 28, left: 28, background: { r: 0, g: 0, b: 0, alpha: 0 } });
}

await (await removeWhiteBackground(source))
  .resize({ width: 1000, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(`${outputDirectory}/coreserve-logo.png`);

await (await removeWhiteBackground(source, { left: 520, top: 100, width: 500, height: 500 }))
  .resize({ width: 512, height: 512, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(`${outputDirectory}/coreserve-mark.png`);

await sharp(`${outputDirectory}/coreserve-mark.png`)
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile("app/icon.png");

await sharp(`${outputDirectory}/coreserve-logo.png`)
  .flatten({ background: "#f2f7f8" })
  .png()
  .toFile(".impeccable/review/logo-on-light.png");

await sharp(`${outputDirectory}/coreserve-logo.png`)
  .flatten({ background: "#10243a" })
  .png()
  .toFile(".impeccable/review/logo-on-dark.png");

console.log("Prepared transparent Coreserve logo assets.");
