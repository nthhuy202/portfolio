import { EmailCtaButton } from "@/features/portfolio/components/email-cta-button";
import { IconLinkButton } from "@/features/portfolio/components/icon-link-button";
import { CopyButton } from "@/features/portfolio/components/copy-button";
import { CONTACT_EMAIL, socialLinks } from "@/features/portfolio/constants/social-links";
import { getCopyValue } from "@/features/portfolio/utils/contact";

interface ContactLinksProps {
  blurb: string;
}

export function ContactLinks({ blurb }: ContactLinksProps) {
  return (
    <div className="bg-bg-raised border border-line rounded-lg p-11 flex flex-col items-start gap-[1.625rem]">
      <p className="text-fg-muted text-base leading-[1.65] max-w-none w-full m-0">{blurb}</p>
      <div className="flex gap-8 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <EmailCtaButton email={CONTACT_EMAIL} />
          <CopyButton value={CONTACT_EMAIL} label={CONTACT_EMAIL} />
        </div>
        {socialLinks.map((socialLink) => (
          <div key={socialLink.label} className="flex items-center gap-2">
            <IconLinkButton iconLink={socialLink} />
            <CopyButton value={getCopyValue(socialLink.href)} label={socialLink.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
