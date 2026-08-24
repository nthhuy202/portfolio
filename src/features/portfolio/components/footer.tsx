import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="pt-8 pb-[3.75rem] max-w-[68.75rem] mx-auto px-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-[0.86rem] text-fg-muted font-mono">
          © 2026 Nguyễn Thanh Hà Huy
        </p>
        <a
          className="font-mono text-[0.86rem] text-fg-muted no-underline hover:text-accent"
          href="#top"
        >
          {t("top")}
        </a>
      </div>
    </footer>
  );
}
