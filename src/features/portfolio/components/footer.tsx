import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="pt-8 pb-[60px] max-w-[1100px] mx-auto px-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-[0.86rem] text-fg-muted font-mono">© 2026 Alex Tran — {t("built")}</p>
        <div className="flex items-center gap-5">
          <div className="flex gap-2.5">
            <a
              className="w-[34px] h-[34px] rounded-full border border-line flex items-center justify-center font-mono text-[0.78rem] text-fg-muted no-underline transition-[color,border-color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))]"
              href="https://github.com/alextran"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              GH
            </a>
            <a
              className="w-[34px] h-[34px] rounded-full border border-line flex items-center justify-center font-mono text-[0.78rem] text-fg-muted no-underline transition-[color,border-color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))]"
              href="https://linkedin.com/in/alextran"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              in
            </a>
            <a
              className="w-[34px] h-[34px] rounded-full border border-line flex items-center justify-center font-mono text-[0.78rem] text-fg-muted no-underline transition-[color,border-color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))]"
              href="https://facebook.com/alextran"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              f
            </a>
          </div>
          <a className="font-mono text-[0.86rem] text-fg-muted no-underline hover:text-fg" href="#top">
            {t("top")}
          </a>
        </div>
      </div>
    </footer>
  );
}
