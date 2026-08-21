import experienceEn from "@/features/portfolio/content/experience/en.json";
import experienceVi from "@/features/portfolio/content/experience/vi.json";
import type { ExperienceEntry } from "@/features/portfolio/types/content";

const experienceByLocale: Record<string, ExperienceEntry[]> = {
  en: experienceEn,
  vi: experienceVi,
};

export function getExperience(locale: string): ExperienceEntry[] {
  return experienceByLocale[locale] ?? experienceByLocale.en;
}
