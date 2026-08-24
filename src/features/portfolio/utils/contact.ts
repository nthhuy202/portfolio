const MAILTO_PREFIX = "mailto:";

// Copying a mailto: link should copy the raw email address, not the URI scheme.
export function getCopyValue(href: string): string {
  return href.startsWith(MAILTO_PREFIX) ? href.slice(MAILTO_PREFIX.length) : href;
}
