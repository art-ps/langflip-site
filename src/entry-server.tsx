import { renderToString } from "react-dom/server";
import App from "./App";

/// Build-time only: `scripts/prerender.mjs` calls this to bake the landing page into
/// dist/index.html. Crawlers that do not run JavaScript — most AI crawlers and link
/// preview bots — otherwise see an empty <div id="root">.
///
/// The base is passed explicitly because Vite reports BASE_URL as "/" in an SSR build,
/// while the site is served from a GitHub Pages subpath and vite.config sets "./".
export function render(base = "./") {
  return renderToString(<App base={base} />);
}
