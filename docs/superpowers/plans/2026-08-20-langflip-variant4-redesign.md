# LangFlip Variant 4 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the variant C document-and-bars design with the user-selected dynamic «До / после» direction while preserving all product content and GitHub Pages behavior.

**Architecture:** Keep the existing React/Vite static architecture and authoritative download helper. Restructure only `App.tsx` presentation and `styles.css`; extend source tests to lock the new visual contract and remove stale variant C motifs. Replace the OG image so link previews match the redesigned page.

**Tech Stack:** React 19, TypeScript 5, Vite 8, CSS, Node test runner

## Global Constraints

- Russian-only one-page site; preserve correction, dictation, privacy, installation, footer, and direct DMG content.
- Variant 4 is binding: centered dynamic `ghbdtn → привет`, `⌘` as primary motif, light surface, vivid blue/violet accents.
- Remove document-window composition, horizontal color bars, coral/lime editorial cards, and final stacked-bar artwork.
- Keep real app icon, `LangFlip-0.2.1.dmg`, relative GitHub Pages paths, existing workflow, and release metadata unchanged.
- Preserve anchors `#features`, `#privacy`, `#install`, semantic landmarks, external-link safety, keyboard focus, responsive layout, and `prefers-reduced-motion`.
- Keep dictation prominent: «Диктуйте в любое окно», local whisper.cpp, optional separate ~1.5 GB model.
- Animate only transform/opacity/filter-safe properties; reduced-motion mode must present the corrected result without requiring animation.

---

### Task 1: Redesign the landing and social card as variant 4

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `tests/site-source.test.mjs`
- Replace: `public/og.png`

**Interfaces:**
- Preserve: `downloadHref(import.meta.env.BASE_URL)`, `release`, `#features`, `#privacy`, `#install`, `.download-button`, `.keyboard-key`.
- Produce: `.conversion-demo`, `.conversion-before`, `.conversion-after`, `.command-orbit`, `.dictation-chip`.

- [ ] **Step 1: Write the failing variant contract test**

Add a test that asserts the five new selectors exist in `App.tsx`, the visible string `ghbdtn` and `привет` remain, and the old strings `document-stage`, `document-demo`, `color-bar`, `final-bar` are absent. Add CSS assertions for `@keyframes flip-word`, `.conversion-demo`, blue/violet design tokens, mobile breakpoint, focus-visible, and reduced-motion.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/site-source.test.mjs`

Expected: FAIL because `.conversion-demo` and other variant 4 selectors are absent and variant C selectors still exist.

- [ ] **Step 3: Replace the hero with the dynamic before/after scene**

Create a centered hero with product badge, concise headline, description, primary download CTA, release note, and a large conversion stage. The stage must contain visually separate `ghbdtn` and `привет` layers, `⌘ ⌘` keys, a directional pulse, and a compact «Диктовка готова — удерживайте ⌘» chip. Mark decorative orbit/glow elements `aria-hidden="true"`; keep a descriptive `aria-label` on the demo.

- [ ] **Step 4: Restyle the remaining sections in the same visual language**

Replace the colored editorial cards with light glassy panels and blue/violet accents. Keep all current copy and semantic structures. Replace final stacked bars with a large `⌘`/conversion motif. Ensure responsive stacking at ≤900 px and full-width CTAs/hidden header anchors at ≤640 px.

- [ ] **Step 5: Replace the social card**

Use the controller-provided 1200×630 `public/og.png`: light blue/violet composition, oversized `ghbdtn → привет`, `⌘`, and exact Russian message. Do not generate or substitute another asset.

- [ ] **Step 6: Verify and commit**

Run: `npm test && npm run lint && npm run build`

Verify `public/og.png` and `dist/og.png` are 1200×630 and byte-identical; verify DMG remains byte-identical to the source app build. Confirm `git diff --check` is clean.

Commit: `feat: redesign landing around before and after`
