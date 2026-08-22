# Tailwind v4 Styling Migration — Design Spec

Date: 2026-08-22
Status: Approved via brainstorming

## Purpose

The project has Tailwind v4 installed (`tailwindcss`, `@tailwindcss/postcss`,
`@import "tailwindcss";` in `globals.css`) but styling is actually done with
~1034 lines of hand-written CSS: BEM-ish classes (`.btn`, `.card`,
`.nav-links`, `.tech-badge`...) driven by CSS custom properties
(`--accent`, `--bg`, `--fg-muted`...). This is a deliberate mismatch between
installed tooling and actual usage that the user wants resolved: convert
styling across the whole codebase to Tailwind v4 utility classes, and update
`CLAUDE.md`'s conventions to match.

**Goal is visual parity, not a redesign.** The site already has an approved
look (`docs/superpowers/specs/2026-08-21-portfolio-design.md`); this
migration changes *how* that look is implemented, not what it looks like.

## Approaches considered

1. **Utility-first in JSX + `@theme` tokens + minimal `@layer components`
   for irreducible complexity** — chosen. Matches how Tailwind v4 is meant
   to be used; keeps the few genuinely non-utility effects (keyframe
   animation, mask-image) in CSS instead of forcing them into unreadable
   arbitrary-value soup.
2. **Keep existing class names, redefine them with `@apply` in
   `globals.css`** — rejected. JSX would still read `className="btn
   btn-primary"`; the codebase would not actually be "using Tailwind" in
   any meaningful sense, and Tailwind v4's own guidance discourages
   `@apply`-heavy architectures.
