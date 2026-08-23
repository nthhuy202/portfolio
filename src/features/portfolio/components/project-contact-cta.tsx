import { useTranslations } from "next-intl";
import { EmailCtaButton } from "@/features/portfolio/components/email-cta-button";
import { CONTACT_EMAIL } from "@/features/portfolio/constants/social-links";

export function ProjectContactCta() {
  const t = useTranslations("caseStudy");

  return (
    <section className="py-16 border-t border-line max-w-[68.75rem] mx-auto px-6">
      <p className="text-fg-muted text-base leading-[1.65] max-w-[56ch] mb-5">{t("contactCta")}</p>
      <EmailCtaButton email={CONTACT_EMAIL} />
    </section>
  );
}
