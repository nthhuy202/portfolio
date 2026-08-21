"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
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
      aria-label={locale === "en" ? "Switch to Vietnamese" : "Switch to English"}
      onClick={handleSwitchLocale}
    >
      {locale.toUpperCase()}
    </button>
  );
}
