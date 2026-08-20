export const release = Object.freeze({
  version: "0.2.1",
  fileName: "LangFlip-0.2.1.dmg",
  sizeLabel: "4,3 МБ",
  macOS: "macOS 14+",
});

export function downloadHref(baseUrl = "/") {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${base}${release.fileName}`;
}
