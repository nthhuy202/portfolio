# Tailwind v4 Styling Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this portfolio's ~1034-line hand-written `globals.css` class system (`.btn`, `.card`, `.nav-links`, ...) with Tailwind v4 utility classes applied directly in JSX, across all 17 feature component/page files plus the root locale layout, while producing pixel-identical output (light and dark).

**Architecture:** Design tokens (color, font) move into a Tailwind `@theme` block; the existing light/dark mechanism (CSS custom property redefinition via `prefers-color-scheme` + `[data-theme]`, driven by `next-themes`) is untouched — only the token *definitions* move, so `bg-bg`/`text-fg`-style utilities keep resolving correctly per theme with zero changes to `theme-toggle.tsx`/`theme-provider.tsx`. Everything expressible as utility classes (layout, spacing, color, simple hover/focus, `group`-based hover-child effects, pseudo-elements via `after:`) moves into JSX. Three things stay as named classes in `@layer components` because they cannot be utility-expressed without becoming unreadable or are literally unreachable from JSX: the blob background's 4 keyframe animations, the marquee's mask-image + infinite-scroll animation, and the case-study body's `h2`/`p` styling (that content is raw MDX output — `{content}` from `next-mdx-remote-client`'s `evaluate()` — so there is no JSX element to attach a className to).

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/postcss`, already installed), `tailwind-merge` (new dependency), `clsx` (existing), `next-themes` (existing, unchanged).

**Spec:** `docs/superpowers/specs/2026-08-22-tailwind-v4-migration-design.md`

## Global Constraints

- **Visual parity, not a redesign** — every converted value must match the original pixel-for-pixel. Where Tailwind's default scale doesn't land exactly on the original value, use an arbitrary value (`text-[0.86rem]`, `mt-[22px]`) rather than rounding to the nearest scale step.
- **Breakpoints stay at their original px values** (760px nav/tech-grid, 720px project-grid, 600px hero-ctas/hero-stats/tl-item) via Tailwind's arbitrary breakpoint syntax (`max-[760px]:`, `max-[600px]:`), not the default `sm:`/`md:`/`lg:` scale — those default breakpoints (640/768/1024) don't match and would shift the responsive behavior.
- **`@theme` token names**: every renamed CSS variable used in `color-mix()`/arbitrary values elsewhere in this plan must use the new `--color-*` name (e.g. `var(--color-accent)`, not `var(--accent)`). `--radius`, `--shadow`, `--blob-opacity`, `--blob-blend`, `--line-dark`, `--line-light` keep their existing (non-`@theme`) names — they're either theme-switching internals or used in exactly one place via an arbitrary value, not general-purpose utility scales.
- **`@layer components` has exactly three residents** (see Architecture above: blob block, marquee block, case-study-body MDX block) — do not add a fourth without going back to the spec. If a task below looks like it needs a new named class, re-check for a `group`/`after:`/arbitrary-value way first.
- **No `Button` component, no icon library, no new UI component** — per `CLAUDE.md`'s existing (unaffected-by-this-migration) conventions. Raw `<button>`/`<a>` with utility classNames throughout.
- **`cn()` becomes `twMerge(clsx(inputs))`** (Task 1) — use it (not raw template strings / `.join`) for every conditional className in every task below, per `CLAUDE.md`'s className rules.
- **Verification is visual, not automated** — there is no styling test suite (spec's Testing section). Each task's last code step is `npm run dev` + a specific visual checklist (light mode, dark mode via the toggle, and the task's responsive breakpoint(s) via browser devtools width). Do not mark a task done without actually looking at the rendered page.
- **Scope addition beyond the spec**: `src/app/[locale]/layout.tsx` uses the `.wrap` class (`position: relative; z-index: 1`, stacking page content above the fixed blob background) — the spec's file list missed this file since it lives outside `src/features/portfolio/`. It's folded into Task 3 below.

---

### Task 1: `globals.css` rewrite + `cn()` + `tailwind-merge`

**Files:**
- Modify: `src/app/globals.css` (full rewrite)
- Modify: `src/utils/cn.ts`
- Modify: `package.json` (add `tailwind-merge` dependency)

**Interfaces:**
- Produces: `@theme` color tokens (`--color-ink`, `--color-ink-raised`, `--color-ink-raised-2`, `--color-paper`, `--color-paper-raised`, `--color-paper-raised-2`, `--color-accent`, `--color-accent-2`, `--color-blob-1..4`, `--color-bg`, `--color-bg-raised`, `--color-bg-raised-2`, `--color-fg`, `--color-fg-muted`, `--color-line`) and font tokens (`--font-mono`, `--font-sans`) — every later task's utility classes (`bg-accent`, `text-fg-muted`, `border-line`, `font-mono`, etc.) depend on these existing under these exact names. Also produces the `@layer components` classes `.atmosphere`, `.blob`, `.blob-a`, `.blob-b`, `.blob-c`, `.blob-d`, `.marquee`, `.marquee-track`, `.case-study-body h2`/`h2:first-child`/`p` — later tasks apply these class names verbatim (unchanged from today) alongside new utility classes. Also produces `cn(...inputs: ClassValue[]): string` now merging Tailwind conflicts via `tailwind-merge` — every later task's `cn()` calls rely on this behavior.

- [ ] **Step 1: Add `tailwind-merge` to `package.json`**

In `package.json`, add to `"dependencies"` (alphabetical, next to `clsx`):

```json
    "clsx": "^2.1.1",
    "framer-motion": "^11.15.0",
    "gray-matter": "^4.0.3",
    "next": "^15.1.0",
    "next-intl": "^3.26.0",
    "next-mdx-remote-client": "^2.1.12",
    "next-themes": "^0.4.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwind-merge": "^2.6.0",
