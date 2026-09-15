# docs-refresh-report

Branch: `docs/gigaam-and-privacy-refresh`

## Facts verified against `~/projects/LangFlip`

- `PRIVACY.md`: two network features, both opt-in and off by default — Hugging Face
  model download (Dictation), and `https://langflip.app/latest.json` update check.
- `Scripts/verify-privacy.sh`: allowlists `huggingface.co`, the exact
  `langflip.app/latest.json` path, and separately a small set of user-facing
  `Link()` URLs (vibecoded.ru, github.com/art-ps/langflip, langflip.app) that the
  system browser opens on click, not endpoints the app calls; network APIs are
  restricted to `LangFlip/(Dictation|Updates)/`.
- `LangFlip/Dictation/WhisperModel.swift`, `GigaAMModel.swift`, `GigaAMEngine.swift`,
  `DictationModel.swift`: Whisper large-v3-turbo, 626 MB, all languages, ANE. GigaAM
  v3 e2e_rnnt via sherpa-onnx, 311 MB (304.2+4.4+2.6+0.013), Russian only, CPU (not
  ANE), punctuation/casing from decode, RTF 0.015 vs WhisperKit — "roughly ten times
  faster." MIT licensed.
- `LangFlip/UI/SettingsView.swift`: new `.about` tab (last), version row
  (`.textSelection(.enabled)`), Website/Source/Project(vibecoded.ru)/Privacy links,
  MIT license label, Acknowledgements button — all moved out of `.general`.

## Files changed

- `docs/privacy.md` — "Сеть" section rewritten: two opt-in, off-by-default network
  features (was: one, with an explicit "no update check" claim that's now false).
  "Почему этому можно верить" bullet updated to describe the allowlist accurately
  (model download + update check + a few click-through links) instead of "any
  address except the model download."
- `docs/dictation.md` — new "Какую модель выбрать" section (Whisper vs GigaAM v3,
  sizes, ANE vs CPU, Russian-only caveat, explicit "accuracy wasn't measured, don't
  expect a claim here"). "Как пользоваться" and "Где это считается" updated to stop
  asserting WhisperKit/ANE/auto-language-detection unconditionally.
- `docs/settings.md` — "Диктовка" section gained a **Модель** row; new "О программе"
  section; removed the "Версия"/"Лицензии и благодарности" row from "Основные"
  (moved to About tab in the app).
- `docs/index.md` — disk-space row: `15 МБ` → `67 МБ`, `626 МБ` → `626 МБ (Whisper)
  или 311 МБ (GigaAM)`.
- `src/site-content.mjs` — only `dictationModelSize` touched (both locales), now
  covers both model sizes. `release` block untouched.
- `src/App.tsx` — `<strong>WhisperKit</strong>` → `<strong>Whisper</strong>` plus a
  locale-aware ", модель по умолчанию," / ", the default model," appositive, so the
  landing copy no longer states WhisperKit as if it were the only engine while
  staying truthful (the Neural Engine clause immediately follows, which is only
  accurate for Whisper — GigaAM runs on CPU, so it was not folded into that clause).
- `public/llms.txt` — same WhisperKit/626 MB staleness as `docs/index.md` had;
  fixed to mention both models (not in the original task list, found via the `626`
  grep sweep and via the "WhisperKit" test below — same defect, same fix).
- `tests/site-source.test.mjs`, `tests/site-content.test.mjs` — two pre-existing
  assertions hard-required the literal string `WhisperKit` (in `App.tsx` and in
  `llms.txt`); updated to require `Whisper` instead, since it now names both models.

## Verification

- `npm test` — 25/25 pass.
- `npm run lint` (`tsc -b`) — clean.
- `npm run build` — client, SSR, prerender, and `vitepress build docs` all succeed.

## Remaining `626` hits (grep after all edits)

- `tests/site-source.test.mjs:57,66` — substring assertions (`"626 МБ"` / `"626 MB"`)
  against `dictationModelSize`, still present as a substring of the new value.
- `docs/settings.md:59`, `docs/dictation.md:11`, `docs/index.md:19`,
  `public/llms.txt:19`, `src/site-content.mjs:129,208` — Whisper's actual download
  size, now always paired with GigaAM's 311 MB. Correct.
- No `WhisperKit` remains anywhere in the repo outside `docs/superpowers/**`
  (left alone per instructions, historical records).

## RU/EN landing strings changed, side by side

| RU | EN |
| --- | --- |
| `dictationModelSize`: `"626 МБ"` → `"626 МБ, либо 311 МБ для GigaAM (только русский)"` | `"626 MB"` → `"626 MB, or 311 MB for GigaAM (Russian only)"` |
| App.tsx object: `WhisperKit` → `Whisper` + `, модель по умолчанию,` | `WhisperKit` → `Whisper` + `, the default model,` |

Full rendered sentence, RU: "Распознавание работает через Whisper, модель по
умолчанию, на Neural Engine — процессоре, который есть в каждом Mac на Apple
Silicon. Функция включается по желанию, а модель размером около 626 МБ, либо
311 МБ для GigaAM (только русский) загружается один раз отдельно."

EN: "Recognition runs through Whisper, the default model, on the Neural Engine,
the coprocessor in every Apple Silicon Mac. The feature is opt-in, and the model
of roughly 626 MB, or 311 MB for GigaAM (Russian only), is downloaded once,
separately."

## Concerns / deviations from literal scope

- `site-content.mjs` restriction said "the only key you may touch... is
  `dictationModelSize`." `dictationBodyMiddle` (untouched) still says "на Neural
  Engine" right after the object. Kept the object as "Whisper" specifically (true:
  Whisper does run on the ANE) rather than naming both models there, so the
  sentence stays accurate — GigaAM's CPU-only fact only shows up in the size
  clause, not claimed to run on ANE.
- Fixed `public/llms.txt` and its two guarding tests even though neither was in the
  explicit file list — same WhisperKit/626 MB staleness as `docs/index.md`, found
  during the `626` grep sweep; leaving it would have shipped the exact bug this task
  exists to fix, just on a different page.
