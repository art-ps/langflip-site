// Points the site at a new build: `npm run sync-release -- path/to/LangFlip-X.Y.Z.dmg`.
//
// The DMG is no longer committed to this repository. It ships as an asset of a GitHub
// release, because Pages keeps no logs and the release download counter is the only free
// way to see whether a post produced installs. The script rewrites the `release` block in
// src/site-content.mjs from the file itself, so the download button, the release note and
// the JSON-LD cannot drift from what is actually served.
//
// Without an argument it reports the current state and changes nothing.
import { execFile } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { promisify } from "node:util";
import { release } from "../src/site-content.mjs";

const run = promisify(execFile);
const contentPath = new URL("../src/site-content.mjs", import.meta.url);

const source = process.argv[2];
if (!source) {
  console.log(`already in sync: ${release.version} (${release.sizeLabel})`);
  process.exit(0);
}

const fileName = basename(source);
const version = fileName.match(/^LangFlip-(\d+\.\d+\.\d+)\.dmg$/)?.[1];
if (!version) {
  throw new Error(`expected a file named LangFlip-X.Y.Z.dmg, got ${fileName}`);
}

const { size } = await stat(source);
if (size < 1_000_000) throw new Error(`${fileName} looks truncated: ${size} bytes`);
const megabytes = (size / (1024 * 1024)).toFixed(1);
const sizeLabel = `${megabytes.replace(".", ",")} МБ`;
const sizeLabelEn = `${megabytes} MB`;

const before = await readFile(contentPath, "utf8");
const after = before
  .replace(/version: "[^"]*"/, `version: "${version}"`)
  .replace(/fileName: "[^"]*"/, `fileName: "${fileName}"`)
  .replace(/sizeLabel: "[^"]*"/, `sizeLabel: "${sizeLabel}"`)
  .replace(/sizeLabelEn: "[^"]*"/, `sizeLabelEn: "${sizeLabelEn}"`);

if (after === before) {
  console.log(`already in sync: ${version} (${sizeLabel})`);
} else {
  await writeFile(contentPath, after);
  console.log(`site-content now points at ${version} (${sizeLabel})`);
}

// The tag is what downloadHref() links to, so publishing it belongs to the same step: a
// site pointing at a release that does not exist is a 404 on the only button that matters.
const tag = `v${version}`;
const published = await run("gh", ["release", "view", tag, "--json", "tagName"]).then(
  () => true,
  () => false,
);

if (published) {
  await run("gh", ["release", "upload", tag, source, "--clobber"]);
  console.log(`uploaded ${fileName} to release ${tag}`);
} else {
  await run("gh", [
    "release",
    "create",
    tag,
    source,
    "--title",
    `LangFlip ${version}`,
    "--notes",
    `LangFlip ${version} for macOS 14+.`,
  ]);
  console.log(`created release ${tag} with ${fileName}`);
}
