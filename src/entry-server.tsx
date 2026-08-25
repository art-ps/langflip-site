import { renderToString } from "react-dom/server";
import App from "./App";

/// Build-time only: `scripts/prerender.mjs` calls this to bake each landing page into
/// dist/. Crawlers that do not run JavaScript — most AI crawlers and link preview bots —
/// otherwise see an empty <div id="root">.
///
/// Both arguments are explicit because Vite reports BASE_URL as "/" in an SSR build,
/// while vite.config sets "./" and the English page is served one directory deeper.
export function render(locale: "ru" | "en" = "ru", assets = "./") {
  return renderToString(<App locale={locale} assets={assets} />);
}
