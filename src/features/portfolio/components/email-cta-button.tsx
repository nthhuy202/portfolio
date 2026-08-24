import { IconMail } from "@/components/icons";
import { IconLinkButton } from "@/features/portfolio/components/icon-link-button";

interface EmailCtaButtonProps {
  email: string;
}

export function EmailCtaButton({ email }: EmailCtaButtonProps) {
  return (
    <IconLinkButton
      iconLink={{
        Icon: IconMail,
        href: `mailto:${email}`,
        label: email,
        brandColor: "var(--color-accent)",
        displayText: email,
      }}
    />
  );
}
