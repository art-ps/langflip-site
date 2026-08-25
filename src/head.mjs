import { locales, localeUrl, meta, site } from "./site-content.mjs";

/// The head is generated rather than written into index.html because the site now ships
/// two pages from one template: canonical, og:locale and the hreflang pairs differ per
/// locale, and hand-keeping two copies of that block is how a stale canonical ends up in
/// production. index.html carries a `<!--seo-->` placeholder that the prerender replaces.
export function headTags(locale) {
  const localeMeta = meta[locale];
  const url = localeUrl(locale);
  const image = `${site.url}og.jpg`;

  const alternates = locales.map(
    (other) => `<link rel="alternate" hreflang="${meta[other].lang}" href="${localeUrl(other)}" />`,
  );
  alternates.push(`<link rel="alternate" hreflang="x-default" href="${site.url}" />`);

  return [
    `<meta name="description" content="${localeMeta.description}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${localeMeta.ogLocale}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${localeMeta.title}" />`,
    `<meta property="og:description" content="${localeMeta.description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${localeMeta.title}" />`,
    `<meta name="twitter:description" content="${localeMeta.twitterDescription}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ]
    .map((tag) => `    ${tag}`)
    .join("\n");
}
