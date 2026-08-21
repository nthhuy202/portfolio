# Personal Portfolio — Design Spec

Date: 2026-08-21
Status: Approved via brainstorming; prototype finalized

## Purpose

A single personal portfolio site with About, Projects (with case-study
detail pages), Work Experience, and Contact. Bilingual (EN default, VI
secondary), dark/technical aesthetic, light/dark toggle, and a small set of
scroll/hover animations to keep the page feeling alive without becoming
noisy.

A working HTML/CSS/JS prototype was built and iterated during
brainstorming to validate layout, color, type, and motion before writing
any Next.js code:
https://claude.ai/code/artifact/79876efc-599a-4204-b02c-4e6cfb7bf516
It reflects the approved visual direction; the sections below describe
what it demonstrates and how it maps to the real implementation.

## Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS v4** for styling — no component library (shadcn rejected:
  the site only needs a handful of simple interactive elements — theme
  toggle, locale switch, nav, cards — which plain Tailwind + native
  elements cover without pulling in a broader component system).
- **next-intl** for i18n routing.
- **next-themes** for light/dark persistence.
- **Framer Motion** for scroll-reveal and hover/entrance animation.
- **gray-matter** + **next-mdx-remote/rsc** for parsing and rendering
  project case-study MDX (no contentlayer — avoids its codegen step for a
  site this small).

No backend, no database, no CMS, no contact-form API. Content lives in
the repo as data/MDX files and is edited by hand.

## Routing & pages

- `app/[locale]/page.tsx` — the single scrolling home page (all sections
  below, in order).
- `app/[locale]/projects/[slug]/page.tsx` — case-study detail page,
  `generateStaticParams` over every project × locale.
- `middleware.ts` — next-intl locale detection/redirect; default locale
  `en`, root `/` redirects to `/en`.
- Supported locales: `en` (default), `vi`.

## Content model

- **UI strings**: `messages/en.json`, `messages/vi.json` (next-intl) —
  nav labels, section headings, button text, etc.
- **Projects**: `content/projects/en/{slug}.mdx` and
  `content/projects/vi/{slug}.mdx`. Frontmatter per project:
  `title, summary, tech: string[], githubUrl?, demoUrl?, image?,
  periods: string[], country: { flag: string, name: string }, role, stack`.
  The MDX body is the full case-study content (problem / approach /
  result, or freer-form as needed) rendered on the detail page.
  `periods` is an array to support projects delivered across multiple
  phases (rendered as multiple pill badges).
- **Experience**: `content/experience/en.json`,
  `content/experience/vi.json` — array of
  `{ company, role, period, bullets: string[] }`. Plain JSON (not MDX):
  entries are short and don't need a detail page.
- **Tech stack badges** (About section) and **focus-area keywords**
  (marquee section) are small static arrays in code — not user-editable
  content, so no need for a data file.

## Page sections (home)

1. **Nav** — sticky, blurred background (7–8px backdrop blur, not the
   heavier default). Logo mark `alex.dev` set in the same system
   monospace stack used for labels elsewhere. Anchor links to
   About / Projects / Experience / Contact; the active section's link
   highlights automatically via scroll position (IntersectionObserver
   scrollspy) — a section activates as soon as its top clears the sticky
   nav, and stays active until less than half of it remains on screen,
   using the nav's real rendered height (not a fixed percentage) as the
   trigger offset. Locale switcher (EN/VI) and theme toggle (sun/moon)
   live on the right; collapses to a hamburger menu on mobile.
2. **Hero** — name, role tagline, short pitch, two CTA buttons (View
   projects / Get in touch — equal-width, stacked full-width on mobile),
   and three stats (years / projects / teams — also equal-width on
   mobile).
3. **About** — bio paragraphs, plus a **Tech stack** block: badges of
   icon-glyph + tech name in a 4-column grid (2 columns on mobile).
