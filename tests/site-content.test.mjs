import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { downloadHref, release, site, softwareSchema } from "../src/site-content.mjs";

const publicDir = new URL("../public/", import.meta.url);

// Checked against the file on disk rather than a copy of the version number:
// otherwise every release means editing the test too, and a stale test that
// still passes is worse than no test.
test("release metadata matches the DMG actually shipped in public/", async () => {
  const images = (await readdir(publicDir)).filter((name) => name.endsWith(".dmg"));
  assert.deepEqual(images, [release.fileName], "public/ must hold exactly the linked DMG");

  assert.equal(release.fileName, `LangFlip-${release.version}.dmg`);
  assert.match(release.version, /^\d+\.\d+\.\d+$/);

  const { size } = await stat(new URL(release.fileName, publicDir));
  assert.ok(size > 1_000_000, "bundled DMG looks truncated");
  const megabytes = (size / (1024 * 1024)).toFixed(1).replace(".", ",");
  assert.equal(release.sizeLabel, `${megabytes} МБ`, "size label drifted from the file");
});

test("downloadHref preserves root and GitHub Pages bases", () => {
  assert.equal(downloadHref("/"), `/${release.fileName}`);
  assert.equal(downloadHref("/langflip-site/"), `/langflip-site/${release.fileName}`);
  assert.equal(downloadHref("./"), `./${release.fileName}`);
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

// Runs the real script: if it stops deriving the release from the file in public/,
// this either throws or leaves site-content rewritten, and git shows the damage.
test("sync-release leaves an already-synced site untouched", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.scripts["sync-release"], "node scripts/sync-release.mjs");

  const before = await readFile(new URL("../src/site-content.mjs", import.meta.url), "utf8");
  const { stdout } = await promisify(execFile)("node", ["scripts/sync-release.mjs"], {
    cwd: new URL("..", import.meta.url),
  });
  const after = await readFile(new URL("../src/site-content.mjs", import.meta.url), "utf8");

  assert.match(stdout, new RegExp(`already in sync: ${release.version}`));
  assert.equal(after, before, "sync-release rewrote a file that was already correct");
});

test("the sitemap lists exactly the documentation pages that exist", async () => {
  const docsDir = new URL("../docs/", import.meta.url);
  const pages = (await readdir(docsDir))
    .filter((name) => name.endsWith(".md"))
    .map((name) => (name === "index.md" ? "docs/" : `docs/${name.replace(/\.md$/, "")}`));

  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const listed = [...sitemap.matchAll(/<loc>https:\/\/langflip\.app\/([^<]*)<\/loc>/g)]
    .map((match) => match[1])
    .filter((path) => path.startsWith("docs"));

  assert.deepEqual(listed.sort(), pages.sort(), "sitemap and docs/ disagree");
});

test("working notes are kept out of the published documentation", async () => {
  const config = await readFile(new URL("../docs/.vitepress/config.mts", import.meta.url), "utf8");
  assert.match(config, /srcExclude: \["superpowers\/\*\*"\]/);
});
