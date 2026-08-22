"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { IconSun } from "@/components/icons/icon-sun";
import { IconMoon } from "@/components/icons/icon-moon";

const CHIP_BUTTON_CLASSNAME =
  "font-mono text-[0.82rem] tracking-[0.04em] uppercase bg-bg-raised border border-line text-fg-muted rounded-full py-[7px] px-3 flex items-center gap-1.5 transition-[border-color,color] duration-150 ease-[ease] hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] cursor-pointer";

export function ThemeToggle() {
  const t = useTranslations("a11y");
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDark = isMounted && resolvedTheme === "dark";

  function handleToggleTheme() {
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.startViewTransition(() => setTheme(nextTheme));
  }

  return (
    <button type="button" className={CHIP_BUTTON_CLASSNAME} aria-pressed={isDark} aria-label={t("toggleDarkMode")} onClick={handleToggleTheme}>
      {isMounted ? (
        isDark ? <IconMoon className="w-3.5 h-3.5" /> : <IconSun className="w-3.5 h-3.5" />
      ) : (
        <span className="w-3.5 h-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
