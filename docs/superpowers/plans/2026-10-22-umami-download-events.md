# Umami download events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Count Download clicks on langflip.app in umami, split by which of the three buttons was clicked.

**Architecture:** Umami's script (already in `index.html`) tracks any element carrying `data-umami-event`; extra `data-umami-event-*` attributes become event properties. Add the attributes to the three download links in `src/App.tsx`; no JS.

**Tech Stack:** React + Vite (prerendered), `node --test`.

**Spec:** approved in chat on 2026-10-22 (no separate spec file):
- event name `download` on all three download links;
- property `place`: `header` (`.header-download`), `hero` (first `.download-button`), `final` (`.download-button--dark`);
- page language is NOT tracked separately;
- links, copy, styles untouched; no `umami.track` JS; no event on the brew command.

## Global Constraints

- Only `src/App.tsx` and `tests/site-source.test.mjs` change.
- Exact attribute values: `data-umami-event="download"`, `data-umami-event-place="header" | "hero" | "final"`.
- No commit or push without the user's explicit «да» — pushing to `master` deploys the site.

## Review Focus

- Both locales (RU `/`, EN `/en/`) render from the same `App.tsx` — prerendered `dist/index.html` and `dist/en/index.html` must both carry all three attributes (checked in Task 1 Step 5).
- A future fourth download link without the event would silently go uncounted — the test asserts every `href={href}` link carries `data-umami-event="download"`.

---

### Task 1: Download events on the three buttons

**Files:**
- Modify: `src/App.tsx:37`, `src/App.tsx:59`, `src/App.tsx:201`
- Test: `tests/site-source.test.mjs` (append)

**Interfaces:** none.

- [ ] **Step 1: Write the failing test** — append to `tests/site-source.test.mjs`:

```js
test("every download link reports a umami event with its place", () => {
  const links = app.match(/<a\b[^>]*href=\{href\}[^>]*>/g) ?? [];
  assert.equal(links.length, 3);
  for (const link of links) assert.match(link, /data-umami-event="download"/);
  const places = links.map((link) => link.match(/data-umami-event-place="([a-z]+)"/)?.[1]);
  assert.deepEqual(places, ["header", "hero", "final"]);
});
```

- [ ] **Step 2: Run, expect FAIL** — `npm test` → new test fails on the `data-umami-event` match.

- [ ] **Step 3: Add the attributes** to the three `<a … href={href}>` openings in source order: header → `place="header"`, hero → `"hero"`, final CTA → `"final"`.

- [ ] **Step 4: Run, expect PASS** — `npm test` and `npm run lint` both exit 0.

- [ ] **Step 5: Build and check output** — `npm run build` exits 0; then
`grep -o 'data-umami-event-place="[a-z]*"' dist/index.html dist/en/index.html` prints header, hero, final for each file.

- [ ] **Step 6: Stop before commit** — report diff; commit/push only after the user's «да».
