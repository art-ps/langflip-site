export interface Release {
  readonly version: string;
  readonly fileName: string;
  readonly sizeLabel: string;
  readonly macOS: string;
}

export const release: Readonly<Release>;

export function downloadHref(baseUrl?: string): string;
