import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="shell">
      <div className="footer-row">
        <p>© 2026 Alex Tran — {t("built")}</p>
        <div className="footer-right">
          <div className="social-row">
            <a className="social-icon" href="https://github.com/alextran" target="_blank" rel="noreferrer" aria-label="GitHub">
              GH
            </a>
            <a className="social-icon" href="https://linkedin.com/in/alextran" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              in
            </a>
            <a className="social-icon" href="https://facebook.com/alextran" target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
          </div>
          <a className="to-top" href="#top">
            {t("top")}
          </a>
        </div>
      </div>
    </footer>
  );
}
