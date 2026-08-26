import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";
import { OG_IMAGE_SIZE, ogImageContentType, renderOgImage } from "@/features/portfolio/utils/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = ogImageContentType;

interface ProjectOpengraphImageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProjectOpengraphImage({ params }: ProjectOpengraphImageProps) {
  const { locale, slug } = await params;
  const project = getAllProjectsMeta(locale).find((meta) => meta.slug === slug);

  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "caseStudy" });

  return renderOgImage({
    eyebrow: t("ogEyebrow"),
    title: project.title,
    subtitle: project.summary,
  });
}