```

Run: `npm install`
Expected: `tailwind-merge` appears in `node_modules` and `package-lock.json` updates with no errors.

- [ ] **Step 2: Update `cn()` to merge with `tailwind-merge`**

Replace `src/utils/cn.ts` entirely:

```ts
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Rewrite `src/app/globals.css`**

Replace the entire file:

```css
@import "tailwindcss";

@theme {
  --color-ink: #0a0d12;
  --color-ink-raised: #11161d;
  --color-ink-raised-2: #161c25;
  --color-paper: #eef0ec;
  --color-paper-raised: #ffffff;
  --color-paper-raised-2: #e4e6e0;
  --color-accent: #ff7a45;
  --color-accent-2: #49d8c4;
  --color-blob-1: #6a5cff;
  --color-blob-2: #ff4f9a;
  --color-blob-3: #1fb8d4;
  --color-blob-4: #4361ff;

  --color-bg: var(--color-paper);
  --color-bg-raised: var(--color-paper-raised);
  --color-bg-raised-2: var(--color-paper-raised-2);
  --color-fg: #12151a;
  --color-fg-muted: #5b6169;
  --color-line: var(--line-light);

  --font-mono: ui-monospace, "Cascadia Code", "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

:root {
  --line-dark: rgba(240, 240, 235, 0.1);
  --line-light: rgba(10, 13, 18, 0.11);
  --shadow: 0 1px 2px rgba(10, 13, 18, 0.06), 0 8px 24px -12px rgba(10, 13, 18, 0.18);
  --radius: 3px;
  --blob-opacity: 0.5;
  --blob-blend: multiply;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: var(--color-ink);
    --color-bg-raised: var(--color-ink-raised);
    --color-bg-raised-2: var(--color-ink-raised-2);
    --color-fg: #eef0f2;
    --color-fg-muted: #8b93a0;
    --color-line: var(--line-dark);
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 20px 40px -20px rgba(0, 0, 0, 0.6);
    --blob-opacity: 0.55;
    --blob-blend: screen;
  }
}

:root[data-theme="dark"] {
  --color-bg: var(--color-ink);
  --color-bg-raised: var(--color-ink-raised);
  --color-bg-raised-2: var(--color-ink-raised-2);
  --color-fg: #eef0f2;
  --color-fg-muted: #8b93a0;
  --color-line: var(--line-dark);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 20px 40px -20px rgba(0, 0, 0, 0.6);
  --blob-opacity: 0.55;
  --blob-blend: screen;
}

:root[data-theme="light"] {
  --color-bg: var(--color-paper);
  --color-bg-raised: var(--color-paper-raised);
  --color-bg-raised-2: var(--color-paper-raised-2);
  --color-fg: #12151a;
  --color-fg-muted: #5b6169;
  --color-line: var(--line-light);
  --shadow: 0 1px 2px rgba(10, 13, 18, 0.06), 0 8px 24px -12px rgba(10, 13, 18, 0.18);
  --blob-opacity: 0.5;
  --blob-blend: multiply;
}

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }

  body {
    margin: 0;
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection {
    background: var(--color-accent);
    color: #fff;
  }

  a {
    color: inherit;
  }

  img, svg {
    display: block;
    max-width: 100%;
  }

  h1, h2, h3 {
    text-wrap: balance;
    margin: 0;
    font-family: var(--font-sans);
  }

  p {
    margin: 0;
  }

  button {
    font-family: inherit;
  }

  a:focus-visible,
  button:focus-visible,
  [tabindex]:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

@layer components {
  .atmosphere {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: var(--blob-opacity);
    mix-blend-mode: var(--blob-blend);
    will-change: transform;
  }

  .blob-a {
    width: 46vw;
    height: 46vw;
    left: -8vw;
    top: -16vw;
    background: var(--color-blob-1);
    animation: driftA 11s ease-in-out infinite alternate;
  }

  .blob-b {
    width: 40vw;
    height: 40vw;
    right: -10vw;
    top: 10vw;
    background: var(--color-blob-2);
    animation: driftB 13s ease-in-out infinite alternate;
  }

  .blob-c {
    width: 32vw;
    height: 32vw;
    left: 22vw;
    bottom: -16vw;
    background: var(--color-blob-3);
    opacity: calc(var(--blob-opacity) * 0.75);
    animation: driftC 15s ease-in-out infinite alternate;
  }

  .blob-d {
    width: 30vw;
    height: 30vw;
    right: 12vw;
    bottom: -10vw;
    background: var(--color-blob-4);
    opacity: calc(var(--blob-opacity) * 0.7);
    animation: driftD 17s ease-in-out infinite alternate;
  }

  .marquee {
    margin-top: 26px;
    overflow: hidden;
    width: 100%;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 28s linear infinite;
  }

  .case-study-body h2 {
    color: var(--color-fg);
    font-size: 1.2rem;
    font-weight: 700;
    margin: 32px 0 10px;
  }

  .case-study-body h2:first-child {
    margin-top: 0;
  }

  .case-study-body p {
    margin-bottom: 16px;
  }
}

@keyframes driftA {
  0% { transform: translate(-4vw, -4vw) scale(1); }
  100% { transform: translate(28vw, 16vw) scale(1.18); }
}

@keyframes driftB {
  0% { transform: translate(4vw, 2vw) scale(1); }
  100% { transform: translate(-26vw, -8vw) scale(0.9); }
}

@keyframes driftC {
  0% { transform: translate(0, 8vw) scale(1); }
  100% { transform: translate(16vw, -16vw) scale(1.12); }
}

@keyframes driftD {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-18vw, -14vw) scale(1.15); }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .blob-a, .blob-b, .blob-c, .blob-d {
    animation: none;
  }

  .marquee-track {
    animation: none;
  }

  .marquee {
    overflow-x: auto;
  }
}
```

