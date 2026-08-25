export type Locale = "ru" | "en";

export interface Release {
  readonly version: string;
  readonly fileName: string;
  readonly sizeLabel: string;
  readonly sizeLabelEn: string;
  readonly macOS: string;
}

export interface Site {
  readonly url: string;
}

export interface LocaleMeta {
  readonly lang: string;
  readonly ogLocale: string;
  readonly path: string;
  readonly docsHref: string | null;
  readonly switchHref: string;
  readonly title: string;
  readonly description: string;
  readonly twitterDescription: string;
}

export interface Copy {
  readonly sizeLabel: string;
  readonly backToTop: string;
  readonly iconAlt: string;
  readonly heroIconAlt: string;
  readonly navLabel: string;
  readonly navFeatures: string;
  readonly navPrivacy: string;
  readonly navInstall: string;
  readonly navDocs: string;
  readonly navDownload: string;
  readonly languageLabel: string;
  readonly languageSwitch: string;
  readonly badgeFree: string;
  readonly heroEyebrow: string;
  readonly heroTitle: string;
  readonly heroDescriptionBefore: string;
  readonly heroDescriptionAfter: string;
  readonly downloadCta: string;
  readonly releaseNoteSize: string;
  readonly demoLabel: string;
  readonly demoBefore: string;
  readonly demoAfter: string;
  readonly dictationChip: string;
  readonly featuresEyebrow: string;
  readonly featuresTitle: string;
  readonly featuresLead: string;
  readonly feature1Title: string;
  readonly feature1Body: string;
  readonly feature2Title: string;
  readonly feature2Before: string;
  readonly feature2Middle: string;
  readonly feature3Title: string;
  readonly feature3Body: string;
  readonly dictationEyebrow: string;
  readonly dictationTitle: string;
  readonly dictationBodyBefore: string;
  readonly dictationBodyMiddle: string;
  readonly dictationModelSize: string;
  readonly dictationBodyAfter: string;
  readonly dictationStepsLabel: string;
  readonly dictationStep1: string;
  readonly dictationStep1Note: string;
  readonly dictationStep2: string;
  readonly dictationStep2Note: string;
  readonly dictationStep3: string;
  readonly dictationStep3Note: string;
  readonly privacyEyebrow: string;
  readonly privacyTitle: string;
  readonly privacyLead: string;
  readonly privacyItems: readonly string[];
  readonly installEyebrow: string;
  readonly installTitle: string;
  readonly installLead: string;
  readonly install1Title: string;
  readonly install1Body: string;
  readonly install2Title: string;
  readonly install2Body: string;
  readonly install3Title: string;
  readonly install3Body: string;
  readonly install4Title: string;
  readonly install4Body: string;
  readonly finalEyebrow: string;
  readonly finalTitle: string;
  readonly finalLead: string;
  readonly footerVersion: string;
  readonly footerLinksLabel: string;
}

export const site: Readonly<Site>;

export const meta: Readonly<Record<Locale, LocaleMeta>>;

export const locales: readonly Locale[];

export const release: Readonly<Release>;

export const copy: Readonly<Record<Locale, Copy>>;

export const downloadBase: string;

export function downloadHref(): string;

export function localeUrl(locale: Locale): string;

export function softwareSchema(locale?: Locale): Record<string, unknown>;
