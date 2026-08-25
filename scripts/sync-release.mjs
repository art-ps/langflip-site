// Points the site at a new build: `npm run sync-release [path/to/LangFlip-X.Y.Z.dmg]`.
//
// With a path, the DMG is copied into public/ and the previous one removed; without,
// whatever already sits in public/ is taken as the truth. Either way the `release`
// block in src/site-content.mjs is rewritten from the file itself, so the download
// button, the release note and the JSON-LD cannot drift from what is actually served.
import { copyFile, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const publicDir = new URL("../public/", import.meta.url);
const contentPath = new URL("../src/site-content.mjs", import.meta.url);

const source = process.argv[2];
if (source) {
  const name = basename(source);
  if (!/^LangFlip-\d+\.\d+\.\d+\.dmg$/.test(name)) {
    throw new Error(`expected a file named LangFlip-X.Y.Z.dmg, got ${name}`);
  }
  for (const old of (await readdir(publicDir)).filter((f) => f.endsWith(".dmg"))) {
    if (old !== name) await rm(new URL(old, publicDir));
  }
  await copyFile(source, new URL(name, publicDir));
  console.log(`copied ${name} into public/`);
}

const images = (await readdir(publicDir)).filter((f) => f.endsWith(".dmg"));
if (images.length !== 1) {
  throw new Error(`public/ must hold exactly one DMG, found ${images.length ? images.join(", ") : "none"}`);
}

const fileName = images[0];
const version = fileName.match(/^LangFlip-(\d+\.\d+\.\d+)\.dmg$/)?.[1];
if (!version) throw new Error(`cannot read a version out of ${fileName}`);

const { size } = await stat(new URL(fileName, publicDir));
const sizeLabel = `${(size / (1024 * 1024)).toFixed(1).replace(".", ",")} МБ`;

const before = await readFile(contentPath, "utf8");
const after = before
  .replace(/version: "[^"]*"/, `version: "${version}"`)
  .replace(/fileName: "[^"]*"/, `fileName: "${fileName}"`)
  .replace(/sizeLabel: "[^"]*"/, `sizeLabel: "${sizeLabel}"`);

if (after === before) {
  console.log(`already in sync: ${version}, ${sizeLabel}`);
} else {
  await writeFile(contentPath, after);
  console.log(`site-content now points at ${version} (${sizeLabel})`);
}
