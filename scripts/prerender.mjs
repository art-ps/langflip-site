// Bakes every locale of the landing page, with its head metadata and JSON-LD, into dist/.
//
// The page is a React app, so without this step the shipped HTML is an empty
// <div id="root">: Googlebot renders it eventually, but AI crawlers and link preview
// bots do not run JavaScript and see nothing at all.
//
// One Vite build produces one index.html; the locales are baked from that same template,
// so the English page cannot drift from the Russian one in markup, assets or scripts.
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { headTags } from "../src/head.mjs";
import { locales, meta, softwareSchema } from "../src/site-content.mjs";

const dist = new URL("../dist/", import.meta.url);
const ssrEntry = new URL("../dist-ssr/entry-server.js", import.meta.url);
const templatePath = new URL("index.html", dist);

const { render } = await import(ssrEntry.href);
const template = await readFile(templatePath, "utf8");

const rootPlaceholder = '<div id="root"></div>';
const seoPlaceholder = "<!--seo-->";
for (const [name, placeholder] of [["root div", rootPlaceholder], ["seo comment", seoPlaceholder]]) {
  if (!template.includes(placeholder)) {
    throw new Error(`dist/index.html no longer contains the ${name}`);
  }
}

for (const locale of locales) {
  const { lang, path, title } = meta[locale];
  // Assets sit next to the Russian page and one level up from every nested locale.
  const assets = path === "" ? "./" : "../";
  const markup = render(locale, assets);
  const schema = JSON.stringify(softwareSchema(locale), null, 2);

  let html = template
    .replace(rootPlaceholder, `<div id="root">${markup}</div>`)
    .replace(seoPlaceholder, headTags(locale).trimStart())
    .replace("<title>LangFlip</title>", `<title>${title}</title>`)
    .replace('<html lang="ru">', `<html lang="${lang}">`)
    .replace("</head>", `  <script type="application/ld+json">\n${schema}\n    </script>\n  </head>`);

  if (assets === "../") {
    // Vite emits relative asset URLs for the root page; a page in a subdirectory needs
    // them rewritten, otherwise /en/ asks for /en/assets/… and gets a 404.
    html = html.replace(/(src|href)="\.\//g, '$1="../');
  }

  const target = new URL(`${path}index.html`, dist);
  await mkdir(new URL(".", target), { recursive: true });
  await writeFile(target, html);
  console.log(`prerendered ${markup.length} chars of ${locale} markup into dist/${path}index.html`);
}

await rm(new URL("../dist-ssr/", import.meta.url), { recursive: true, force: true });
