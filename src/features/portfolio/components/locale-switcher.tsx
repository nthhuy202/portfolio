"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

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
      className="chip-btn"
      aria-label={locale === "en" ? t("switchToVietnamese") : t("switchToEnglish")}
      onClick={handleSwitchLocale}
    >
      {locale.toUpperCase()}
    </button>
  );
}
