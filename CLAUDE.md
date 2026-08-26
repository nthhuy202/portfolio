# Project rules — Portfolio

Conventions specific to this project, followed by the framework-agnostic core rules (appended below).

---

# Conventions (edit once per project)

- Framework: `Next.js App Router`
- Path alias: `@/`
- Filenames: `kebab-case`
- Types: `interface over type`
- React version: `19`
- Styling helper: `cn()` <!-- clsx + tailwind-merge wrapper at src/utils/cn.ts — styling is Tailwind v4 utility-first (see globals.css @theme block for design tokens: bg-accent, text-fg-muted, border-line, font-mono, etc.); tailwind-merge resolves same-property conditional class conflicts -->
- Button: `raw <button> allowed` <!-- every button is styled with Tailwind utility classes directly in JSX (via cn() where conditional); a variant-prop Button component would just wrap these same utilities for no benefit -->
- Icons: `custom (src/components/icons/)` <!-- only two real icons in this design (sun/moon theme toggle) — a named IconXxx component per icon, no external icon library -->
- Images: `next/image` <!-- not used yet (no photos in the current content), but this is the convention once real project photos are added -->
- Internal links: `next/link` (via `next-intl`'s `Link` from `@/i18n/navigation`) <!-- plain <a> stays for same-page hash anchors (#about, #projects, #top, ...) and for genuinely external URLs (mailto:, github.com, linkedin.com, facebook.com, target="_blank") -->

---

# Language

- Code comments and commit messages: **English**
- User-facing copy: **English** default, **Vietnamese** as the secondary locale (`vi`) per the design spec's i18n requirement — both live in `src/messages/*.json` and the bilingual MDX/JSON content files, never hardcoded in components.
- Comments explain *why*, not *what*. A comment that repeats the code line is noise; delete it.

---

# Component checklist — MANDATORY

Before finishing any component file (`.tsx`), check every item:

- [ ] **One file = one component.** No helper components declared in the same file. Split them out.
- [ ] **Pure constants** (not depending on props / state) → moved to the feature's `constants/`, not left in the component file.
- [ ] **Helper / utility functions** (formatting, calculation, data massaging) → moved to the feature's `utils/`, not left in the component file.
- [ ] **Buttons / icons / images from the declared source only** (see Conventions above). No mixing.
- [ ] **No inline type** in the function signature → declare a proper `interface <ComponentName>Props`.
- [ ] **Blank line before `return`** in every component and function that has logic above it.
- [ ] **No duplicate function.** Before writing a new helper, grep for it. Used in 2+ places → move to `utils/`.

---

# User-facing copy must match real behavior — MANDATORY

When a feature's behavior changes (a limit, a count, a step, how something enters a list...), **in the same turn grep and update every place that describes it to the user** — hero stats, section copy, case-study meta, footer text. Rule of thumb: **grep the old wording before saying you are done.** When in doubt, ask, do not guess.

---

# Workflow — MANDATORY

- **Never commit or push on your own.** Wait until the user explicitly asks ("commit this", "push it") in the same turn. (Note: the implementation plan for this project already carries the user's standing instruction to commit at the end of each task — that counts as having asked, for the duration of that plan's execution. Outside plan execution, this rule reverts to asking first.)
- **Agent may run lint / build on its own:** `yes` <!-- the implementation plan's own verification steps (npm run dev / npm run build) require this -->
- When the code is done, say so and let the user decide the next step.

---

# Dev Rules — Core (framework-agnostic)

These rules apply to every React / TypeScript file in this project. They are about structure, naming, types and discipline — not about which library was picked (that's the Conventions block above).

The `nextjs-app-router` Skill at `.claude/skills/nextjs-app-router/SKILL.md` adds what these core rules cannot assume about the framework; Claude Code loads it automatically when the work touches `src/app` routing, server/client components, or route handlers.

---

## General principles

- **DRY**: logic repeated 2+ times must be extracted into a shared function/component/hook.
- **No magic numbers/strings**: any number or string whose meaning isn't self-evident must be a named constant — never bare literals in conditions, timeouts, or comparisons.
- **KISS**: pick the simplest solution that correctly solves the problem; no showing off technique or premature abstraction.
- **YAGNI**: don't add parameters, config, or abstractions for features that "might be needed later." Code only for the current requirement.
- **Single responsibility**: each function/component does one thing. If a component fetches, transforms, and renders all at once, split fetch/transform into a custom hook.
- **Early return, avoid deep nesting**: guard clauses at the top of a function instead of stacking nested ifs.

---

## Project structure — feature-based

Organize code by feature, not by technical layer. This project has one feature, `portfolio` (the site has one product surface: the personal portfolio itself), so almost everything lives under `src/features/portfolio/`:

```
src/features/
└── portfolio/
    ├── pages/        # Page-level components rendered by src/app/[locale]/**/page.tsx
    ├── components/   # Components private to this feature
    ├── hooks/        # Hooks private to this feature
    ├── utils/        # Content-loading helpers private to this feature
    ├── constants/    # Static data (tech stack badges, focus keywords)
    ├── types/        # Types / interfaces private to this feature
    └── content/      # Bilingual MDX (projects) and JSON (experience) content
```

### Shared (used by 2+ features)

- `src/components/icons/` — named icon components (explicitly shared per the Icons convention, regardless of feature count)
- `src/utils/` — shared pure functions (e.g. `cn()`)
- `src/i18n/`, `src/messages/`, `src/middleware.ts` — routing/i18n infrastructure, not feature UI

This project does not yet have `src/hooks/`, `src/lib/`, or `src/constants/` at the top level — nothing is shared across 2+ features yet, because there is only one feature. Do not create those folders until something genuinely needs to move there.

### Principles

- **Never import across `features/`.** Not applicable yet (one feature), but binding if a second feature is ever added.
- UI elements repeated in 2+ features must become a shared component in `src/components/`.
- When creating a shared component in `src/components/`:
  - One folder per component
  - Filename follows kebab-case
  - Always ship an `index.ts` that re-exports it (once the folder has 3+ exports)
  - Keep it simple first, extend on demand

---

## Component rules

- **Component filenames follow kebab-case** (`hero.tsx`, `project-card.tsx`).
- **One file = one component.** Do not declare several components in one file.
- Every declared hook must be used; delete unused ones.
- Always fix TypeScript errors and warnings in components and functions.
- When a piece of logic (fetch, state, side effect, data massaging) repeats in 2+ places, extract it:
  - A custom hook in `hooks/` if it touches state / lifecycle
  - A utility function in `utils/` if it is pure
- **Before creating a new util / hook / constant, grep for the file name and the function name** first. A name clash (or a job clash) means it already exists: reuse it. Never create a second copy.
- **A component over ~300 lines is a signal to split.** Not a hard cap, but crossing it needs a reason.

---

## Naming conventions

- **Variable and function names must describe meaning.** No single letters or vague abbreviations (`a`, `b`, `res`, `tmp`, `val`, `obj`, `arr`, `fn`, `cb`, `e`) — the only exception is `i` in a plain `for` loop.
- Function names start with a verb: `handleSubmit`, `fetchUser`, `parseResponse`, `validateEmail`.
- Boolean-returning functions use `is`, `has`, `should`, `can`.
- Boolean variables use the same prefixes: `isLoading`, `hasError`. Never neutral names like `flag`, `status`, `check`.
- Callback parameters in `.map`, `.filter`, `.forEach` still get real names: `project` not `p`, `entry` not `e`.
- An async function stored in a variable gets the `Promise` suffix.

---

## TypeScript types

- **Object shapes use `interface`** (this project's declared preference). `type` is fine for unions, intersections, mapped and conditional types.
- **No inline types in function signatures.** Declare them at the top of the file.
- **Component props are named `<ComponentName>Props`**, never the generic `Props`.
- **Constants get an explicit type / interface.** Do not let TypeScript infer the type of a constant array.
- **On React 19, do not use `React.FormEvent` or `React.FormEventHandler`** (deprecated). Use `React.SyntheticEvent<HTMLFormElement>` for `onSubmit`, `React.ChangeEvent<HTMLInputElement>` for `onChange`. (Not applicable yet — this project has no forms.)

---

## Constants and utils

- **Constants inside a component file must move to** the feature's `constants/`. Name them by meaning (`techStack`, `focusKeywords`), not `data`/`list`.
- **Helper functions tied to a constant also move to `utils/`** of the feature, not the component file.
- **Types / interfaces used by constants or shared inside a feature live in `types/`**, not in the constants file or the component file.

---

## Barrel exports (index.ts)

Every `components/`, `hooks/`, `utils/` folder with 3+ exports must have an `index.ts` re-exporting them, using named exports (never `export *`):

```ts
// index.ts
export { Hero } from "./hero";
export { About } from "./about";
export { TechStack } from "./tech-stack";
```

---

## State management inside a component

- Group semantically related `useState` calls into one object.
- **Never mutate state or props directly.** Always create a new object/array.
- **Every side effect (fetch, subscribe, timer, direct DOM access) goes inside `useEffect`**, never called directly in the render body.
- Keep state local (`useState`) if only one component uses it; lift it only once genuinely shared.
- Don't pass a prop through 3+ intermediate components just to forward it — use Context instead.

---

## Data fetching & error handling

- Every API call must handle all three states: loading, success, error — never assume success. (This project reads local files at build/request time, not a remote API — `fs.readFileSync`/`fs.readdirSync` throwing on a missing project file is expected to surface as a build failure, not be silently caught.)
- Never swallow errors silently (empty `catch`); at minimum log them or surface them to the user.

---

## Performance

- Only reach for `memo` / `useMemo` / `useCallback` once you've actually measured a re-render problem — don't wrap everything by default.
- Lazy-load heavy or rarely-used routes/components instead of bundling them into the main entry.

---

## Code style inside a function

- Always leave a **blank line between distinct logical blocks** inside a function.
- **Always leave one blank line between the logic and the `return`.**
- Each field validation is its own `if` block. No unnecessary nested if/else.
- **Every `eslint-disable` needs a comment explaining why on the line above.** If you cannot explain it, do not disable it: fix the code so lint passes.

---

## className — MANDATORY (this project uses `cn()`)

- **Never build classes with array `.join(" ")` or template strings with nested ternaries.** Always use `cn()` from `@/utils/cn`.
- One condition per line for multi-condition class lists.
- Complex class logic goes into a helper function outside the JSX, never inline.
- `@layer components` in `globals.css` is reserved for effects that cannot be expressed as Tailwind utility composition in JSX: the blob background animation (`.atmosphere`, `.blob-a`..`.blob-d`), the marquee's mask-image + infinite-scroll animation (`.marquee`, `.marquee-track`), and selectors that must target unstyled raw MDX-rendered output with no JSX element to attach a className to (`.case-study-body h2`/`p`). It is not a place to reconstruct a removed named-class system — check for a `group`/`group-hover`/`after:`/arbitrary-value way first.

---

## Accessibility & design tokens

- Colors and fonts come from this project's design tokens, applied as Tailwind theme utilities (`bg-accent`, `text-fg-muted`, `border-line`, `font-mono`, etc.) generated by the `@theme` block in `src/app/globals.css`. Two non-`@theme` CSS variables (`rounded-[var(--radius)]`, `shadow-[var(--shadow)]`) are sanctioned one-off exceptions because their values differ between light/dark themes; beyond those, don't hardcode ad-hoc hex values or bare `var(--x)` per component. (The token *definitions* themselves live in `globals.css` and are exempt — that file is where the hex values are declared once.) Spacing/sizing that has no exact match in Tailwind's default scale uses an arbitrary value (`mt-[1.375rem]`) rather than rounding to the nearest scale step.
- **Arbitrary bracket values always use `rem`, never `px`** (`mt-[1.375rem]`, not `mt-[22px]`) — keeps every hand-written size on the same unit as Tailwind's own scale (1rem = 16px). The one exception is `ch`/`em`: `ch` is the correct unit for text-measure max-widths (`max-w-[56ch]`) because it scales with the font's own character width, and `em` is fine for letter-spacing — neither is "inconsistent," so don't convert them to rem.
- **Responsive breakpoints always use Tailwind's default `sm`/`md`/`lg`/`xl`/`2xl` scale** — including the built-in `max-sm:`/`max-md:`/... variants for "below this breakpoint" cutoffs — never a custom `max-[Npx]`/`min-[Npx]` value. Snap to the nearest default breakpoint rather than inventing one, unless the cutoff is tied to a genuinely non-negotiable pixel constraint (rare) — if so, comment the reason inline above the class.
- Use correct semantic tags (`button`, `nav`, `main`, `header`, `footer`) instead of `div`/`span` with `onClick`.
- Images need `alt`; inputs need a `label`; everything must be keyboard-navigable.

---

## UI elements — one source per element type

- **Buttons**: raw `<button>` (see Conventions above) — never mixed with a separate Button component.
- **Icons**: `src/components/icons/`, never inline `<svg>` elsewhere. If a new icon is needed, add a named `IconXxx` component there.
- **Images**: `next/image` once real photos exist.
- **Internal links**: `Link` from `@/i18n/navigation`. Plain `<a>` only for same-page hash anchors and truly external URLs.

---

## Git — MANDATORY

- **Never commit or push on your own** after finishing code, except where the active implementation plan has already carried the user's standing instruction to commit per task.
