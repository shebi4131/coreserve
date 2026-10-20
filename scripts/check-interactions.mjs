import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
  args: ["--no-sandbox"],
});

const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
const missingResources = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("response", (response) => { if (response.status() === 404) missingResources.push(response.url()); });

await page.goto("http://127.0.0.1:8788/", { waitUntil: "load" });
await page.locator(".mobile-menu summary").click();
const menuOpen = await page.locator(".mobile-menu").evaluate((element) => element.hasAttribute("open"));
const mobileLinks = await page.locator(".mobile-menu nav a").count();

await page.goto("http://127.0.0.1:8788/contact/", { waitUntil: "load" });
await page.locator(".quote-form button[type='submit']").click();
const invalidFields = await page.locator(".quote-form :invalid").count();
const headingCount = await page.locator("h1").count();
const phoneLinks = await page.locator("a[href^='tel:']").count();
const whatsappLinks = await page.locator("a[href^='https://wa.me/']").count();

console.log(JSON.stringify({ menuOpen, mobileLinks, invalidFields, headingCount, phoneLinks, whatsappLinks, consoleErrors: errors, missingResources }, null, 2));

await browser.close();
