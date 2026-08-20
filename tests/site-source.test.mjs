import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
const viteConfig = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");

function extractBlock(source, marker) {
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing ${marker}`);
  const openingBrace = source.indexOf("{", start);
  let depth = 0;

  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  assert.fail(`unterminated ${marker}`);
}

function extractYamlSection(source, key, indentation) {
  const marker = `${" ".repeat(indentation)}${key}\n`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing ${key}`);
  const bodyStart = start + marker.length;
  const sibling = new RegExp(`^ {${indentation}}\\S`, "gm");
  sibling.lastIndex = bodyStart;
  const match = sibling.exec(source);
  return source.slice(bodyStart, match?.index ?? source.length);
}

function contrastRatio(first, second) {
  const luminance = (hex) => {
    const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
    const linear = channels.map((channel) => (
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    ));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

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

test("typography tokens keep Russian headings readable", () => {
  const root = extractBlock(css, ":root");
  const heroHeading = extractBlock(css, "h1 {");
  const sectionHeading = extractBlock(css, "h2 {");
  const heading = extractBlock(css, "h3 {");
  const brand = extractBlock(css, ".brand");

  assert.match(root, /^\s*font-family:\s*-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\s*$/m);
  assert.match(root, /^\s*--display-tracking:\s*-0\.025em;\s*$/m);
  assert.match(root, /^\s*--display-line-height:\s*0\.96;\s*$/m);
  assert.match(root, /^\s*--heading-tracking:\s*-0\.02em;\s*$/m);
  assert.match(root, /^\s*--heading-line-height:\s*1;\s*$/m);

  assert.match(heroHeading, /letter-spacing:\s*var\(--display-tracking\)/);
  assert.match(heroHeading, /line-height:\s*var\(--display-line-height\)/);
  assert.match(sectionHeading, /letter-spacing:\s*var\(--display-tracking\)/);
  assert.match(sectionHeading, /line-height:\s*var\(--heading-line-height\)/);
  assert.match(heading, /letter-spacing:\s*var\(--heading-tracking\)/);
  assert.match(brand, /letter-spacing:\s*var\(--heading-tracking\)/);
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

  assert.match(css, /\.conversion-demo\b/);
  assert.match(css, /--blue:\s*#[0-9a-f]{6}/i);
  assert.match(css, /--violet:\s*#[0-9a-f]{6}/i);
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("hero conversion runs a staged repeating timeline with safe animation properties", () => {
  const stages = [
    [".conversion-before", "conversion-before-stage"],
    [".command-orbit span", "command-stage"],
    [".conversion-pulse", "conversion-pulse-stage"],
    [".conversion-after", "conversion-after-stage"],
    [".dictation-chip", "dictation-stage"],
  ];

  for (const [selector, animation] of stages) {
    assert.match(extractBlock(css, selector), new RegExp(`animation:\\s*${animation}\\s+8s[^;]*infinite`));
  }

  const frames = Object.fromEntries(stages.map(([, name]) => [name, extractBlock(css, `@keyframes ${name}`)]));
  assert.match(frames["conversion-before-stage"], /0%,\s*20%\s*\{[^}]*opacity:\s*1/s);
  assert.match(frames["conversion-before-stage"], /32%,\s*88%\s*\{[^}]*opacity:\s*0/s);
  assert.match(frames["command-stage"], /0%,\s*18%\s*\{[^}]*opacity:\s*0/s);
  assert.match(frames["command-stage"], /23%\s*\{[^}]*opacity:\s*1/s);
  assert.match(frames["conversion-pulse-stage"], /23%,\s*34%\s*\{[^}]*opacity:\s*1/s);
  assert.match(frames["conversion-after-stage"], /0%,\s*36%\s*\{[^}]*opacity:\s*0/s);
  assert.match(frames["conversion-after-stage"], /44%,\s*88%\s*\{[^}]*opacity:\s*1/s);
  assert.match(frames["dictation-stage"], /0%,\s*56%\s*\{[^}]*opacity:\s*0/s);
  assert.match(frames["dictation-stage"], /64%,\s*88%\s*\{[^}]*opacity:\s*1/s);

  const animationNames = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => match[1]);
  for (const name of animationNames) {
    const declarations = [...extractBlock(css, `@keyframes ${name}`).matchAll(/(?:^|[;{])\s*([\w-]+)\s*:/g)]
      .map((match) => match[1]);
    assert.ok(declarations.length > 0, `${name} should declare animated properties`);
    for (const property of declarations) {
      assert.ok(["opacity", "transform", "filter"].includes(property), `${name} animates disallowed ${property}`);
    }
  }
});

test("reduced motion shows the corrected result and dictation state", () => {
  const reducedMotion = extractBlock(css, "@media (prefers-reduced-motion: reduce)");

  assert.match(reducedMotion, /\.conversion-before,\s*\.command-orbit,\s*\.conversion-pulse\s*\{[^}]*opacity:\s*0/s);
  assert.match(reducedMotion, /\.conversion-after,\s*\.dictation-chip\s*\{[^}]*opacity:\s*1/s);
  assert.match(reducedMotion, /\.conversion-before,\s*\.command-orbit span,\s*\.conversion-pulse,\s*\.conversion-pulse span,\s*\.conversion-after,\s*\.dictation-chip,\s*\.dictation-dot\s*\{[^}]*animation:\s*none\s*!important/s);
});

test("primary CTA blue token meets WCAG AA contrast for white text", () => {
  const match = css.match(/--cta-blue:\s*(#[0-9a-f]{6})/i);
  assert.ok(match, "missing --cta-blue token");
  assert.equal(match[1].toLowerCase(), "#2463d4");
  assert.ok(contrastRatio("#ffffff", match[1]) >= 4.5);
  assert.match(extractBlock(css, ".download-button"), /background:\s*linear-gradient\([^;]*var\(--cta-blue\)/s);
});

test("presentation identifiers use only the blue and violet palette", () => {
  const identifiers = [
    ...[...app.matchAll(/className="([^"]+)"/g)].flatMap((match) => match[1].split(/\s+/)),
    ...[...css.matchAll(/\.([a-z_][\w-]*)/gi)].map((match) => match[1]),
    ...[...css.matchAll(/(--[\w-]+)/g)].map((match) => match[1]),
  ];

  assert.match(app, /feature-card--periwinkle/);
  assert.match(css, /\.feature-card--periwinkle\b/);
  for (const identifier of identifiers) assert.doesNotMatch(identifier, /coral|lime/i);
});

test("stacked conversion keeps a static vertical arrow", () => {
  const stackedLayout = extractBlock(css, "@media (max-width: 900px)");

  assert.match(stackedLayout, /\.conversion-demo\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(stackedLayout, /\.conversion-pulse span\s*\{[^}]*animation:\s*none[^}]*transform:\s*rotate\(90deg\)/s);
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

test("deployment workflow uses least privilege, tests first, and immutable action pins", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/pages.yml", import.meta.url),
    "utf8",
  );
  const jobs = extractYamlSection(workflow, "jobs:", 0);
  const build = extractYamlSection(jobs, "build:", 2);
  const deploy = extractYamlSection(jobs, "deploy:", 2);
  const permissions = (job) => extractYamlSection(job, "permissions:", 4)
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert.doesNotMatch(workflow.slice(0, workflow.indexOf("jobs:")), /^permissions:/m);
  assert.deepEqual(permissions(build), ["contents: read"]);
  assert.deepEqual(permissions(deploy), ["pages: write", "id-token: write"]);
  assert.ok(build.indexOf("run: npm test") < build.indexOf("run: npm run build"));

  for (const action of [
    "actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4",
    "actions/configure-pages@983d7736d9b0ae728b81ab479565c72886d7745b # v5",
    "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4",
    "actions/upload-pages-artifact@56afc609e74202658d3ffba0e8f6dda462b719fa # v3",
    "actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e # v4",
  ]) assert.match(workflow, new RegExp(action.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.doesNotMatch(workflow, /uses:\s*[^\s@]+@v\d+\b/);
});
