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

Встроенный установщик — `public/LangFlip-0.2.1.dmg`; он берётся из сборки приложения LangFlip (`/Users/artem/projects/LangFlip/build/LangFlip-0.2.1.dmg`). Чтобы заменить релиз, обновите DMG в `public/` и метаданные версии/имени в `src/site-content.mjs`.
