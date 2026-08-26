import type { MetadataRoute } from "next";
import { SITE_URL } from "@/features/portfolio/constants/site";
import { routing } from "@/i18n/routing";
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";

function buildLanguageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    alternates: { languages: buildLanguageAlternates("") },
  }));

  const projectEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    getAllProjectsMeta(locale).map((project) => ({
      url: `${SITE_URL}/${locale}/projects/${project.slug}`,
      lastModified,
      alternates: { languages: buildLanguageAlternates(`/projects/${project.slug}`) },
    })),
  );

  return [...homeEntries, ...projectEntries];
}
