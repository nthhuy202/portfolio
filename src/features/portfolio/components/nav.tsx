"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/features/portfolio/components/theme-toggle";
import { LocaleSwitcher } from "@/features/portfolio/components/locale-switcher";
import { useScrollSpy } from "@/features/portfolio/hooks/use-scroll-spy";

const SECTION_IDS = ["about", "projects", "experience", "contact"];

export function Nav() {
  const t = useTranslations("nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS, "header.nav");

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function handleToggleMenu() {
    setIsMenuOpen((value) => !value);
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="mark" href="#top">
          <span className="dot" />
          <span>alex.dev</span>
        </a>
        <nav aria-label="Primary">
          <ul className={cn("nav-links", isMenuOpen && "open")} id="navLinks">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={cn(activeId === id && "active")} onClick={handleCloseMenu}>
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-controls">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="chip-btn hamburger"
            aria-expanded={isMenuOpen}
            aria-controls="navLinks"
            aria-label="Toggle menu"
            onClick={handleToggleMenu}
          >
            ≡
          </button>
        </div>
      </div>
    </header>
  );
}
