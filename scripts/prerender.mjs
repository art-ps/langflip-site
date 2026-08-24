// Bakes the rendered landing page and its JSON-LD into dist/index.html.
//
// The page is a React app, so without this step the shipped HTML is an empty
// <div id="root">: Googlebot renders it eventually, but AI crawlers and link preview
// bots do not run JavaScript and see nothing at all.
import { readFile, writeFile, rm } from "node:fs/promises";
import { softwareSchema } from "../src/site-content.mjs";

const dist = new URL("../dist/", import.meta.url);
const ssrEntry = new URL("../dist-ssr/entry-server.js", import.meta.url);
const indexPath = new URL("index.html", dist);

const { render } = await import(ssrEntry.href);
const markup = render();
const schema = JSON.stringify(softwareSchema(), null, 2);

const html = await readFile(indexPath, "utf8");
const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) {
  throw new Error("dist/index.html no longer contains the empty root div");
}

const rendered = html
  .replace(placeholder, `<div id="root">${markup}</div>`)
  .replace("</head>", `  <script type="application/ld+json">\n${schema}\n    </script>\n  </head>`);

await writeFile(indexPath, rendered);
await rm(new URL("../dist-ssr/", import.meta.url), { recursive: true, force: true });

console.log(`prerendered ${markup.length} chars of markup into dist/index.html`);
