import { getTranslations } from "next-intl/server";
import { OG_IMAGE_SIZE, ogImageContentType, renderOgImage } from "@/features/portfolio/utils/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = ogImageContentType;

interface OpengraphImageProps {
  params: Promise<{ locale: string }>;
}

export default async function OpengraphImage({ params }: OpengraphImageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return renderOgImage({
    eyebrow: t("eyebrow"),
    title: `${t("hi")} ${t("name")}`,
    subtitle: t("role"),
  });
}
