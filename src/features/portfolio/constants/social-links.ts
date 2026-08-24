import { IconGithub, IconLinkedin, IconFacebook } from "@/components/icons";
import type { IconLink } from "@/features/portfolio/types/content";

export const CONTACT_EMAIL = "nthhuy202@gmail.com";

export const socialLinks: IconLink[] = [
  { Icon: IconGithub, href: "https://github.com/nthhuy202", label: "GitHub", brandColor: "#181717", displayText: "github.com/nthhuy202" },
  { Icon: IconLinkedin, href: "https://linkedin.com/in/nthhuy202", label: "LinkedIn", brandColor: "#0a66c2", displayText: "linkedin.com/in/nthhuy202" },
  { Icon: IconFacebook, href: "https://facebook.com/hahuy202", label: "Facebook", brandColor: "#1877f2", displayText: "facebook.com/hahuy202" },
];
