"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/features/portfolio/components/theme-toggle";
import { LocaleSwitcher } from "@/features/portfolio/components/locale-switcher";
import { useScrollSpy } from "@/features/portfolio/hooks/use-scroll-spy";
import { navSectionIds } from "@/features/portfolio/constants/nav-sections";
import { Link, usePathname } from "@/i18n/navigation";

export function Nav() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy(navSectionIds, "header.nav");
  const pathname = usePathname();
  // Nav is reused on the case-study pages, which have no `id="about"` etc. sections
  // of their own — off the home page, these must route back to "/#id" via next-intl's
  // Link instead of a same-page hash anchor (same pattern the case-study page's own
  // "back to projects" link already uses).
  const isHomePage = pathname === "/";

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function handleToggleMenu() {
    setIsMenuOpen((value) => !value);
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        {isHomePage ? (
          <a className="mark" href="#top">
            <span className="dot" />
            <span>alex.dev</span>
          </a>
        ) : (
          <Link className="mark" href="/#top">
            <span className="dot" />
            <span>alex.dev</span>
          </Link>
        )}
        <nav aria-label={tA11y("primaryNav")}>
          <ul className={cn("nav-links", isMenuOpen && "open")} id="navLinks">
            {navSectionIds.map((id) => (
              <li key={id}>
                {isHomePage ? (
                  <a href={`#${id}`} className={cn(activeId === id && "active")} onClick={handleCloseMenu}>
                    {t(id)}
                  </a>
                ) : (
                  <Link href={`/#${id}`} className={cn(activeId === id && "active")} onClick={handleCloseMenu}>
                    {t(id)}
                  </Link>
                )}
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
            aria-label={tA11y("toggleMenu")}
            onClick={handleToggleMenu}
          >
            ≡
          </button>
        </div>
      </div>
    </header>
  );
}
