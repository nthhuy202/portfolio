import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { isSupportedLocale, routing } from "@/i18n/routing";
import { ThemeProvider, AnimatedBackground, PersonJsonLd } from "@/features/portfolio/components";
import { SITE_NAME, SITE_URL } from "@/features/portfolio/constants/site";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

interface GenerateMetadataProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function buildLanguageAlternates(): Record<string, string> {
  return Object.fromEntries(routing.locales.map((locale) => [locale, `/${locale}`]));
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: buildLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      locale,
      url: `/${locale}`,
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      <PersonJsonLd locale={locale} />
      <ThemeProvider>
        <NextIntlClientProvider messages={messages}>
          <AnimatedBackground />
          <div className="relative z-[1]">{children}</div>
        </NextIntlClientProvider>
      </ThemeProvider>
    </>
  );
}
