import { useTranslations } from "next-intl";
import { ContactLinks } from "@/features/portfolio/components/contact-links";

export function ProjectContactCta() {
  const t = useTranslations("caseStudy");

  return (
    <section className="py-16 border-t border-line max-w-[68.75rem] mx-auto px-6">
      <ContactLinks blurb={t("contactCta")} />
    </section>
  );
}
