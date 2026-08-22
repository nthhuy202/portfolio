import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { socialLinks } from "@/features/portfolio/constants/social-links";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="pt-8 pb-[3.75rem] max-w-[68.75rem] mx-auto px-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-[0.86rem] text-fg-muted font-mono">© 2026 Nguyễn Thanh Hà Huy</p>
        <div className="flex items-center gap-5">
          <div className="flex gap-2.5">
            {socialLinks.map(({ Icon, href, label, brandColor }) => (
              <a
                key={label}
                className="w-[2.125rem] h-[2.125rem] rounded-full border border-line flex items-center justify-center text-fg-muted no-underline transition-[color,border-color] duration-150 ease-[ease] hover:text-[var(--brand-color)] hover:border-[var(--brand-color)]"
                style={{ "--brand-color": brandColor } as CSSProperties}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
          <a className="font-mono text-[0.86rem] text-fg-muted no-underline hover:text-fg" href="#top">
            {t("top")}
          </a>
        </div>
      </div>
    </footer>
  );
}
