"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const CHIP_BUTTON_CLASSNAME =
  "font-mono text-[0.82rem] tracking-[0.04em] uppercase bg-bg-raised border border-line text-fg-muted rounded-full py-[0.4375rem] px-3 flex items-center gap-1.5 transition-[border-color,color] duration-150 ease-[ease] hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] cursor-pointer";

export function LocaleSwitcher() {
  const t = useTranslations("a11y");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "en" ? "vi" : "en";

  function handleSwitchLocale() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      type="button"
      className={CHIP_BUTTON_CLASSNAME}
      aria-label={locale === "en" ? t("switchToVietnamese") : t("switchToEnglish")}
      onClick={handleSwitchLocale}
    >
      {locale.toUpperCase()}
    </button>
  );
}
