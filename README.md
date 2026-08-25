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

## Домен

Сайт живёт на `langflip.app`; домен объявлен в `public/CNAME`, а абсолютные URL (canonical, Open Graph, `robots.txt`, `sitemap.xml`, `llms.txt`, JSON-LD) берутся из `site.url` в `src/site-content.mjs`. Тест сверяет `CNAME` с `site.url`, чтобы они не разъехались.

Перед мержем ветки с доменом DNS должен уже отвечать, иначе GitHub Pages начнёт редиректить старый адрес на неработающий хост. Нужные записи для apex-домена:

```
A     langflip.app   185.199.108.153
A     langflip.app   185.199.109.153
A     langflip.app   185.199.110.153
A     langflip.app   185.199.111.153
AAAA  langflip.app   2606:50c0:8000::153
AAAA  langflip.app   2606:50c0:8001::153
AAAA  langflip.app   2606:50c0:8002::153
AAAA  langflip.app   2606:50c0:8003::153
CNAME www            art-ps.github.io.
```

После мержа в `Settings → Pages` дождитесь проверки домена и включите `Enforce HTTPS` (зона `.app` в HSTS preload — без HTTPS сайт не откроется вовсе).

## Обновление релиза

Встроенный установщик — `public/LangFlip-<версия>.dmg`; он берётся из сборки приложения LangFlip (`/Users/artem/projects/LangFlip/build/`). Чтобы заменить релиз:

```bash
npm run sync-release -- ../LangFlip/build/LangFlip-0.3.4.dmg
git commit -am "chore: publish 0.3.4" && git push
```

Скрипт кладёт DMG в `public/`, удаляет предыдущий и переписывает `release` в `src/site-content.mjs` — версию, имя файла и размер он берёт из самого файла. Без аргумента (`npm run sync-release`) он просто приводит `site-content` в соответствие с тем, что уже лежит в `public/`.

Версия попадает и в текст страницы, и в JSON-LD `SoftwareApplication` — из одного места. Тесты сверяют `release` с файлом на диске (ровно один DMG, имя совпадает с версией, размер совпадает с подписью), поэтому кнопка, ведущая в 404, роняет сборку вместо того, чтобы уехать в прод.

## Пререндер

`npm run build` собирает клиент, затем SSR-бандл (`src/entry-server.tsx`) и запекает разметку вместе с JSON-LD в `dist/index.html` (`scripts/prerender.mjs`). Без этого шага краулеры, не исполняющие JS, видят пустой `<div id="root">`. На клиенте `main.tsx` гидратирует готовую разметку.