- [ ] **Step 4: Verify the build doesn't crash**

Run: `npm run build`
Expected: build fails or shows visually broken pages at this point — that's expected, since no component has been converted yet and every custom class (`.shell`, `.btn`, `.nav`...) referenced by JSX no longer exists in the CSS. What must NOT happen: a Tailwind/PostCSS compile error (invalid `@theme` syntax, bad CSS). If the build reports a CSS syntax error, fix it before continuing; a broken *layout* is fine and expected until Task 2+ land.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/utils/cn.ts package.json package-lock.json
git commit -m "refactor: rewrite globals.css around Tailwind v4 @theme tokens, add tailwind-merge"
```

---

### Task 2: Nav chrome — `nav.tsx`, `theme-toggle.tsx`, `locale-switcher.tsx`

**Files:**
- Modify: `src/features/portfolio/components/nav.tsx`
- Modify: `src/features/portfolio/components/theme-toggle.tsx`
- Modify: `src/features/portfolio/components/locale-switcher.tsx`

**Interfaces:**
- Consumes: `cn()` from `src/utils/cn.ts` (Task 1), `@theme` tokens (Task 1).
- Produces: no exports consumed by later tasks (leaf UI). The repeated "chip button" utility string (`font-mono text-[0.82rem] tracking-[0.04em] uppercase bg-bg-raised border border-line text-fg-muted rounded-full py-[7px] px-3 flex items-center gap-1.5 transition-[border-color,color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] cursor-pointer`) is intentionally repeated verbatim in all three files rather than extracted — it's presentation, not logic, and CLAUDE.md's DRY rule targets repeated logic, not repeated utility-class strings (standard Tailwind practice).

- [ ] **Step 1: Rewrite `nav.tsx`**

Replace `src/features/portfolio/components/nav.tsx` in full:

```tsx
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
  "font-mono text-[0.82rem] tracking-[0.04em] uppercase bg-bg-raised border border-line text-fg-muted rounded-full py-[7px] px-3 flex items-center gap-1.5 transition-[border-color,color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] cursor-pointer";

export function Nav() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy(navSectionIds, "header.nav");
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
            <span>NTHHUY</span>
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
```

- [ ] **Step 2: Rewrite `theme-toggle.tsx`**

Replace `src/features/portfolio/components/theme-toggle.tsx` in full:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { IconSun } from "@/components/icons/icon-sun";
import { IconMoon } from "@/components/icons/icon-moon";

const CHIP_BUTTON_CLASSNAME =
  "font-mono text-[0.82rem] tracking-[0.04em] uppercase bg-bg-raised border border-line text-fg-muted rounded-full py-[7px] px-3 flex items-center gap-1.5 transition-[border-color,color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] cursor-pointer";

export function ThemeToggle() {
  const t = useTranslations("a11y");
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
    <button type="button" className={CHIP_BUTTON_CLASSNAME} aria-pressed={isDark} aria-label={t("toggleDarkMode")} onClick={handleToggleTheme}>
      {isMounted ? (
        isDark ? <IconMoon className="w-3.5 h-3.5" /> : <IconSun className="w-3.5 h-3.5" />
      ) : (
        <span className="w-3.5 h-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
```

- [ ] **Step 3: Rewrite `locale-switcher.tsx`**

Replace `src/features/portfolio/components/locale-switcher.tsx` in full:

```tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const CHIP_BUTTON_CLASSNAME =
  "font-mono text-[0.82rem] tracking-[0.04em] uppercase bg-bg-raised border border-line text-fg-muted rounded-full py-[7px] px-3 flex items-center gap-1.5 transition-[border-color,color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] cursor-pointer";

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
```

- [ ] **Step 4: Visual check**

Run: `npm run dev`, open the home page.
Checklist: nav is sticky with blur on scroll; logo dot shows the availability color with a soft ring; nav links underline-slide in on hover and stay underlined for the active section while scrolling; theme toggle and locale switcher render as pill buttons and both work; at browser width ≤760px, nav links disappear and the hamburger appears, clicking it drops down a full-width menu; toggle dark mode and confirm the header background/border/text all switch correctly.

