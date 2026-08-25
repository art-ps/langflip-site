import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
// The locale comes from the URL, not from a build flag: one bundle serves both pages,
// and hydrating /en/ with the Russian copy would swap the text under the reader.
const locale = window.location.pathname.startsWith("/en") ? "en" : "ru";
const assets = locale === "en" ? "../" : "./";
const tree = (
  <StrictMode>
    <App locale={locale} assets={assets} />
  </StrictMode>
);

// The build prerenders the markup, so the usual path is hydration; createRoot stays
// for `npm run dev`, where the root really is empty.
if (root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
