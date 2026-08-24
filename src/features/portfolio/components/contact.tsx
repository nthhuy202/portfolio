import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { EmailCtaButton } from "@/features/portfolio/components/email-cta-button";
import { IconLinkButton } from "@/features/portfolio/components/icon-link-button";
import { CONTACT_EMAIL, socialLinks } from "@/features/portfolio/constants/social-links";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 relative max-w-[68.75rem] mx-auto px-6">
      <Reveal className="mb-11 max-w-[40rem]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal className="bg-bg-raised border border-line rounded-lg p-11 flex flex-col items-start gap-[1.625rem]">
        <p className="text-fg-muted text-base leading-[1.65] max-w-none w-full m-0">{t("blurb")}</p>
        <div className="flex gap-8 flex-wrap items-center">
          <EmailCtaButton email={CONTACT_EMAIL} />
          {socialLinks.map((socialLink) => (
            <IconLinkButton key={socialLink.label} iconLink={socialLink} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
