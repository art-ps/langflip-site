import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

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
