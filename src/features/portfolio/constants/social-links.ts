import { IconGithub, IconLinkedin, IconFacebook } from "@/components/icons";
import type { SocialLink } from "@/features/portfolio/types/content";

export const socialLinks: SocialLink[] = [
  { Icon: IconGithub, href: "https://github.com/nthhuy202", label: "GitHub", brandColor: "#181717" },
  { Icon: IconLinkedin, href: "https://linkedin.com/in/nthhuy202", label: "LinkedIn", brandColor: "#0a66c2" },
  { Icon: IconFacebook, href: "https://facebook.com/hahuy202", label: "Facebook", brandColor: "#1877f2" },
];
