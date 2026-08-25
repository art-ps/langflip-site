export const site = Object.freeze({
  url: "https://langflip.app/",
});

/// Per-locale head metadata. `path` is the URL segment the locale is served from, so
/// canonical links, hreflang and the sitemap all derive from one place.
export const meta = Object.freeze({
  ru: Object.freeze({
    lang: "ru",
    ogLocale: "ru_RU",
    path: "",
    // The documentation is Russian only for now, so the English page does not link to it.
    docsHref: "/docs/",
    switchHref: "/en/",
    title: "LangFlip — аналог Punto Switcher для macOS: исправление раскладки и диктовка",
    description:
      "Бесплатная локальная утилита для macOS: автоматически переключает неправильную раскладку" +
      " и диктует текст в любое окно. Без облака и подписки.",
    twitterDescription: "Исправляет раскладку и помогает диктовать в любое окно — локально на Mac.",
  }),
  en: Object.freeze({
    lang: "en",
    ogLocale: "en_US",
    path: "en/",
    docsHref: null,
    switchHref: "/",
    title: "LangFlip — fix wrong-layout typing on macOS and dictate anywhere",
    description:
      "Free on-device macOS utility: rewrites words typed in the wrong keyboard layout" +
      " and turns speech into text in any window. No cloud, no account, no subscription.",
    twitterDescription: "Fixes wrong-layout typing and dictates into any window, entirely on your Mac.",
  }),
});

export const locales = Object.freeze(Object.keys(meta));

export const release = Object.freeze({
  version: "0.3.4",
  fileName: "LangFlip-0.3.4.dmg",
  sizeLabel: "5,4 МБ",
  sizeLabelEn: "5.4 MB",
  macOS: "macOS 14+",
});

/// The DMG is served as a GitHub release asset instead of from the site: Pages keeps
/// no logs, and the release download counter is the only free way to tell whether a
/// post actually produced installs. The repository holding the asset is the public
/// site repository, not the private app one.
export const downloadBase = "https://github.com/art-ps/langflip-site/releases/download";

export function downloadHref() {
  return `${downloadBase}/v${release.version}/${release.fileName}`;
}

export function localeUrl(locale) {
  return `${site.url}${meta[locale].path}`;
}

/// Structured data for the landing page. Generated from the release above so the
/// version never drifts from the DMG the page actually links to.
export function softwareSchema(locale = "ru") {
  const localeMeta = meta[locale];
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LangFlip",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS 14.0 or later",
    softwareVersion: release.version,
    fileSize: locale === "en" ? release.sizeLabelEn : release.sizeLabel,
    downloadUrl: downloadHref(),
    url: localeUrl(locale),
    description: localeMeta.description,
    inLanguage: localeMeta.lang,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
    author: { "@type": "Person", name: "Artem Pisarev" },
  };
}

