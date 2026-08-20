import test from "node:test";
import assert from "node:assert/strict";
import { downloadHref, release } from "../src/site-content.mjs";

test("release metadata describes the shipped DMG", () => {
  assert.deepEqual(release, {
    version: "0.2.1",
    fileName: "LangFlip-0.2.1.dmg",
    sizeLabel: "4,3 МБ",
    macOS: "macOS 14+",
  });
});

test("downloadHref preserves root and GitHub Pages bases", () => {
  assert.equal(downloadHref("/"), "/LangFlip-0.2.1.dmg");
  assert.equal(downloadHref("/langflip-site/"), "/langflip-site/LangFlip-0.2.1.dmg");
  assert.equal(downloadHref("./"), "./LangFlip-0.2.1.dmg");
});
