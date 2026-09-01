import { defineConfig } from "vitepress";

// Built after the landing page and dropped into dist/docs, so the whole site —
// page and documentation — deploys as one artifact under langflip.app.
export default defineConfig({
  title: "LangFlip",
  description: "Документация LangFlip: установка, настройка и то, как приложение принимает решения.",
  lang: "ru-RU",
  base: "/docs/",
  outDir: "../dist/docs",
  // Design notes and implementation plans live here too; they are working documents,
  // not something to publish under langflip.app.
  srcExclude: ["superpowers/**"],
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/langflip-icon.png" }],
    [
      "script",
      {
        defer: "",
        src: "https://stats.pisarev.me/script.js",
        "data-website-id": "8188c8a1-577c-4491-8913-d1acac226f58",
      },
    ],
  ],
  themeConfig: {
    logo: "/langflip-icon.png",
    nav: [
      { text: "Документация", link: "/" },
      { text: "Скачать", link: "https://langflip.app/" },
    ],
    sidebar: [
      {
        text: "Начало",
        items: [
          { text: "Обзор", link: "/" },
          { text: "Установка", link: "/install" },
        ],
      },
      {
        text: "Как это работает",
        items: [
          { text: "Конверсия раскладки", link: "/how-it-works" },
          { text: "Диктовка", link: "/dictation" },
        ],
      },
      {
        text: "Справочник",
        items: [
          { text: "Настройки", link: "/settings" },
          { text: "Приватность", link: "/privacy" },
          { text: "Решение проблем", link: "/troubleshooting" },
        ],
      },
    ],
    outline: { label: "На этой странице", level: [2, 3] },
    docFooter: { prev: "Назад", next: "Дальше" },
    darkModeSwitchLabel: "Оформление",
    returnToTopLabel: "Наверх",
    sidebarMenuLabel: "Разделы",
    lastUpdatedText: "Обновлено",
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "Поиск", buttonAriaLabel: "Поиск по документации" },
          modal: {
            noResultsText: "Ничего не найдено",
            resetButtonTitle: "Сбросить",
            footer: { selectText: "выбрать", navigateText: "переход", closeText: "закрыть" },
          },
        },
      },
    },
    footer: {
      message: "Локальная утилита для macOS: исправление раскладки и диктовка.",
      copyright: "langflip.app",
    },
  },
});
