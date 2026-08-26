import type { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

// The true App Router root — every page (including this segment's own
// not-found.tsx, for paths that never resolve to a supported locale) needs
// this to exist. `getLocale()` reads the locale next-intl's middleware
// resolved for the request, since this layout sits above the [locale]
// segment and doesn't receive its route params.
export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
