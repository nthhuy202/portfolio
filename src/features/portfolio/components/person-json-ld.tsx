import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/features/portfolio/constants/site";
import { CONTACT_EMAIL, socialLinks } from "@/features/portfolio/constants/social-links";

interface PersonJsonLdProps {
  locale: string;
}

export async function PersonJsonLd({ locale }: PersonJsonLdProps) {
  const t = await getTranslations({ locale, namespace: "hero" });

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t("name"),
    jobTitle: t("role"),
    url: `${SITE_URL}/${locale}`,
    email: `mailto:${CONTACT_EMAIL}`,
    sameAs: socialLinks.map((socialLink) => socialLink.href),
  };

  return (
    <script
      type="application/ld+json"
      // Structured data must be raw JSON in the DOM for search engines to parse it —
      // the content is server-built from i18n strings and constants, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}
