"use client";

import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "@/features/portfolio/components/theme-toggle";
import { LocaleSwitcher } from "@/features/portfolio/components/locale-switcher";
import { useScrollSpy } from "@/features/portfolio/hooks/use-scroll-spy";
import { navSectionIds } from "@/features/portfolio/constants/nav-sections";
import { availabilityColors, currentAvailability } from "@/features/portfolio/constants/availability-status";
import { Link, usePathname } from "@/i18n/navigation";

const AVAILABILITY_LABEL_KEYS = {
  open: "availabilityOpen",
  limited: "availabilityLimited",
  unavailable: "availabilityUnavailable",
} as const;

const CHIP_BUTTON_CLASSNAME =
  "font-mono text-[0.82rem] tracking-[0.04em] uppercase bg-bg-raised border border-line text-fg-muted rounded-full py-[7px] px-3 flex items-center gap-1.5 transition-[border-color,color] duration-150 ease-[ease] hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] cursor-pointer";

export function Nav() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy(navSectionIds, "header");
  const pathname = usePathname();
  const availabilityLabel = tA11y(AVAILABILITY_LABEL_KEYS[currentAvailability]);
  const dotStyle = { "--dot-color": availabilityColors[currentAvailability] } as CSSProperties;
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
    <header className="sticky top-0 z-40 border-b border-line backdrop-blur-[7px] backdrop-saturate-[140%] bg-[color-mix(in_srgb,var(--color-bg)_78%,transparent)]">
      <div className="flex items-center justify-between py-3.5 px-6 max-w-[1100px] mx-auto">
        {isHomePage ? (
          <a className="font-mono font-semibold text-[0.95rem] tracking-[0.02em] flex items-center gap-2 no-underline" href="#top">
            <span className="w-2 h-2 rounded-full bg-[var(--dot-color,var(--color-accent))] shadow-[0_0_0_4px_color-mix(in_srgb,var(--dot-color,var(--color-accent))_22%,transparent)]" style={dotStyle} title={availabilityLabel} role="img" aria-label={availabilityLabel} />
            <span title="NGUYỄN THANH HÀ HUY">NTTHUY</span>
          </a>
        ) : (
          <Link className="font-mono font-semibold text-[0.95rem] tracking-[0.02em] flex items-center gap-2 no-underline" href="/#top">
            <span className="w-2 h-2 rounded-full bg-[var(--dot-color,var(--color-accent))] shadow-[0_0_0_4px_color-mix(in_srgb,var(--dot-color,var(--color-accent))_22%,transparent)]" style={dotStyle} title={availabilityLabel} role="img" aria-label={availabilityLabel} />
            <span title="NGUYỄN THANH HÀ HUY">NTTHUY</span>
          </Link>
        )}
        <nav aria-label={tA11y("primaryNav")}>
          <ul
            className={cn(
              "flex items-center gap-7 list-none m-0 p-0 max-[760px]:hidden",
              isMenuOpen &&
                "max-[760px]:flex max-[760px]:absolute max-[760px]:top-full max-[760px]:left-0 max-[760px]:right-0 max-[760px]:flex-col max-[760px]:bg-bg-raised max-[760px]:border-b max-[760px]:border-line max-[760px]:py-4 max-[760px]:px-6 max-[760px]:gap-4"
            )}
            id="navLinks"
          >
            {navSectionIds.map((id) => (
              <li key={id}>
                {isHomePage ? (
                  <a
                    href={`#${id}`}
                    className={cn(
                      "relative py-1 px-0.5 text-[0.88rem] font-semibold no-underline text-fg-muted after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-accent after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:text-fg hover:after:scale-x-100 focus-visible:text-fg focus-visible:after:scale-x-100",
                      activeId === id && "text-fg after:scale-x-100"
                    )}
                    onClick={handleCloseMenu}
                  >
                    {t(id)}
                  </a>
                ) : (
                  <Link
                    href={`/#${id}`}
                    className={cn(
                      "relative py-1 px-0.5 text-[0.88rem] font-semibold no-underline text-fg-muted after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-accent after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:text-fg hover:after:scale-x-100 focus-visible:text-fg focus-visible:after:scale-x-100",
                      activeId === id && "text-fg after:scale-x-100"
                    )}
                    onClick={handleCloseMenu}
                  >
                    {t(id)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2.5">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className={cn(CHIP_BUTTON_CLASSNAME, "hidden max-[760px]:inline-flex")}
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