3. **Component-variant system (`cva` + a `Button` component, etc.)** —
   rejected. Violates the project's existing, deliberate convention (`Button:
   raw <button> allowed`) and is unneeded abstraction for a static personal
   site with a handful of interactive elements.

## Design tokens → `@theme`

Move the color and font CSS custom properties into a `@theme` block in
`globals.css` so Tailwind generates utility classes from them:

| Current CSS variable | New `@theme` key | Utility classes generated |
|---|---|---|
| `--ink`, `--ink-raised`, `--ink-raised-2` | `--color-ink*` | `bg-ink`, etc. (rarely used directly — see dark mode below) |
| `--paper`, `--paper-raised`, `--paper-raised-2` | `--color-paper*` | same |
| `--accent`, `--accent-2` | `--color-accent`, `--color-accent-2` | `bg-accent`, `text-accent`, `border-accent`, ... |
| `--blob-1..4` | `--color-blob-1..4` | `bg-blob-1`, etc. (used in the `@layer components` blob block) |
| `--bg`, `--bg-raised`, `--bg-raised-2` | `--color-bg`, `--color-bg-raised`, `--color-bg-raised-2` | `bg-bg`, `bg-bg-raised`, ... |
| `--fg`, `--fg-muted` | `--color-fg`, `--color-fg-muted` | `text-fg`, `text-fg-muted` |
| `--line` (+ `--line-dark`/`--line-light` internals) | `--color-line` | `border-line`, `divide-line` |
| `--mono`, `--sans` | `--font-mono`, `--font-sans` | `font-mono`, `font-sans` |

`--radius`, `--shadow`, `--blob-opacity`, `--blob-blend` stay as plain CSS
custom properties (not `@theme` entries) — they're either used inside the
`@layer components` blob/marquee block or as one-off arbitrary values
(`shadow-[var(--shadow)]`), not as a general-purpose utility scale.

## Dark mode — no new mechanism

The existing dark/light mechanism (`@media (prefers-color-scheme: dark)`
scoped to `:root:not([data-theme="light"])`, plus explicit
`:root[data-theme="dark"]` / `:root[data-theme="light"]` overrides written
by `theme-toggle.tsx` / `theme-provider.tsx`) already works by **redefining
the CSS custom property's value**, not by toggling a class Tailwind needs to
know about. Utilities like `bg-bg` and `text-fg` compile down to `var(--color-bg)`
/ `var(--color-fg)`, so they automatically re-resolve when those variables
change. No `@custom-variant dark`, no code changes to `theme-toggle.tsx` or
`theme-provider.tsx` — only the variable *definitions* move into `@theme`,
the light/dark override blocks stay exactly as they are today.

## What stays in `@layer components`

Everything in the current `globals.css` was re-evaluated against "can this
be a `group`/`group-hover`/arbitrary-value utility instead?". Two things
cannot:

- **`.atmosphere` / `.blob-a`..`.blob-d` + `@keyframes driftA..driftD`** —
  the animated gradient-blob background. Four independent keyframe
  animations with per-blob timing/geometry; expressing this as inline
  arbitrary values would be far less readable than the current named
  classes, with zero benefit.
- **`.marquee` / `.marquee-track` + `@keyframes marquee`** — the
  infinite-scroll focus-keyword strip, including its `mask-image` edge
  fade. Same reasoning: a multi-part animated effect, clearer as a named
  component-layer class than as inline arbitrary values.

Everything else currently in `globals.css` converts to JSX utility classes,
including patterns that look like they need custom CSS but don't:

- `.card:hover .card-image` / `.card:focus-within .case-badge` compound
  hover-child selectors → Tailwind's native `group` (on the parent) +
  `group-hover:` / `group-focus-within:` (on the child).
- `.chip-btn:focus-visible` / `a:focus-visible` outline reset →
  `focus-visible:outline-2 focus-visible:outline-accent
  focus-visible:outline-offset-2` utilities.
- `color-mix(in srgb, var(--accent) 50%, var(--line))` hover-border blends
  (`.btn-ghost`, `.chip-btn`, `.icon-link`, `.social-icon`, `.card`) →
  arbitrary value directly in the className, e.g.
  `hover:border-[color-mix(in_srgb,var(--accent)_50%,var(--line))]`.
- All plain layout/spacing/typography/color rules (the majority of the
  file) → direct utility classes (`flex`, `gap-6`, `text-fg-muted`,
  `rounded-lg`, responsive variants via `sm:`/`md:` instead of the current
  hand-rolled `@media` blocks, etc.).

Base element resets that aren't part of the custom design-class system
(`*, *::before, *::after { box-sizing }`, `html { scroll-behavior }`,
`body`, `::selection`, `a { color: inherit }`, `img, svg`, `h1-h3`, `p`,
`button { font-family }`) stay as plain global CSS — Tailwind's own preflight
doesn't cover the project's specific reset choices (e.g. `scroll-behavior:
smooth` with a `prefers-reduced-motion` override), and there's no utility
class to attach these to since they target bare elements, not components.

## `cn()` gains `tailwind-merge`

`src/utils/cn.ts` changes from a bare `clsx` wrapper to
`twMerge(clsx(inputs))`, and `tailwind-merge` is added as a dependency. Once
classNames are real Tailwind utilities, two conditional branches can touch
the same CSS property (e.g. two different padding utilities) and
`tailwind-merge` resolves that correctly by which utility wins, rather than
relying on CSS source order.

## `CLAUDE.md` updates

- **Styling helper**: `cn()` note changes from "no tailwind-merge... hand-written
  CSS classes, not Tailwind utility composition" to reflect that styling is
  now Tailwind v4 utility-first, tokens sourced from `@theme` in
  `globals.css`, and `cn()` is `clsx` + `tailwind-merge`.
- **Button** convention note: drop the reference to `.btn`/`.btn-primary`/
  `.btn-ghost`/`.chip-btn` (these named classes go away); keep "raw
  `<button>` allowed" as-is.
- **Accessibility & design tokens** section: "Colors, spacing, and font sizes
  come from `var(--accent)`, `var(--fg-muted)`, etc. in `globals.css`"
  becomes "...come from Tailwind theme utilities (`bg-accent`,
  `text-fg-muted`, etc.) generated by the `@theme` block in `globals.css`".
- New line under the className/`@layer components` guidance: `@layer
  components` is reserved for effects that cannot be expressed as utility
  composition (see the two exceptions above) — it is not a place to
  reconstruct the old named-class system.

## Scope & migration order

Files touched: `src/app/globals.css`, `src/utils/cn.ts`, `package.json`
(+ lockfile), `CLAUDE.md`, and all 17 component/page files under
`src/features/portfolio/{components,pages}/`.

Migration proceeds in visually-groupable batches, verified against the dev
server after each batch for visual parity (not a redesign — spot-check
against current rendered output, both light and dark):

1. `globals.css` rewrite (`@theme` tokens + reset layer + the two
   `@layer components` blocks) + `cn.ts` + `tailwind-merge` dependency.
2. `nav.tsx`, `theme-toggle.tsx`, `locale-switcher.tsx` (site chrome).
3. `hero.tsx`, `animated-background.tsx`, `reveal.tsx`.
4. `about.tsx`, `tech-stack.tsx`.
5. `focus-marquee.tsx`.
6. `projects.tsx`, `project-card.tsx`.
7. `experience.tsx`.
8. `contact.tsx`, `footer.tsx`.
9. `project-case-study-page.tsx`, `home-page.tsx`.
10. Final full-site pass (`npm run build`) + `CLAUDE.md` edits.

## Testing

No component-level test suite exists for styling (this is a static content
site). Verification is visual: run the dev server, check each migrated
section renders identically (spacing, color, hover/focus states, dark mode
toggle, responsive breakpoints at the widths the original media queries
targeted: 760px, 720px, 600px) before moving to the next batch. Final
`npm run build` must succeed with no new TypeScript/ESLint errors.