4. **Focus areas** — a full-bleed (edge-to-edge, not container-width)
   horizontal marquee of keywords (Accessibility, Performance,
   Interface, Frontend, Backend, Security, Scalability, Design Systems),
   translated per locale, looping continuously; pauses under
   `prefers-reduced-motion`.
5. **Projects** — 2-column card grid (1 column on mobile). Each card:
   - Image area: real photo if the project has one, otherwise the
     project title itself rendered large as a stylized placeholder tile.
   - Period badge(s) pinned top-right of the image (multiple pills if
     the project shipped across separate phases).
   - "View case study" badge hidden by default, revealed bottom-right of
     the image on hover/focus with a fade+slide-in and a color shift
     from neutral to accent.
   - On hover: image zooms in slightly, title switches to the accent
     color — both revert on hover-out.
   - Below the image: title, description clamped to 3 lines
     (`-webkit-line-clamp`, ellipsis if longer — click-through to the
     case study for the rest), tech-stack pills, partner/client country,
     and a small GitHub icon link.
   - Clicking the image (or the revealed badge) opens the case study —
     in the prototype this is an in-page modal; in the real build it
     navigates to `/[locale]/projects/[slug]`.
6. **Experience** — timeline list: period, role, company, bullet points.
7. **Contact** — full-width blurb line above a single email CTA
   (`mailto:`); no form. GitHub/LinkedIn/Facebook moved out of this
   section into the footer (see below).
8. **Footer** — copyright line on the left; on the right, small circular
   icon links for GitHub / LinkedIn / Facebook plus a "back to top" link.

## Visual design

- **Background**: four soft, blurred gradient blobs, fixed behind all
  content, drifting slowly back and forth (CSS `alternate` animation,
  ~11–17s per blob) so they cross paths like a lava lamp. Palette is
  deliberately separate from the text accent colors (violet, magenta,
  teal, blue) so drifting blobs never wash out the orange/teal accent
  text sitting directly on the page background. `mix-blend-mode` is
  `screen` in dark mode (glow) and `multiply` in light mode (richer,
  visible against a light ground); opacity and blend mode are both theme
  tokens so the effect holds up in both themes. All animation respects
  `prefers-reduced-motion`.
- **Type**: system sans-serif stack for headings/body, system monospace
  stack for labels/eyebrows/code-flavored UI (including the nav logo
  mark — no separate typewriter face). Base sizes match the first
  prototype pass for medium/large text; small utility text (eyebrows,
  chips, pills, badges, footer) runs slightly larger (~1–2px) than that
  baseline for legibility.
- **Theme tokens**: color, background, and blob-opacity/blend are all
  CSS custom properties, overridden both by `prefers-color-scheme` and
  by an explicit `data-theme` attribute (the toggle), so OS preference
  and manual override both work correctly in either direction.

## Testing / verification

Static content site with no branching logic beyond client-side toggles
(theme, locale) and scroll-driven UI state — no automated test suite.
Verification is manual, in-browser, before calling any implementation
step done:

- Light/dark toggle persists and matches OS default when untouched.
- EN/VI toggle swaps all UI strings, project/experience content, and
  updates `<html lang>`.
- Scroll-reveal, marquee, blob drift, and card hover/zoom animations all
  work and are disabled under `prefers-reduced-motion`.
- Nav scrollspy highlights the correct section while scrolling.
- Case-study navigation works for every project × locale.
- Responsive check at mobile width (nav hamburger, stacked/equal-width
  buttons and stats, 1-column project grid, 2-column tech grid).
- Keyboard: nav, toggles, and project case-study navigation are all
  reachable and usable without a mouse.

## Deployment

Not yet decided. The Next.js default build works on Vercel out of the
box; nothing in this design depends on a specific host.

## Out of scope

- CMS or any content editing UI — content is edited directly in
  data/MDX files.
- Contact form / email-sending backend.
- Blog or any content type beyond Projects and Experience.
- Component library (shadcn) — revisit only if a future page needs
  complex components (forms, dialogs, tables) this design doesn't have.
