export interface Release {
  readonly version: string;
  readonly fileName: string;
  readonly sizeLabel: string;
  readonly macOS: string;
}

export interface Site {
  readonly url: string;
  readonly title: string;
  readonly description: string;
}

export const site: Readonly<Site>;

export const release: Readonly<Release>;

export function downloadHref(baseUrl?: string): string;

export function softwareSchema(): Record<string, unknown>;
