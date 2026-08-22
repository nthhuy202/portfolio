import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { socialLinks } from "@/features/portfolio/constants/social-links";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="shell">
      <div className="footer-row">
        <p>© 2026 Nguyễn Thanh Hà Huy</p>
        <div className="footer-right">
          <div className="social-row">
            {socialLinks.map(({ Icon, href, label, brandColor }) => (
              <a
                key={label}
                className="social-icon inline-flex items-center justify-center w-8 h-8 text-fg-muted transition-colors duration-150 hover:text-[var(--brand-color)]"
                style={{ "--brand-color": brandColor } as CSSProperties}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              </a>
            ))}
          </div>
          <a className="to-top" href="#top">
            {t("top")}
          </a>
        </div>
      </div>
    </footer>
  );
}
