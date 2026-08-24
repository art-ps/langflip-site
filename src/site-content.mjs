export const site = Object.freeze({
  url: "https://langflip.app/",
  title: "LangFlip — аналог Punto Switcher для macOS: исправление раскладки и диктовка",
  description:
    "Бесплатная локальная утилита для macOS: автоматически переключает неправильную раскладку" +
    " и диктует текст в любое окно. Без облака и подписки.",
  repo: "https://github.com/art-ps/langflip",
});

export const release = Object.freeze({
  version: "0.3.2",
  fileName: "LangFlip-0.3.2.dmg",
  sizeLabel: "5,4 МБ",
  macOS: "macOS 14+",
});

export function downloadHref(baseUrl = "/") {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${base}${release.fileName}`;
}

/// Structured data for the landing page. Generated from the release above so the
/// version never drifts from the DMG the page actually links to.
export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LangFlip",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS 14.0 or later",
    softwareVersion: release.version,
    fileSize: release.sizeLabel,
    downloadUrl: `${site.url}${release.fileName}`,
    url: site.url,
    description: site.description,
    inLanguage: "ru",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
    author: { "@type": "Person", name: "Artem Pisarev", url: site.repo },
  };
}
