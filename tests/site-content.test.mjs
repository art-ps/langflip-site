import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  copy,
  downloadHref,
  locales,
  localeUrl,
  meta,
  release,
  site,
  softwareSchema,
} from "../src/site-content.mjs";
import { headTags } from "../src/head.mjs";

const publicDir = new URL("../public/", import.meta.url);

// The DMG ships as a GitHub release asset, not from this repository, so the version is
// checked for internal consistency instead: a mismatch here points the only button on
// the page at a tag that does not exist.
test("release metadata is self-consistent and no DMG is committed", async () => {
  assert.equal(release.fileName, `LangFlip-${release.version}.dmg`);
  assert.match(release.version, /^\d+\.\d+\.\d+$/);
  assert.match(release.sizeLabel, /^\d+,\d МБ$/);
  assert.match(release.sizeLabelEn, /^\d+\.\d MB$/);

  const images = (await readdir(publicDir)).filter((name) => name.endsWith(".dmg"));
  assert.deepEqual(images, [], "the DMG belongs to the release, not to public/");
});

test("downloadHref points at the release asset for the shipped version", () => {
  assert.equal(
    downloadHref(),
    `https://github.com/art-ps/langflip-site/releases/download/v${release.version}/${release.fileName}`,
  );
});

test("structured data matches the shipped release, per locale", () => {
  for (const locale of locales) {
    const schema = softwareSchema(locale);
    assert.equal(schema["@type"], "SoftwareApplication");
    assert.equal(schema.softwareVersion, release.version);
    assert.equal(schema.downloadUrl, downloadHref());
    assert.equal(schema.url, localeUrl(locale));
    assert.equal(schema.inLanguage, meta[locale].lang);
    assert.equal(schema.offers.price, "0");
  }
});

test("the html template leaves head metadata to the prerender", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<!--seo-->/, "the prerender needs its placeholder");
  assert.match(html, /<title>LangFlip<\/title>/);
  assert.doesNotMatch(html, /canonical/, "canonical is generated per locale");
});

test("generated head metadata is absolute and per-locale", () => {
  for (const locale of locales) {
    const tags = headTags(locale);
    const localeMeta = meta[locale];

    assert.match(tags, new RegExp(`<link rel="canonical" href="${localeUrl(locale)}" />`));
    assert.match(tags, new RegExp(`property="og:locale" content="${localeMeta.ogLocale}"`));
    assert.match(tags, new RegExp(`name="description" content="${localeMeta.description}"`));
    // Relative og:image URLs are not resolved by every preview bot.
    for (const property of ["og:image", "twitter:image"]) {
      assert.match(tags, new RegExp(`"${property}" content="https://`));
    }
    // Every locale must advertise every other one, or Google keeps serving the wrong page.
    for (const other of locales) {
      assert.match(tags, new RegExp(`hreflang="${meta[other].lang}" href="${localeUrl(other)}"`));
    }
    assert.match(tags, new RegExp(`hreflang="x-default" href="${site.url}"`));
  }
});

test("both locales carry the same set of strings", () => {
  const [first, ...rest] = locales.map((locale) => Object.keys(copy[locale]).sort());
  for (const keys of rest) assert.deepEqual(keys, first, "a locale is missing a translation");

  for (const locale of locales) {
    for (const [key, value] of Object.entries(copy[locale])) {
      const strings = Array.isArray(value) ? value : [value];
      for (const string of strings) {
        assert.ok(string.trim().length > 0, `${locale}.${key} is empty`);
      }
    }
  }

  // The English page must not fall back to Russian sentences.
  const english = Object.entries(copy.en).filter(([key]) => !["demoLabel", "languageSwitch"].includes(key));
  for (const [key, value] of english) {
    const strings = Array.isArray(value) ? value : [value];
    for (const string of strings) {
      assert.doesNotMatch(string, /[а-яё]/i, `en.${key} still contains Russian text`);
    }
  }
});

test("crawler files point at the canonical URL", async () => {
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");

  assert.match(robots, new RegExp(`^Sitemap: ${site.url}sitemap\\.xml$`, "m"));
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(sitemap, new RegExp(`<loc>${site.url}</loc>`));
  for (const locale of locales) {
    assert.match(sitemap, new RegExp(`<loc>${localeUrl(locale)}</loc>`), `${locale} is missing`);
  }
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

  // The app repository is private: any link to it is a 404 for visitors. The site
  // repository is public and hosts the release asset, so only that one may be linked.
  for (const [name, source] of [["App.tsx", app], ["llms.txt", llms], ["site-content", content]]) {
    for (const link of source.match(/https:\/\/github\.com\/[^\s"')]+/g) ?? []) {
      assert.match(link, /^https:\/\/github\.com\/art-ps\/langflip-site\//, `${name} links to ${link}`);
    }
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

// The app polls this file to decide whether to prompt for an update. If it lags behind
// the release block, users are told to download a version the site does not serve.
test("latest.json matches the published release", async () => {
  const raw = await readFile(new URL("latest.json", publicDir), "utf8");
  const latest = JSON.parse(raw);

  assert.equal(latest.version, release.version);
  assert.equal(latest.url, downloadHref());
  assert.equal(latest.notesURL, "https://langflip.app/");
  assert.deepEqual(Object.keys(latest).sort(), ["notesURL", "url", "version"]);
});
