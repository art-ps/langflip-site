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

  assert.match(robots, new RegExp(`^Sitemap: ${site.url}sitemap\\.xml$`, "m"));
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(sitemap, new RegExp(`<loc>${site.url}</loc>`));
  assert.match(llms, /# LangFlip/);
  assert.match(llms, /WhisperKit/);
});

test("the custom domain is declared exactly once, in CNAME", async () => {
  const cname = (await readFile(new URL("../public/CNAME", import.meta.url), "utf8")).trim();
  assert.equal(`https://${cname}/`, site.url, "CNAME and site.url disagree");
});

test("the site links nowhere private", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  const content = await readFile(new URL("../src/site-content.mjs", import.meta.url), "utf8");

  // The repository is private: any link to it is a 404 for visitors.
  for (const [name, source] of [["App.tsx", app], ["llms.txt", llms], ["site-content", content]]) {
    assert.doesNotMatch(source, /github\.com/, `${name} links to the private repository`);
  }
});
