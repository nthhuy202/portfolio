import { useTranslations } from "next-intl";
import { EmailCtaButton } from "@/features/portfolio/components/email-cta-button";
import {
  CONTACT_EMAIL,
  socialLinks,
} from "@/features/portfolio/constants/social-links";
import { IconLinkButton } from "./icon-link-button";

export function ProjectContactCta() {
  const t = useTranslations("caseStudy");

  return (
    <section className="py-16 border-t border-line max-w-[68.75rem] mx-auto px-6">
      <div className="bg-bg-raised border border-line rounded-lg p-11 flex flex-col items-start gap-[1.625rem]">
        <p className="text-fg-muted text-base leading-[1.65] max-w-none w-full m-0">
          {t("contactCta")}
        </p>

        <div className="flex items-center gap-6">
          <EmailCtaButton email={CONTACT_EMAIL} />

          {socialLinks.map((socialLink) => (
            <IconLinkButton key={socialLink.label} iconLink={socialLink} />
          ))}
        </div>
      </div>
    </section>
  );
}
