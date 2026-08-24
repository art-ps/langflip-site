import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { downloadHref, release, site, softwareSchema } from "../src/site-content.mjs";

test("release metadata describes the shipped DMG", () => {
  assert.deepEqual(release, {
    version: "0.3.2",
    fileName: "LangFlip-0.3.2.dmg",
    sizeLabel: "5,4 МБ",
    macOS: "macOS 14+",
  });
});

test("downloadHref preserves root and GitHub Pages bases", () => {
  assert.equal(downloadHref("/"), "/LangFlip-0.3.2.dmg");
  assert.equal(downloadHref("/langflip-site/"), "/langflip-site/LangFlip-0.3.2.dmg");
  assert.equal(downloadHref("./"), "./LangFlip-0.3.2.dmg");
});

test("the DMG the page links to is the one in public/", async () => {
  const stat = await readFile(new URL(`../public/${release.fileName}`, import.meta.url));
  assert.ok(stat.byteLength > 1_000_000, "bundled DMG looks truncated");
});

test("structured data matches the shipped release", () => {
  const schema = softwareSchema();
  assert.equal(schema["@type"], "SoftwareApplication");
  assert.equal(schema.softwareVersion, release.version);
  assert.equal(schema.downloadUrl, `${site.url}${release.fileName}`);
  assert.equal(schema.offers.price, "0");
});

test("head metadata is absolute and agrees with site content", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, new RegExp(`<link rel="canonical" href="${site.url}"`));
  assert.match(html, new RegExp(`<title>${site.title}</title>`));
  assert.match(html, new RegExp(`name="description" content="${site.description}"`));
  // Relative og:image URLs are not resolved by every preview bot.
  for (const property of ["og:image", "twitter:image"]) {
    assert.match(html, new RegExp(`"${property}" content="https://`));
  }
});

test("crawler files point at the canonical URL", async () => {
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");

  assert.match(robots, /^Sitemap: https:\/\/art-ps\.github\.io\/langflip-site\/sitemap\.xml$/m);
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(sitemap, new RegExp(`<loc>${site.url}</loc>`));
  assert.match(llms, /# LangFlip/);
  assert.match(llms, /WhisperKit/);
});
