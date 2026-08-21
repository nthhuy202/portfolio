"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconSun } from "@/components/icons/icon-sun";
import { IconMoon } from "@/components/icons/icon-moon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDark = isMounted && resolvedTheme === "dark";

  function handleToggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button type="button" className="chip-btn" aria-pressed={isDark} aria-label="Toggle dark mode" onClick={handleToggleTheme}>
      {isMounted ? (
        isDark ? <IconMoon className="theme-icon" /> : <IconSun className="theme-icon" />
      ) : (
        <span className="theme-icon" aria-hidden="true" />
      )}
    </button>
  );
}
