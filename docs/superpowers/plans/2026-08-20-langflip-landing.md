# LangFlip Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished Russian LangFlip landing page that deploys as a static GitHub Pages site and downloads the current macOS DMG directly.

**Architecture:** A single-route React + Vite static site keeps GitHub Pages hosting simple. Product copy and download URL construction live in a small framework-independent module, while `App.tsx` owns semantic page structure and `styles.css` owns the variant C visual system. GitHub Actions builds and publishes `dist/` without server-side runtime dependencies.

**Tech Stack:** React 19, TypeScript 5, Vite 8, CSS, Node test runner, GitHub Pages Actions

## Global Constraints

- Russian-only one-page site for the free LangFlip macOS app.
- Visual direction is variant C: a large document with blue, violet, coral, and lime color bars.
- Show `ghbdtn → привет`, double-tap `⌘`, automatic correction, undo via `⌥⌘Z`, and opt-in dictation into any active text field.
- State accurately that correction and dictation are on-device, dictation uses whisper.cpp, and its model is a separate one-time download of about 1.5 GB.
- State macOS 14+, Input Monitoring and Accessibility permissions, optional microphone permission, and the unsigned/not-notarized first-launch procedure.
- Download `LangFlip-0.2.1.dmg` directly from the deployed site; label it as about 4.3 MB.
- Use the real LangFlip icon and current local DMG from `/Users/artem/projects/LangFlip`.
- The production build must work at a GitHub Pages project subpath and at repository-root previews.
- Respect `prefers-reduced-motion`, keyboard focus, readable contrast, and responsive layouts.
- No forms, database, server, analytics, external APIs, or new runtime packages beyond React and Vite.

---

## File map

- `package.json` — scripts and pinned site dependencies.
- `vite.config.ts` — static relative-base build for GitHub Pages.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — TypeScript configuration.
- `index.html` — Russian document shell, metadata, favicon, and social tags.
- `src/main.tsx` — React entry point.
- `src/site-content.mjs` — authoritative release metadata, links, and framework-independent download path helper.
- `src/site-content.d.mts` — TypeScript declarations for the content module.
- `src/App.tsx` — semantic one-page landing structure.
- `src/styles.css` — full visual system, responsive rules, and reduced-motion behavior.
- `public/langflip-icon.png` — real 512 px app icon.
- `public/LangFlip-0.2.1.dmg` — current downloadable installer.
- `public/og.png` — bespoke variant C social card.
- `tests/site-content.test.mjs` — release metadata and base-path behavior.
- `tests/site-source.test.mjs` — required sections, copy, accessibility, and reduced-motion contract.
- `.github/workflows/pages.yml` — GitHub Pages build and deployment workflow.
- `README.md` — local preview and GitHub Pages setup notes.

---

### Task 1: Static foundation and recognizable first viewport

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/site-content.mjs`
- Create: `src/site-content.d.mts`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `tests/site-content.test.mjs`
- Copy: `/Users/artem/projects/LangFlip/LangFlip/Assets.xcassets/AppIcon.appiconset/icon_512.png` → `public/langflip-icon.png`
- Copy: `/Users/artem/projects/LangFlip/build/LangFlip-0.2.1.dmg` → `public/LangFlip-0.2.1.dmg`

**Interfaces:**
- Produces: `release` object with `version`, `fileName`, `sizeLabel`, `macOS`; `downloadHref(baseUrl: string): string`.
- Produces: semantic hero selectors `.hero`, `.document-demo`, `.download-button`, `.keyboard-key` for Task 2.

- [ ] **Step 1: Write the failing release/path test**

```js
// tests/site-content.test.mjs
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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/site-content.test.mjs`

Expected: FAIL because `src/site-content.mjs` does not exist.

- [ ] **Step 3: Create the minimal content module**

```js
// src/site-content.mjs
export const release = Object.freeze({
  version: "0.2.1",
  fileName: "LangFlip-0.2.1.dmg",
  sizeLabel: "4,3 МБ",
  macOS: "macOS 14+",
});

export function downloadHref(baseUrl = "/") {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${base}${release.fileName}`;
}
```

Add matching declarations in `src/site-content.d.mts` and rerun the test.

Expected: 2 tests pass.

- [ ] **Step 4: Scaffold the static React build**

Create a package with scripts `dev: vite`, `build: tsc -b && vite build`, `test: node --test tests/*.test.mjs`, and `lint: tsc -b --pretty false`. Pin React 19.2.6, React DOM 19.2.6, Vite 8.0.13, TypeScript 5.9.3, and the matching React type packages already present in the bundled workspace cache.

Use a relative asset base:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
});
```

Create the Russian HTML shell with title `LangFlip — исправление раскладки и диктовка для macOS`, description from the design spec, `lang="ru"`, and icon `/langflip-icon.png`.

- [ ] **Step 5: Build the recognizable first viewport**

Implement a compact header, Russian hero copy, download CTA using `downloadHref(import.meta.env.BASE_URL)`, release requirements, and the variant C document demo containing color bars plus an accessible text line `ghbdtn → привет`. Add base responsive styling so the hero is coherent at 390 px and 1440 px widths.

- [ ] **Step 6: Copy and verify product assets**

Copy the real icon and DMG. Verify:

Run: `shasum -a 256 public/LangFlip-0.2.1.dmg /Users/artem/projects/LangFlip/build/LangFlip-0.2.1.dmg`

Expected: identical SHA-256 values.

- [ ] **Step 7: Install, test, build, and commit**

Run: `npm install --ignore-scripts --no-audit --no-fund`

Run: `npm test && npm run build`

Expected: tests pass and Vite writes `dist/index.html` plus the DMG and icon.

Commit: `feat: add LangFlip landing foundation`

---

### Task 2: Complete variant C landing experience

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `tests/site-source.test.mjs`
- Create: `public/og.png`
- Modify: `index.html`

**Interfaces:**
- Consumes: `release` and `downloadHref(baseUrl)` from Task 1.
- Preserves: `.hero`, `.document-demo`, `.download-button`, `.keyboard-key` selectors.
- Produces: anchors `#features`, `#privacy`, `#install`; semantic sections and footer ready for static deployment.

