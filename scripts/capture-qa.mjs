import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = "http://127.0.0.1:8788";
const outputDir = ".impeccable/review";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
const captures = [
  { name: "desktop", path: "/", viewport: { width: 1440, height: 1000 } },
  { name: "mobile", path: "/", viewport: { width: 390, height: 844 }, isMobile: true },
  { name: "services-desktop", path: "/services/", viewport: { width: 1440, height: 1000 } },
  { name: "contact-mobile", path: "/contact/", viewport: { width: 390, height: 844 }, isMobile: true },
];

const results = [];

for (const capture of captures) {
  const context = await browser.newContext({
    viewport: capture.viewport,
    isMobile: capture.isMobile ?? false,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const response = await page.goto(`${baseUrl}${capture.path}`, { waitUntil: "load", timeout: 15_000 });
  await page.locator("body").waitFor({ state: "visible", timeout: 5_000 });
  await page.screenshot({ path: `${outputDir}/${capture.name}.png`, fullPage: true });
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    documentHeight: document.documentElement.scrollHeight,
  }));
  results.push({ name: capture.name, status: response?.status(), ...dimensions, horizontalOverflow: dimensions.documentWidth > dimensions.viewportWidth });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