/// Every string the landing page renders, per locale. The page component reads only
/// from here, so a missing translation surfaces as a failing key-parity test instead
/// of a Russian sentence sitting on the English page.
export const copy = Object.freeze({
  ru: Object.freeze({
    sizeLabel: release.sizeLabel,
    backToTop: "LangFlip: к началу страницы",
    iconAlt: "Иконка приложения LangFlip",
    heroIconAlt: "Иконка LangFlip для macOS",
    navLabel: "Основная навигация",
    navFeatures: "Возможности",
    navPrivacy: "Приватность",
    navInstall: "Установка",
    navDocs: "Документация",
    navDownload: "Скачать",
    languageLabel: "Язык страницы",
    languageSwitch: "English",
    badgeFree: "Бесплатно для macOS",
    heroEyebrow: "Аналог Punto Switcher для macOS",
    heroTitle: "Исправляет раскладку, пока вы печатаете.",
    heroDescriptionBefore:
      "LangFlip замечает слова в неправильной раскладке, исправляет их автоматически и по двойному нажатию",
    heroDescriptionAfter:
      ". Автопереключение раскладки и диктовка работают локально на Mac и включаются по желанию.",
    downloadCta: `Скачать LangFlip ${release.version}`,
    releaseNoteSize: `около ${release.sizeLabel}`,
    demoLabel:
      "Демонстрация исправления раскладки: ghbdtn превращается в привет по двойному нажатию Command",
    demoBefore: "До",
    demoAfter: "После",
    dictationChip: "Диктовка готова — удерживайте",
    featuresEyebrow: "Три способа писать быстрее",
    featuresTitle: "Не отвлекайтесь от мысли",
    featuresLead:
      "LangFlip берёт на себя раскладку и ввод — незаметно, когда не нужен, и всегда под рукой.",
    feature1Title: "Исправляет автоматически",
    feature1Body:
      "Распознаёт слово в неправильной русской или английской раскладке и заменяет его на верное.",
    feature2Title: "Переключает вручную",
    feature2Before: "Дважды нажмите",
    feature2Middle: ", чтобы преобразовать последнее слово. Если передумали —",
    feature3Title: "Диктуйте в любое окно",
    feature3Body: "Удерживайте ⌘ и говорите: текст появится в активном поле любого приложения.",
    dictationEyebrow: "Локальная диктовка",
    dictationTitle: "Голос превращается в текст прямо на Mac",
    dictationBodyBefore: "Распознавание работает через",
    dictationBodyMiddle:
      "на Neural Engine — процессоре, который есть в каждом Mac на Apple Silicon. Функция включается по желанию, а модель размером около",
    dictationModelSize: "626 МБ",
    dictationBodyAfter: "загружается один раз отдельно.",
    dictationStepsLabel: "Как пользоваться диктовкой",
    dictationStep1: "Удерживайте",
    dictationStep1Note: "клавишу ⌘",
    dictationStep2: "Говорите",
    dictationStep2Note: "в обычном темпе",
    dictationStep3: "Отпустите",
    dictationStep3Note: "текст появится в поле",
    privacyEyebrow: "Приватность по умолчанию",
    privacyTitle: "Ваш текст не покидает Mac",
    privacyLead: "Никаких аккаунтов и скрытой отправки данных. Только локальная обработка.",
    privacyItems: Object.freeze([
      "Исправление и распознавание речи работают локально на Mac.",
      "Нажатия клавиш и полный текст полей не сохраняются.",
      "Нет аналитики, облачного API и отправки текста на сервер.",
      "Защищённые поля исключаются из обработки.",
    ]),
    installEyebrow: "Четыре шага",
    installTitle: "Установите и продолжайте печатать",
    installLead: "Текущая сборка имеет developer-подпись, но пока не нотаризована Apple.",
    install1Title: "Перенесите приложение",
    install1Body: "Откройте DMG и перетащите LangFlip в папку Applications.",
    install2Title: "Откройте через меню",
    install2Body: "При первом запуске нажмите Правой кнопкой → Открыть и подтвердите запуск.",
    install3Title: "Разрешите доступ",
    install3Body: "Включите Input Monitoring и Accessibility. Микрофон нужен только для диктовки.",
    install4Title: "Выберите раскладки",
    install4Body: "Укажите русскую и английскую раскладки и при желании загрузите речевую модель.",
    finalEyebrow: "Готово к работе",
    finalTitle: "Печатайте на двух языках без лишних переключений",
    finalLead: "Бесплатно. Без подписки. Данные остаются на Mac.",
    footerVersion: `Версия ${release.version}`,
    footerLinksLabel: "Ссылки проекта",
  }),
  en: Object.freeze({
    sizeLabel: release.sizeLabelEn,
    backToTop: "LangFlip: back to top",
    iconAlt: "LangFlip app icon",
    heroIconAlt: "LangFlip icon for macOS",
    navLabel: "Main navigation",
    navFeatures: "Features",
    navPrivacy: "Privacy",
    navInstall: "Install",
    navDocs: "Docs",
    navDownload: "Download",
    languageLabel: "Page language",
    languageSwitch: "Русский",
    badgeFree: "Free for macOS",
    heroEyebrow: "Punto Switcher for the Mac",
    heroTitle: "Fixes the keyboard layout while you type.",
    heroDescriptionBefore:
      "LangFlip spots words typed in the wrong layout, rewrites them as you go, and converts on a double tap of",
    heroDescriptionAfter:
      ". Layout correction and dictation both run on your Mac, and each one is opt-in.",
    downloadCta: `Download LangFlip ${release.version}`,
    releaseNoteSize: `about ${release.sizeLabelEn}`,
    demoLabel: "Layout correction demo: ghbdtn becomes привет after a double tap of Command",
    demoBefore: "Typed",
    demoAfter: "Fixed",
    dictationChip: "Dictation ready, hold",
    featuresEyebrow: "Three ways to type faster",
    featuresTitle: "Stay with the sentence, not the keyboard",
    featuresLead:
      "LangFlip takes over the layout and the typing: invisible when you do not need it, in reach when you do.",
    feature1Title: "Corrects as you type",
    feature1Body:
      "Detects a word typed in the wrong Russian or English layout and replaces it with the right one.",
    feature2Title: "Or converts on demand",
    feature2Before: "Double-tap",
    feature2Middle: "to convert the last word. Changed your mind —",
    feature3Title: "Dictate into any window",
    feature3Body: "Hold ⌘ and speak: the text lands in the active field of any app.",
    dictationEyebrow: "On-device dictation",
    dictationTitle: "Speech becomes text on the Mac itself",
    dictationBodyBefore: "Recognition runs through",
    dictationBodyMiddle:
      "on the Neural Engine, the coprocessor in every Apple Silicon Mac. The feature is opt-in, and the model of roughly",
    dictationModelSize: "626 MB",
    dictationBodyAfter: "is downloaded once, separately.",
    dictationStepsLabel: "How dictation works",
    dictationStep1: "Hold",
    dictationStep1Note: "the ⌘ key",
    dictationStep2: "Speak",
    dictationStep2Note: "at a normal pace",
    dictationStep3: "Release",
    dictationStep3Note: "text appears in the field",
    privacyEyebrow: "Private by default",
    privacyTitle: "Your text never leaves the Mac",
    privacyLead: "No accounts, no quiet uploads. Local processing only.",
    privacyItems: Object.freeze([
      "Correction and speech recognition run locally on the Mac.",
      "Keystrokes and full field contents are never stored.",
      "No analytics, no cloud API, no text sent to a server.",
      "Secure input fields are excluded from processing.",
    ]),
    installEyebrow: "Four steps",
    installTitle: "Install it and keep typing",
    installLead: "The current build is developer-signed but not yet notarized by Apple.",
    install1Title: "Move the app",
    install1Body: "Open the DMG and drag LangFlip into your Applications folder.",
    install2Title: "Open it from the menu",
    install2Body: "On first launch use Right click → Open, then confirm.",
    install3Title: "Grant access",
    install3Body: "Enable Input Monitoring and Accessibility. The microphone is only needed for dictation.",
    install4Title: "Pick your layouts",
    install4Body: "Choose the Russian and English layouts, and download the speech model if you want dictation.",
    finalEyebrow: "Ready to work",
    finalTitle: "Type in two languages without switching by hand",
    finalLead: "Free. No subscription. Your data stays on the Mac.",
    footerVersion: `Version ${release.version}`,
    footerLinksLabel: "Project links",
  }),
});