- [ ] **Step 1: Write the failing source contract test**

```js
// tests/site-source.test.mjs
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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/site-source.test.mjs`

Expected: FAIL because the hero-only first slice does not contain the required sections and safeguards.

- [ ] **Step 3: Implement the semantic page structure**

Expand `App.tsx` with:

- sticky translucent header and anchors to capabilities, privacy, and installation;
- hero with the product badge, honest supporting copy, one primary CTA, and the variant C document demo;
- three feature cards for automatic correction, `⌘ ⌘` manual conversion with `⌥⌘Z`, and local dictation into any active field;
- a dedicated dictation band showing hold/speak/release and the optional 1.5 GB model;
- a dark privacy section with the four exact privacy guarantees from the spec;
- four-step installation section including right-click → Open for the non-notarized build;
- final download CTA and footer links to `https://github.com/art-ps/langflip` and `https://github.com/art-ps/langflip/blob/master/PRIVACY.md`.

Use semantic `header`, `nav`, `main`, `section`, `ol`, and `footer`; mark decorative bars `aria-hidden="true"`; give icon images meaningful alt text; add `rel="noreferrer"` to external links.

- [ ] **Step 4: Complete the variant C styles**

Define a warm paper canvas, near-black ink, four restrained accent colors, a responsive two-column hero, layered document card, high-contrast feature cards, and the dark privacy band. Animate only the document cursor, correction highlight, and microphone pulse. In `prefers-reduced-motion: reduce`, set animation duration to `0.01ms` and disable smooth scrolling. At ≤900 px stack hero/sections; at ≤640 px hide header anchor links and use full-width CTAs.

- [ ] **Step 5: Add the validated social card**

Create one 1200×630 variant C social card using the same document, color bars, `ghbdtn → привет`, and Russian title. Inspect its embedded text before saving it as `public/og.png`. Add Open Graph and X image metadata in `index.html` using a relative `og.png` path suitable for static hosting.

- [ ] **Step 6: Test, build, and commit**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass; `dist/index.html`, `dist/og.png`, and `dist/LangFlip-0.2.1.dmg` exist.

Commit: `feat: complete LangFlip landing page`

---

### Task 3: GitHub Pages delivery and final validation

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Modify: `tests/site-source.test.mjs`

**Interfaces:**
- Consumes: `npm run build` and the `dist/` static artifact from Tasks 1–2.
- Produces: a Pages workflow triggered by pushes to `master` and manual dispatch.

- [ ] **Step 1: Extend the source contract test for deployment**

Add checks that `.github/workflows/pages.yml` contains `configure-pages`, `upload-pages-artifact`, `deploy-pages`, `path: ./dist`, `pages: write`, and `id-token: write`; verify `vite.config.ts` contains `base: "./"`.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/site-source.test.mjs`

Expected: FAIL because the Pages workflow does not exist.

- [ ] **Step 3: Add the GitHub Pages workflow**

Create a least-privilege workflow that checks out the repository, configures Pages, installs with `npm ci`, builds with `npm run build`, uploads `./dist`, and deploys it. Trigger on `push.branches: [master]` plus `workflow_dispatch` and set `concurrency.cancel-in-progress: true`.

- [ ] **Step 4: Add concise operator documentation**

Document `npm install`, `npm run dev`, `npm test`, `npm run build`, the source of the bundled DMG, and the repository setting `Settings → Pages → Source: GitHub Actions`. Explain that replacing the release requires updating the DMG file plus `src/site-content.mjs`.

- [ ] **Step 5: Run full static validation**

Run: `npm test && npm run lint && npm run build`

Then verify exact artifacts:

```bash
test -f dist/index.html
test -f dist/LangFlip-0.2.1.dmg
test -f dist/langflip-icon.png
test -f dist/og.png
cmp public/LangFlip-0.2.1.dmg dist/LangFlip-0.2.1.dmg
```

Expected: every command exits 0.

Inspect `dist/index.html` to confirm all asset references are relative and no `/src/` paths remain.

- [ ] **Step 6: Commit**

Commit: `ci: deploy site to GitHub Pages`