- [ ] **Step 5: Commit**

```bash
git add src/features/portfolio/components/nav.tsx src/features/portfolio/components/theme-toggle.tsx src/features/portfolio/components/locale-switcher.tsx
git commit -m "refactor: convert nav chrome to Tailwind utility classes"
```

---

### Task 3: `hero.tsx`, `animated-background.tsx`, `layout.tsx` (`.wrap` fix)

**Files:**
- Modify: `src/features/portfolio/components/hero.tsx`
- Modify: `src/features/portfolio/components/animated-background.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- No change needed: `src/features/portfolio/components/reveal.tsx` (only ever forwards a `className` prop it's given — no hardcoded classNames to migrate; confirm this by reading the file, do not edit it)

**Interfaces:**
- Consumes: `.atmosphere`/`.blob`/`.blob-a..d` classes from `@layer components` (Task 1).
- Produces: none consumed by later tasks.

- [ ] **Step 1: Rewrite `animated-background.tsx`**

Replace `src/features/portfolio/components/animated-background.tsx` in full:

```tsx
export function AnimatedBackground() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />
      <div className="blob blob-d" />
    </div>
  );
}
```

(Unchanged — `.atmosphere`/`.blob*` remain named `@layer components` classes per the spec's approved exception.)

- [ ] **Step 2: Fix `.wrap` in `layout.tsx`**

In `src/app/[locale]/layout.tsx`, change:

```tsx
            <AnimatedBackground />
            <div className="wrap">{children}</div>
```

to:

```tsx
            <AnimatedBackground />
            <div className="relative z-[1]">{children}</div>
```

- [ ] **Step 3: Rewrite `hero.tsx`**

Replace `src/features/portfolio/components/hero.tsx` in full:

```tsx
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="pt-[120px] pb-[110px] border-b border-line relative max-w-[1100px] mx-auto px-6">
      <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
      <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold tracking-[-0.03em] leading-[1.05] mt-[18px]">
        {t("hi")} <span className="text-accent">Alex Tran</span>.<br />
        {t("role")}
      </h1>
      <p className="mt-[22px] max-w-[58ch] text-[1.06rem] leading-[1.7] text-fg-muted">{t("pitch")}</p>
      <div className="flex gap-3.5 mt-[34px] flex-wrap max-[600px]:flex-nowrap">
        <a
          className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-5 rounded-(--radius) border border-transparent transition-[transform,background,border-color] duration-150 ease cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)] max-[600px]:flex-1"
          href="#projects"
        >
          {t("ctaProjects")}
        </a>
        <a
          className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-5 rounded-(--radius) border border-line transition-[transform,background,border-color] duration-150 ease cursor-pointer no-underline bg-transparent text-fg hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] max-[600px]:flex-1"
          href="#contact"
        >
          {t("ctaContact")}
        </a>
      </div>
      <div className="flex gap-9 mt-14 flex-wrap max-[600px]:flex-nowrap max-[600px]:justify-between max-[600px]:gap-2.5">
        <div className="max-[600px]:flex-1 max-[600px]:text-center">
          <div className="font-mono text-2xl font-semibold text-fg">6+</div>
          <div className="text-[0.86rem] text-fg-muted mt-1">{t("statYears")}</div>
        </div>
        <div className="max-[600px]:flex-1 max-[600px]:text-center">
          <div className="font-mono text-2xl font-semibold text-fg">24</div>
          <div className="text-[0.86rem] text-fg-muted mt-1">{t("statProjects")}</div>
        </div>
        <div className="max-[600px]:flex-1 max-[600px]:text-center">
          <div className="font-mono text-2xl font-semibold text-fg">3</div>
          <div className="text-[0.86rem] text-fg-muted mt-1">{t("statTeams")}</div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Visual check**

Run: `npm run dev`.
Checklist: hero fills with the same top/bottom spacing as before; heading scales fluidly on resize; both CTA buttons show the same hover lift + color; at width ≤600px the two CTA buttons become equal-width side by side (not wrapped) and the three stats spread edge-to-edge instead of wrapping; the blob background still drifts behind everything and sits behind the hero content (not covering it) in both themes.

- [ ] **Step 5: Commit**

```bash
git add src/features/portfolio/components/hero.tsx src/features/portfolio/components/animated-background.tsx "src/app/[locale]/layout.tsx"
git commit -m "refactor: convert hero and page-background chrome to Tailwind utility classes"
```

---

### Task 4: `about.tsx`, `tech-stack.tsx`

**Files:**
- Modify: `src/features/portfolio/components/about.tsx`
- Modify: `src/features/portfolio/components/tech-stack.tsx`

**Interfaces:**
- Consumes: none new.
- Produces: none consumed by later tasks.

- [ ] **Step 1: Rewrite `about.tsx`**

Replace `src/features/portfolio/components/about.tsx` in full:

```tsx
import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { TechStack } from "@/features/portfolio/components/tech-stack";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 border-b border-line relative max-w-[1100px] mx-auto px-6">
      <Reveal className="mb-11 max-w-[640px]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal className="max-w-[68ch]">
        <p className="text-fg-muted text-base leading-[1.65] mt-3.5 max-w-[56ch]">{t("p1")}</p>
        <p className="text-fg-muted text-base leading-[1.65] mt-4 max-w-[56ch]">{t("p2")}</p>
      </Reveal>
      <Reveal className="mt-10">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("stackLabel")}</p>
        <TechStack />
      </Reveal>
    </section>
  );
}
```

(The second `p1`/`p2` paragraph's old `style={{ marginTop: 16 }}` inline override is now expressed directly as `mt-4` — no inline style needed.)

- [ ] **Step 2: Rewrite `tech-stack.tsx`**

Replace `src/features/portfolio/components/tech-stack.tsx` in full:

```tsx
import { techStack } from "@/features/portfolio/constants/tech-stack";

export function TechStack() {
  return (
    <div className="grid grid-cols-4 gap-3 mt-4 max-[760px]:grid-cols-2">
      {techStack.map((tech) => (
        <div className="flex items-center gap-2.5 py-3 px-3.5 border border-line rounded-lg bg-bg-raised" key={tech.name}>
          <span className="w-8 h-8 rounded-[7px] flex-none flex items-center justify-center font-mono font-bold text-[0.74rem]" style={{ background: tech.bg, color: tech.fg }}>
            {tech.short}
          </span>
          <span className="font-mono text-[0.86rem] tracking-[0.02em] uppercase">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`.
Checklist: About section spacing (heading, two paragraphs, tech grid) matches original; tech badge grid shows 4 columns, dropping to 2 columns at width ≤760px; each badge's colored glyph square still uses its own per-tech inline background/foreground color unaffected by the migration.

- [ ] **Step 4: Commit**

```bash
git add src/features/portfolio/components/about.tsx src/features/portfolio/components/tech-stack.tsx
git commit -m "refactor: convert about and tech-stack sections to Tailwind utility classes"
```

---

### Task 5: `focus-marquee.tsx`

**Files:**
- Modify: `src/features/portfolio/components/focus-marquee.tsx`

**Interfaces:**
- Consumes: `.marquee`/`.marquee-track` classes from `@layer components` (Task 1).
- Produces: none consumed by later tasks.

- [ ] **Step 1: Rewrite `focus-marquee.tsx`**

Replace `src/features/portfolio/components/focus-marquee.tsx` in full:

```tsx
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { focusKeywords } from "@/features/portfolio/constants/keywords";
import { isSupportedLocale } from "@/i18n/routing";

export function FocusMarquee() {
  const t = useTranslations("focus");
  const rawLocale = useLocale();
  const locale = isSupportedLocale(rawLocale) ? rawLocale : "en";
  const words = focusKeywords[locale];
  const trackWords = [...words, ...words];

  return (
    <section id="focus" className="py-24 border-b border-line relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <Reveal className="mb-11 max-w-[640px]">
          <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
        </Reveal>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {trackWords.map((word, index) => (
            <span className="font-mono font-bold text-[clamp(1.6rem,4.4vw,2.7rem)] tracking-[-0.01em] text-fg-muted flex items-center gap-10 whitespace-nowrap pr-10" key={`${word}-${index}`}>
              {word} <span className="text-accent">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Visual check**

Run: `npm run dev`.
Checklist: focus-keyword strip still scrolls infinitely left with a soft fade at both edges (mask-image); reduced-motion OS setting still freezes the scroll and makes it horizontally scrollable instead (test via devtools "Emulate CSS prefers-reduced-motion: reduce").

- [ ] **Step 3: Commit**

```bash
git add src/features/portfolio/components/focus-marquee.tsx
git commit -m "refactor: convert focus-marquee section to Tailwind utility classes"
```

---

### Task 6: `projects.tsx`, `project-card.tsx`

**Files:**
- Modify: `src/features/portfolio/components/projects.tsx`
- Modify: `src/features/portfolio/components/project-card.tsx`

**Interfaces:**
- Consumes: `cn()` (Task 1).
- Produces: none consumed by later tasks.

- [ ] **Step 1: Rewrite `projects.tsx`**

Replace `src/features/portfolio/components/projects.tsx` in full:

```tsx
import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { ProjectCard } from "@/features/portfolio/components/project-card";
import type { ProjectMeta } from "@/features/portfolio/types/content";

interface ProjectsProps {
  projects: ProjectMeta[];
}

export function Projects({ projects }: ProjectsProps) {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="py-24 border-b border-line relative max-w-[1100px] mx-auto px-6">
      <Reveal className="mb-11 max-w-[640px]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
        <p className="text-fg-muted text-base leading-[1.65] mt-3.5 max-w-[56ch]">{t("lede")}</p>
      </Reveal>
      <div className="grid grid-cols-2 gap-6 max-[720px]:grid-cols-1">
        {projects.map((project) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `project-card.tsx`**

Replace `src/features/portfolio/components/project-card.tsx` in full:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import type { ProjectMeta } from "@/features/portfolio/types/content";

interface ProjectCardProps {
  project: ProjectMeta;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  const tA11y = useTranslations("a11y");

  return (
    <article className="group bg-bg-raised border border-line rounded-lg overflow-hidden flex flex-col transition-[transform,border-color,box-shadow] duration-200 ease shadow-[var(--shadow)] hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-accent)_45%,var(--color-line))]">
      <Link
        className="relative block w-full aspect-[16/10] border-none p-0 m-0 cursor-pointer bg-none overflow-hidden"
        href={`/projects/${project.slug}`}
        aria-label={`${t("viewCaseStudy")}: ${project.title}`}
      >
        <div
          className={cn(
            "w-full h-full transition-transform duration-[450ms] ease group-hover:scale-[1.06] group-focus-within:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100",
            project.hasPhoto
              ? "bg-[conic-gradient(from_210deg_at_40%_40%,var(--color-accent),var(--color-accent-2),var(--color-accent))]"
              : "bg-bg-raised-2 flex items-center justify-center p-[18px]"
          )}
          aria-hidden="true"
        >
          {!project.hasPhoto && (
            <span className="font-mono font-bold tracking-[0.01em] text-center text-fg-muted text-[clamp(1.1rem,3.4vw,1.6rem)] leading-[1.25]">{project.title}</span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 flex gap-1.5">
          {project.periods.map((period) => (
            <span className="font-mono text-[0.8rem] py-1 px-[9px] rounded-full bg-[rgba(8,10,14,0.65)] text-white backdrop-blur-[4px]" key={period}>
              {period}
            </span>
          ))}
        </div>
        <span className="absolute bottom-2.5 right-2.5 py-[7px] px-3.5 rounded-full font-mono text-[0.82rem] bg-[rgba(8,10,14,0.72)] text-white opacity-0 translate-y-2 transition-[opacity,transform,background-color,color] duration-[220ms] ease backdrop-blur-[4px] motion-reduce:transition-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-accent group-hover:text-[#1a0a02] group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:bg-accent group-focus-within:text-[#1a0a02]">
          {t("viewCaseStudy")} →
        </span>
      </Link>
      <div className="pt-5 px-[22px] pb-[22px] flex flex-col gap-3 flex-1">
        <h3 className="text-[1.12rem] font-bold transition-colors duration-200 ease group-hover:text-accent group-focus-within:text-accent">{project.title}</h3>
        <p className="text-fg-muted text-[0.9rem] leading-[1.6] line-clamp-3">{project.summary}</p>
        <div className="flex flex-wrap gap-[7px]">
          {project.tech.map((tech) => (
            <span className="font-mono text-[0.8rem] py-[5px] px-[11px] rounded-full border border-line text-accent-2 bg-bg-raised-2" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-1.5 flex items-center justify-between gap-3">
          <span className="text-[0.86rem] text-fg-muted flex items-center gap-1.5">
            {project.country.flag} {project.country.name}
          </span>
          {project.githubUrl && (
            <a
              className="w-[30px] h-[30px] rounded-full border border-line flex-none flex items-center justify-center font-mono text-[0.74rem] text-fg-muted no-underline transition-[color,border-color] duration-150 ease hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))]"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={tA11y("viewSourceOnGithub")}
            >
              GH
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`.
Checklist: project grid shows 2 columns, 1 column at width ≤720px; hovering/focusing a card lifts it, brightens its border, scales the image, and reveals the "view case study" badge — all together (this is the `group`-based conversion of the old `.card:hover .x` selectors, verify none of the child effects are missing); cards without a photo show the conic-gradient fallback text; description text clamps to 3 lines even with a long summary.

- [ ] **Step 4: Commit**

```bash
git add src/features/portfolio/components/projects.tsx src/features/portfolio/components/project-card.tsx
git commit -m "refactor: convert projects grid and project card to Tailwind utility classes"
```

---

### Task 7: `experience.tsx`

**Files:**
- Modify: `src/features/portfolio/components/experience.tsx`

**Interfaces:**
- Consumes: none new.
- Produces: none consumed by later tasks.

- [ ] **Step 1: Rewrite `experience.tsx`**

Replace `src/features/portfolio/components/experience.tsx` in full:

```tsx
import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import type { ExperienceEntry } from "@/features/portfolio/types/content";

interface ExperienceProps {
  entries: ExperienceEntry[];
}

export function Experience({ entries }: ExperienceProps) {
  const t = useTranslations("experience");

  return (
    <section id="experience" className="py-24 border-b border-line relative max-w-[1100px] mx-auto px-6">
      <Reveal className="mb-11 max-w-[640px]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal className="flex flex-col">
        {entries.map((entry) => (
          <div className="grid grid-cols-[130px_1fr] gap-6 py-[26px] border-t border-line max-[600px]:grid-cols-1 max-[600px]:gap-1.5" key={`${entry.company}-${entry.period}`}>
            <div className="font-mono text-[0.86rem] text-fg-muted pt-[3px]">{entry.period}</div>
            <div>
              <div className="text-[1.05rem] font-bold">{entry.role}</div>
              <div className="text-accent text-[0.9rem] mt-0.5">{entry.company}</div>
              <ul className="mt-3 pl-[18px] text-fg-muted text-[0.9rem] leading-[1.7]">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Visual check**

Run: `npm run dev`.
Checklist: timeline entries show a 130px period column beside the role/company/bullets column, each row separated by a top border; at width ≤600px, the layout stacks to a single column with tighter spacing.

- [ ] **Step 3: Commit**

```bash
git add src/features/portfolio/components/experience.tsx
git commit -m "refactor: convert experience timeline to Tailwind utility classes"
```

---

### Task 8: `contact.tsx`, `footer.tsx`

**Files:**
- Modify: `src/features/portfolio/components/contact.tsx`
- Modify: `src/features/portfolio/components/footer.tsx`

**Interfaces:**
- Consumes: none new.
- Produces: none consumed by later tasks.

- [ ] **Step 1: Rewrite `contact.tsx`**

Replace `src/features/portfolio/components/contact.tsx` in full:

```tsx
import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 relative max-w-[1100px] mx-auto px-6">
      <Reveal className="mb-11 max-w-[640px]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal className="bg-bg-raised border border-line rounded-lg p-11 flex flex-col items-start gap-[26px]">
        <p className="text-fg-muted text-base leading-[1.65] max-w-none w-full m-0">{t("blurb")}</p>
        <div className="flex gap-4 flex-wrap">
          <a
            className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-5 rounded-(--radius) border border-transparent transition-[transform,background,border-color] duration-150 ease cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)]"
            href="mailto:alex.tran@example.com"
          >
            alex.tran@example.com
          </a>
        </div>
      </Reveal>
    </section>
  );
}
```

(The old `style={{ borderBottom: "none" }}` override is gone — this section simply never gets a `border-b` utility, since it was the site's designated last bordered section. `.section-head`'s h2 typography class string is repeated verbatim across About/FocusMarquee/Projects/Experience/Contact — same DRY reasoning as the chip-button string in Task 2: it's a Tailwind utility composition, not logic.)

- [ ] **Step 2: Rewrite `footer.tsx`**

Replace `src/features/portfolio/components/footer.tsx` in full:

```tsx
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
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`.
Checklist: Contact section has no bottom border (it's the last bordered section); the mailto CTA button matches the hero's primary button styling; footer shows copyright text left, social icons + "back to top" link right, wrapping on narrow widths; all three circular social icons and "back to top" change color on hover.

- [ ] **Step 4: Commit**

```bash
git add src/features/portfolio/components/contact.tsx src/features/portfolio/components/footer.tsx
git commit -m "refactor: convert contact and footer sections to Tailwind utility classes"
```

---

### Task 9: `project-case-study-page.tsx`, `home-page.tsx`

**Files:**
- Modify: `src/features/portfolio/pages/project-case-study-page.tsx`
- No change needed: `src/features/portfolio/pages/home-page.tsx` (assembles other components, has no classNames of its own — confirm by reading the file, do not edit it)

**Interfaces:**
- Consumes: `.case-study-body h2` / `.case-study-body h2:first-child` / `.case-study-body p` classes from `@layer components` (Task 1) — the wrapping `<div className="case-study-body ...">` must keep the literal string `case-study-body` in its className (alongside the new utility classes) so those selectors keep matching the MDX-rendered headings/paragraphs inside it.
- Produces: none consumed by later tasks.

- [ ] **Step 1: Rewrite `project-case-study-page.tsx`**

In `src/features/portfolio/pages/project-case-study-page.tsx`, replace the `return` block (everything from `return (` through the end of the function) with:

```tsx
  return (
    <main>
      <Nav />
      <article className="pt-16 max-w-[1100px] mx-auto px-6">
        <Link className="font-mono text-[0.86rem] text-fg-muted no-underline inline-flex items-center gap-1.5 hover:text-fg" href="/#projects">
          {tProjects("back")}
        </Link>
        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.02em] mt-5">{frontmatter.title}</h1>
        <div className="flex gap-7 flex-wrap mt-6 mb-8 py-5 border-t border-b border-line">
          <div>
            <div className="font-mono text-[0.76rem] uppercase tracking-[0.1em] text-fg-muted">{t("role")}</div>
            <div className="text-[0.95rem] mt-1">{frontmatter.role}</div>
          </div>
          <div>
            <div className="font-mono text-[0.76rem] uppercase tracking-[0.1em] text-fg-muted">{t("period")}</div>
            <div className="text-[0.95rem] mt-1">{frontmatter.periods.join(" · ")}</div>
          </div>
          <div>
            <div className="font-mono text-[0.76rem] uppercase tracking-[0.1em] text-fg-muted">{t("stack")}</div>
            <div className="text-[0.95rem] mt-1">{frontmatter.stack}</div>
          </div>
        </div>
        <div className="case-study-body max-w-[68ch] text-fg-muted text-base leading-[1.75]">{content}</div>
      </article>
    </main>
  );
}
```

The rest of the file (imports, `generateProjectStaticParams`, `generateProjectMetadata`, the top of `ProjectCaseStudyPage` through `const tProjects = ...`) is unchanged.

- [ ] **Step 2: Visual check**

Run: `npm run dev`, open a project's case-study page (e.g. `/en/projects/<slug>`).
Checklist: "back to projects" link works and shows a hover color change; title, meta row (role/period/stack), and MDX body spacing all match the pre-migration layout; MDX `##` headings inside the body still get the accent-adjacent heading style (`.case-study-body h2`) with no top margin on the very first heading, and paragraphs keep their bottom spacing — this confirms the one remaining `@layer components` MDX-targeting rule from Task 1 is working.

- [ ] **Step 3: Commit**

```bash
git add src/features/portfolio/pages/project-case-study-page.tsx
git commit -m "refactor: convert case-study page to Tailwind utility classes"
```

---

### Task 10: Final full-site pass + `CLAUDE.md` updates

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: everything from Tasks 1–9.
- Produces: nothing further.

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors and no new ESLint warnings. If it fails, the failure must be fixed before continuing — do not skip.

- [ ] **Step 2: Full-site visual sweep**

Run: `npm run dev` (or `npm run start` against the production build). Walk both locales (`/en`, `/vi`), both themes (light/dark via the toggle), and the home page top-to-bottom plus one case-study page, at three widths: full desktop, ~700px (between the 760px/720px/600px breakpoints), and ~375px (mobile). Confirm nothing regressed versus the pre-migration site (spacing, colors, hover/focus states, the blob background, the marquee, responsive breakpoints).

- [ ] **Step 3: Update `CLAUDE.md` styling conventions**

In `CLAUDE.md`, under `# Conventions (edit once per project)`, replace the `Styling helper` line:

```markdown
- Styling helper: `cn()` <!-- clsx wrapper at src/utils/cn.ts — no tailwind-merge, this design is hand-written CSS classes, not Tailwind utility composition, so there is nothing to merge/dedupe -->
```

with:

```markdown
- Styling helper: `cn()` <!-- clsx + tailwind-merge wrapper at src/utils/cn.ts — styling is Tailwind v4 utility-first (see globals.css @theme block for design tokens: bg-accent, text-fg-muted, border-line, font-mono, etc.); tailwind-merge resolves same-property conditional class conflicts -->
```

Replace the `Button` line:

```markdown
- Button: `raw <button> allowed` <!-- every button already has a bespoke CSS class (.btn/.btn-primary/.btn-ghost/.chip-btn) from the design spec; a variant-prop Button component would just wrap these same classes for no benefit -->
```

with:

```markdown
- Button: `raw <button> allowed` <!-- every button is styled with Tailwind utility classes directly in JSX (via cn() where conditional); a variant-prop Button component would just wrap these same utilities for no benefit -->
```

In the `## Accessibility & design tokens` section, replace:

```markdown
- Colors, spacing, and font sizes come from this project's design tokens (`var(--accent)`, `var(--fg-muted)`, etc. in `src/app/globals.css`), never hardcoded ad-hoc values per component. (The token *definitions* themselves live in `globals.css` and are exempt — that file is where the hex values are declared once.)
```

with:

```markdown
- Colors and fonts come from this project's design tokens, applied as Tailwind theme utilities (`bg-accent`, `text-fg-muted`, `border-line`, `font-mono`, etc.) generated by the `@theme` block in `src/app/globals.css`, never hardcoded ad-hoc hex values or bare `var(--x)` per component. (The token *definitions* themselves live in `globals.css` and are exempt — that file is where the hex values are declared once.) Spacing/sizing that has no exact match in Tailwind's default scale uses an arbitrary value (`mt-[22px]`) rather than rounding to the nearest scale step.
```

In the `## className — MANDATORY (this project uses cn())` section, add a new bullet at the end:

```markdown
- `@layer components` in `globals.css` is reserved for effects that cannot be expressed as Tailwind utility composition in JSX: multi-part keyframe animations (`.blob-a`..`.blob-d`, `.marquee-track`), `mask-image` effects (`.marquee`), and selectors that must target unstyled raw MDX-rendered output with no JSX element to attach a className to (`.case-study-body h2`/`p`). It is not a place to reconstruct a removed named-class system — check for a `group`/`group-hover`/`after:`/arbitrary-value way first.
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md styling conventions for Tailwind v4 utility-first migration"
```

---

## Self-Review Notes

- **Spec coverage**: every spec section has a task — `@theme` tokens (Task 1), dark-mode-unchanged (Task 1), the two original `@layer components` exceptions plus the MDX-body exception discovered while mapping every CSS rule against real JSX (Task 1 + Task 9), `tailwind-merge` (Task 1), `CLAUDE.md` updates (Task 10), the 10-batch order (Tasks 1–10 map 1:1 onto the spec's batches, with the `.wrap`/`layout.tsx` scope gap folded into Task 3).
- **Third `@layer components` exception**: the spec named two (blob, marquee); mapping every file surfaced a third — `.case-study-body h2`/`p`, which style MDX output the JSX never touches directly. Documented in Global Constraints, Task 1, Task 9, and the `CLAUDE.md` wording in Task 10 so it isn't mistaken for scope creep later.
- **Type/name consistency**: `cn()`'s signature (`cn(...inputs: ClassValue[]): string`) is unchanged from before, just its implementation — every call site across Tasks 2, 6 keeps working with no signature changes. The `CHIP_BUTTON_CLASSNAME` string literal is repeated identically in Task 2's three files (a deliberate, documented non-abstraction, not an inconsistency).
