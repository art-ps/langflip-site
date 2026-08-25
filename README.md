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

Установщик не лежит в репозитории: он публикуется ассетом GitHub-релиза `v<версия>` и оттуда же считаются загрузки — Pages не даёт логов, а счётчик релиза единственный бесплатный способ увидеть, дал ли пост установки. Чтобы выложить новую сборку:

```bash
npm run sync-release -- ../LangFlip/build/LangFlip-0.3.4.dmg
git commit -am "chore: publish 0.3.4" && git push
```

Скрипт берёт версию и размер из самого файла, переписывает `release` в `src/site-content.mjs`, создаёт релиз `v0.3.4` (или дозаливает ассет в существующий) через `gh`. Без аргумента он ничего не меняет и печатает текущую версию.

Версия попадает и в текст обеих страниц, и в JSON-LD `SoftwareApplication` — из одного места. Кнопка ведёт на `https://github.com/art-ps/langflip-site/releases/download/v<версия>/LangFlip-<версия>.dmg`, поэтому релиз обязан существовать: без него кнопка отдаёт 404.

Счётчик загрузок:

```bash
gh api repos/art-ps/langflip-site/releases --jq '.[] | "\(.tag_name) \(.assets[].download_count)"'
```

## Локали

Страница собирается на двух языках из одного шаблона: русская — `/`, английская — `/en/`. Все тексты лежат в `copy` (`src/site-content.mjs`), head-теги генерирует `src/head.mjs`, а `scripts/prerender.mjs` запекает по странице на локаль, подставляя `canonical`, `hreflang` и JSON-LD. Тест сверяет наборы ключей `copy.ru` и `copy.en` и ловит русский текст, оставшийся в английской версии.

Документация пока только на русском, поэтому в английской навигации ссылки на `/docs/` нет — она появится вместе с переводом.

## Документация

Пользовательская документация — VitePress в `docs/`, собирается в `dist/docs` и уезжает тем же деплоем: [langflip.app/docs](https://langflip.app/docs/). Правится обычным markdown, локальный просмотр — `npm run docs:dev`.

Рабочие материалы (`docs/superpowers/`) исключены из публикации через `srcExclude`. Список страниц продублирован в `public/sitemap.xml`, и тест сверяет карту сайта с содержимым `docs/` — новая страница без записи в карте роняет сборку.

## Пререндер

`npm run build` собирает клиент, затем SSR-бандл (`src/entry-server.tsx`) и запекает разметку вместе с head-тегами и JSON-LD в `dist/index.html` и `dist/en/index.html` (`scripts/prerender.mjs`). Без этого шага краулеры, не исполняющие JS, видят пустой `<div id="root">`. На клиенте `main.tsx` гидратирует готовую разметку.
