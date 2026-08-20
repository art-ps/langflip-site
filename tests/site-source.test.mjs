import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
const viteConfig = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");

test("page covers correction, dictation, privacy, and installation", () => {
  for (const required of [
    "id=\"features\"",
    "id=\"privacy\"",
    "id=\"install\"",
    "Диктуйте в любое окно",
    "whisper.cpp",
    "1,5 ГБ",
    "⌥⌘Z",
    "Input Monitoring",
    "Accessibility",
    "Правой кнопкой",
  ]) assert.match(app, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("styles include responsive, focus, and reduced-motion safeguards", () => {
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("variant 4 presents the before and after conversion scene", () => {
  for (const required of [
    "conversion-demo",
    "conversion-before",
    "conversion-after",
    "command-orbit",
    "dictation-chip",
    "ghbdtn",
    "привет",
  ]) assert.match(app, new RegExp(required));

  for (const removed of ["document-stage", "document-demo", "color-bar", "final-bar"]) {
    assert.doesNotMatch(app, new RegExp(removed));
  }

  assert.match(css, /@keyframes\s+flip-word/);
  assert.match(css, /\.conversion-demo\b/);
  assert.match(css, /--blue:\s*#[0-9a-f]{6}/i);
  assert.match(css, /--violet:\s*#[0-9a-f]{6}/i);
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("deployment workflow publishes the relative-base build to GitHub Pages", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/pages.yml", import.meta.url),
    "utf8",
  );

  for (const required of [
    "configure-pages",
    "upload-pages-artifact",
    "deploy-pages",
    "path: ./dist",
    "pages: write",
    "id-token: write",
  ]) assert.match(workflow, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(viteConfig, /base:\s*["']\.\/["']/);
});
