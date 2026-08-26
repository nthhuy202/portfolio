import { EmailCtaButton } from "@/features/portfolio/components/email-cta-button";
import { IconLinkButton } from "@/features/portfolio/components/icon-link-button";
import { CONTACT_EMAIL, socialLinks } from "@/features/portfolio/constants/social-links";

interface ContactLinksProps {
  blurb: string;
}

export function ContactLinks({ blurb }: ContactLinksProps) {
  return (
    <div className="bg-bg-raised border border-line rounded-lg p-11 flex flex-col items-start gap-[1.625rem]">
      <p className="text-fg-muted text-base leading-[1.65] max-w-none w-full m-0">{blurb}</p>
      <div className="flex flex-col sm:flex-row gap-8 sm:flex-wrap sm:items-center w-full">
        <EmailCtaButton email={CONTACT_EMAIL} />
        {socialLinks.map((socialLink) => (
          <IconLinkButton key={socialLink.label} iconLink={socialLink} />
        ))}
      </div>
    </div>
  );
}
