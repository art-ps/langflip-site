# LangFlip site

Статический лендинг LangFlip для GitHub Pages.

## Локальная работа

```bash
npm install
npm run dev
npm test
npm run build
```

## Публикация

Workflow `.github/workflows/pages.yml` собирает сайт и публикует `dist/` при push в `master` или ручном запуске. В репозитории откройте `Settings → Pages` и выберите `Source: GitHub Actions`.

## Обновление релиза

Встроенный установщик — `public/LangFlip-<версия>.dmg`; он берётся из сборки приложения LangFlip (`/Users/artem/projects/LangFlip/build/`). Чтобы заменить релиз:

1. положите новый DMG в `public/`, удалите старый;
2. обновите `release` в `src/site-content.mjs` (версия, имя файла, размер);
3. поправьте ожидаемые значения в `tests/site-content.test.mjs` и прогоните `npm test`.

Версия попадает и в текст страницы, и в JSON-LD `SoftwareApplication` — из одного места.

## Пререндер

`npm run build` собирает клиент, затем SSR-бандл (`src/entry-server.tsx`) и запекает разметку вместе с JSON-LD в `dist/index.html` (`scripts/prerender.mjs`). Без этого шага краулеры, не исполняющие JS, видят пустой `<div id="root">`. На клиенте `main.tsx` гидратирует готовую разметку.
