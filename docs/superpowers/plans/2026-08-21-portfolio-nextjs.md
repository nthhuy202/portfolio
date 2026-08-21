# Personal Portfolio (Next.js) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (EN/VI), light/dark, animated Next.js portfolio site described in the design spec — a single scrolling home page plus per-project case-study pages — matching the finalized HTML prototype pixel-for-pixel, and following this repo's `CLAUDE.md` coding conventions.

**Architecture:** Next.js App Router with all routes under `src/app/[locale]/`, localized via `next-intl` middleware (default `en`, `/vi` secondary). Route files (`page.tsx`) stay thin — they unwrap `params` and render one component from `src/features/portfolio/pages/`, per `.claude/skills/nextjs-app-router/SKILL.md`; all real UI lives in the `portfolio` feature (this project has exactly one feature, so almost everything is feature-scoped — see `CLAUDE.md`'s Project Structure section). Content is file-based: project case studies as bilingual MDX with frontmatter (parsed with `gray-matter`, rendered with `next-mdx-remote/rsc`), experience entries as bilingual JSON, everything else as UI strings in `next-intl` message files. The prototype's hand-written CSS (custom properties for theming, keyframe animations for the background/marquee/card hover, `clamp()` type scale) is ported almost verbatim into `globals.css` — it's already theme-aware and accessible, and re-deriving it as Tailwind utility soup would just be slower and risk drifting from the approved design. Tailwind v4 supplies the reset layer and is available for any incidental utility use, but is not the primary styling mechanism for this design.

**Tech Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS v4 · next-intl · next-themes · Framer Motion · gray-matter + next-mdx-remote/rsc · clsx (for `cn()`)

**Spec:** `docs/superpowers/specs/2026-08-21-portfolio-design.md`
**Project rules:** `CLAUDE.md` (this repo's coding conventions — feature-based structure, kebab-case, interface-over-type, `cn()`, raw `<button>`, custom icons, `next-intl` `Link`)

## Global Constraints

- Locales: `en` (default), `vi`. Root `/` redirects to `/en`.
- No backend, no database, no CMS, no contact-form API — content is edited directly in repo files.
- No component library (shadcn) — plain Tailwind + native elements only.
- No automated test framework — this is a static content site (spec: "manual verification only"). Every task ends with a manual, in-browser (`npm run dev`) verification step instead of a test run.
- All animation (background drift, marquee, scroll-reveal, card hover/zoom) must respect `prefers-reduced-motion`.
- Theme tokens must work correctly both via OS `prefers-color-scheme` and via the explicit toggle (`data-theme` attribute), in both directions, per the spec's "Theme tokens" note.
- Visual/behavioral source of truth: the finalized prototype at
  `C:\Users\yuhah202\AppData\Local\Temp\claude\D--Code-Project-Portfolio\14426542-b76c-4dfc-a59a-058f3daea4e4\scratchpad\portfolio-prototype.html`
  (also published at https://claude.ai/code/artifact/79876efc-599a-4204-b02c-4e6cfb7bf516). Every task below carries forward its exact CSS values, class names, and animation timings unless the task says otherwise.
- Placeholder content (name "Alex Tran", the three example projects, the three example experience entries) is carried over from the approved prototype as real, structurally-complete sample content — not lorem ipsum. The user replaces it with their real bio/projects/experience later by editing the data files; no task should leave a field empty or a "TODO" in content.
- **Coding conventions (from `CLAUDE.md`, binding on every task):**
  - Feature-based structure: all portfolio UI/logic lives under `src/features/portfolio/{pages,components,hooks,utils,constants,types,content}`. Only routing infra (`src/app`, `src/i18n`, `src/messages`, `src/middleware.ts`) and the two genuinely-shared utilities (`src/components/icons/`, `src/utils/cn.ts`) live outside it.
  - Filenames: kebab-case for every `.ts`/`.tsx` file.
  - Object-shape types are `interface`, never `type X = {...}`.
  - Component props are typed via a declared `interface <ComponentName>Props`, never inline in the function signature.
  - Conditional class names go through `cn()` from `@/utils/cn` — never a raw ternary joined into a template string.
  - Buttons are raw `<button>` with the design's existing CSS classes (`.btn`, `.chip-btn`, ...) — no shared `Button` component.
  - Icons are named components under `src/components/icons/` (`IconSun`, `IconMoon`) — never an inline `<svg>` elsewhere in a `.tsx` file.
  - Internal navigation uses `Link` from `@/i18n/navigation`. Plain `<a>` stays only for same-page hash anchors (`#about`, `#top`, ...) and truly external URLs (`mailto:`, `github.com`, `linkedin.com`, `facebook.com`, `target="_blank"`).
  - A `components/`, `hooks/`, or `utils/` folder gets an `index.ts` barrel (named re-exports only, never `export *`) once it holds 3+ files.
  - Blank line between logic and `return` in every function that has logic above it.

---

## File Structure

```
CLAUDE.md
audit-rules.sh
.claude/skills/nextjs-app-router/SKILL.md
package.json
next.config.ts
tsconfig.json
postcss.config.mjs
eslint.config.mjs
.gitignore
src/
  middleware.ts
  i18n/
    routing.ts
    navigation.ts
    request.ts
  messages/
    en.json
    vi.json
  app/
    globals.css
    [locale]/
      layout.tsx
      page.tsx
      projects/
        [slug]/
          page.tsx
  components/
    icons/
      icon-sun.tsx
      icon-moon.tsx
  utils/
    cn.ts
  features/
    portfolio/
      pages/
        home-page.tsx
        project-case-study-page.tsx
      components/
        index.ts
        theme-provider.tsx
        theme-toggle.tsx
        animated-background.tsx
        reveal.tsx
        nav.tsx
        locale-switcher.tsx
        hero.tsx
        about.tsx
        tech-stack.tsx
        focus-marquee.tsx
        projects.tsx
        project-card.tsx
        experience.tsx
        contact.tsx
        footer.tsx
      hooks/
        use-scroll-spy.ts
      utils/
        projects.ts
        experience.ts
      constants/
        tech-stack.ts
        keywords.ts
      types/
        content.ts
      content/
        projects/
          en/{realtime-order-dashboard,api-mock-cli,ecommerce-migration}.mdx
          vi/{realtime-order-dashboard,api-mock-cli,ecommerce-migration}.mdx
        experience/
          en.json
          vi.json
```

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `.gitignore`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx` (temporary root layout, replaced by `[locale]` layout in Task 3)
- Create: `src/app/page.tsx` (temporary placeholder, deleted in Task 3)

**Interfaces:**
- Produces: a runnable `npm run dev` Next.js app on `http://localhost:3000`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-intl": "^3.26.0",
    "next-themes": "^0.4.4",
    "framer-motion": "^11.15.0",
    "gray-matter": "^4.0.3",
    "next-mdx-remote": "^5.0.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

(This gets wrapped with the next-intl plugin in Task 3, once `src/i18n/request.ts` exists.)

- [ ] **Step 4: Create `postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Create `eslint.config.mjs`**

```js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")];

export default eslintConfig;
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules
.next
.env*.local
npm-debug.log*
```

- [ ] **Step 7: Create `src/app/globals.css` (base only — full token set added in Task 2)**

```css
@import "tailwindcss";

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
}
```

- [ ] **Step 8: Create placeholder root layout and page**

`src/app/layout.tsx`:

```tsx
import "./globals.css";
import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:

```tsx
export default function Home() {
  return <p>Scaffold OK</p>;
}
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: installs with no errors, creates `node_modules` and `package-lock.json`.

- [ ] **Step 10: Verify dev server boots**

Run: `npm run dev`
Expected: server starts on port 3000; visiting `http://localhost:3000` shows "Scaffold OK". Stop the server.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs .gitignore src/app
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind v4 project"
```

---

### Task 2: Design tokens & base styles

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS custom properties (`--bg`, `--bg-raised`, `--bg-raised-2`, `--fg`, `--fg-muted`, `--line`, `--accent`, `--accent-2`, `--blob-1..4`, `--blob-opacity`, `--blob-blend`, `--shadow`, `--radius`, `--mono`, `--sans`) and shared base classes (`.shell`, `.eyebrow`, `.lede`, `.btn`, `.btn-primary`, `.btn-ghost`, `.pill`) that every later component/section task consumes by class name. (These CSS custom properties are the project's design tokens per `CLAUDE.md`'s accessibility section — component code reads them via `var(--...)`, never a hardcoded hex value.)

- [ ] **Step 1: Replace `src/app/globals.css` with the full token set and base rules**

```css
@import "tailwindcss";

:root {
  --ink: #0a0d12;
  --ink-raised: #11161d;
  --ink-raised-2: #161c25;
  --paper: #eef0ec;
  --paper-raised: #ffffff;
  --paper-raised-2: #e4e6e0;
  --accent: #ff7a45;
  --accent-2: #49d8c4;
  --blob-1: #6a5cff;
  --blob-2: #ff4f9a;
  --blob-3: #1fb8d4;
  --blob-4: #4361ff;
  --line-dark: rgba(240, 240, 235, 0.1);
  --line-light: rgba(10, 13, 18, 0.11);

  --bg: var(--paper);
  --bg-raised: var(--paper-raised);
  --bg-raised-2: var(--paper-raised-2);
  --fg: #12151a;
  --fg-muted: #5b6169;
  --line: var(--line-light);
  --shadow: 0 1px 2px rgba(10, 13, 18, 0.06), 0 8px 24px -12px rgba(10, 13, 18, 0.18);
  --radius: 3px;
  --mono: ui-monospace, "Cascadia Code", "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --blob-opacity: 0.5;
  --blob-blend: multiply;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: var(--ink);
    --bg-raised: var(--ink-raised);
    --bg-raised-2: var(--ink-raised-2);
    --fg: #eef0f2;
    --fg-muted: #8b93a0;
    --line: var(--line-dark);
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 20px 40px -20px rgba(0, 0, 0, 0.6);
    --blob-opacity: 0.55;
    --blob-blend: screen;
  }
}

:root[data-theme="dark"] {
  --bg: var(--ink);
  --bg-raised: var(--ink-raised);
  --bg-raised-2: var(--ink-raised-2);
  --fg: #eef0f2;
  --fg-muted: #8b93a0;
  --line: var(--line-dark);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 20px 40px -20px rgba(0, 0, 0, 0.6);
  --blob-opacity: 0.55;
  --blob-blend: screen;
}

:root[data-theme="light"] {
  --bg: var(--paper);
  --bg-raised: var(--paper-raised);
  --bg-raised-2: var(--paper-raised-2);
  --fg: #12151a;
  --fg-muted: #5b6169;
  --line: var(--line-light);
  --shadow: 0 1px 2px rgba(10, 13, 18, 0.06), 0 8px 24px -12px rgba(10, 13, 18, 0.18);
  --blob-opacity: 0.5;
  --blob-blend: multiply;
}

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
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::selection {
  background: var(--accent);
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
  font-family: var(--sans);
}

p {
  margin: 0;
}

button {
  font-family: inherit;
}

.wrap {
  position: relative;
  z-index: 1;
}

.shell {
  max-width: 1100px;
  margin: 0 auto;
  padding-inline: 24px;
}

.eyebrow {
  font-family: var(--mono);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 0.6em;
}

section {
  padding: 96px 0;
  border-bottom: 1px solid var(--line);
  position: relative;
}

section:last-of-type {
  border-bottom: none;
}

.section-head {
  margin-bottom: 44px;
  max-width: 640px;
}

.section-head h2 {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 10px;
}

.lede {
  color: var(--fg-muted);
  font-size: 1rem;
  line-height: 1.65;
  margin-top: 14px;
  max-width: 56ch;
}

.btn {
  font-size: 0.92rem;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: var(--radius);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  cursor: pointer;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--accent);
  color: #1a0a02;
}

.btn-primary:hover {
  background: color-mix(in srgb, var(--accent) 88%, white 12%);
}

.btn-ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--fg);
}

.btn-ghost:hover {
  border-color: color-mix(in srgb, var(--accent) 50%, var(--line));
}

.pill {
  font-family: var(--mono);
  font-size: 0.8rem;
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--accent-2);
  background: var(--bg-raised-2);
}

.chip-btn {
  font-family: var(--mono);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--bg-raised);
  border: 1px solid var(--line);
  color: var(--fg-muted);
  border-radius: 999px;
  padding: 7px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.chip-btn:hover {
  color: var(--fg);
  border-color: color-mix(in srgb, var(--accent) 50%, var(--line));
}

.chip-btn:focus-visible,
a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

Note: the prototype's `.reveal`/`.reveal.is-visible` CSS classes (opacity/transform toggled by a vanilla-JS `IntersectionObserver`) are intentionally **not** ported here. Task 7 replaces that mechanism with a Framer Motion `<Reveal>` component that drives the same fade/slide-up effect — and its own `prefers-reduced-motion` fallback — via inline animation props, so a parallel CSS-class version would be dead code.

- [ ] **Step 2: Verify base styles compile**

Run: `npm run dev`, visit `http://localhost:3000`.
Expected: page background is the light paper color (`#eef0ec`) and text renders in the system sans font; no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add design tokens and base styles"
```

---

### Task 3: next-intl routing

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `src/messages/en.json`
- Create: `src/messages/vi.json`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Modify: `next.config.ts`
- Delete: `src/app/layout.tsx`, `src/app/page.tsx` (superseded by the `[locale]` versions)

**Interfaces:**
- Produces: `routing.locales: readonly ["en", "vi"]`, `routing.defaultLocale: "en"`; `Link`, `usePathname`, `useRouter`, `redirect` from `@/i18n/navigation`; every later section/component reads strings via `useTranslations("<namespace>")` (client) or `getTranslations("<namespace>")` (server) against the namespaces defined in Step 5 below.

- [ ] **Step 1: Create `src/i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
});
```

- [ ] **Step 2: Create `src/i18n/navigation.ts`**

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

- [ ] **Step 3: Create `src/i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

function isSupportedLocale(value: string | undefined): boolean {
  return value !== undefined && (routing.locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isSupportedLocale(requested) ? (requested as string) : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create `src/middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 5: Create `src/messages/en.json`**

```json
{
  "nav": {
    "about": "About",
    "projects": "Projects",
    "experience": "Experience",
    "contact": "Contact"
  },
  "hero": {
    "eyebrow": "Portfolio — 2026",
    "hi": "Hi, I'm",
    "role": "Full-stack engineer building fast, quiet software.",
    "pitch": "I design and ship web products end to end — from database schema to the last pixel of the interface. Lately: developer tools, dashboards, and systems that stay fast under real load.",
    "ctaProjects": "View projects",
    "ctaContact": "Get in touch",
    "statYears": "years shipping",
    "statProjects": "projects launched",
    "statTeams": "teams led"
  },
  "about": {
    "eyebrow": "About",
    "title": "Background & approach",
    "p1": "I started out fixing WordPress themes for friends and ended up leading platform teams at two Series-B startups. I care about systems that are boring in the right places — predictable deploys, readable code, dashboards nobody has to babysit.",
    "p2": "Outside of work I write short technical notes on distributed systems and mentor junior engineers switching into backend roles.",
    "stackLabel": "Tech stack"
  },
  "focus": {
    "eyebrow": "Focus areas",
    "title": "What I obsess over"
  },
  "projects": {
    "eyebrow": "Selected work",
    "title": "Projects",
    "lede": "A few things I've built recently. Open a case study for the full story.",
    "viewCaseStudy": "View case study",
    "back": "← Back to projects"
  },
  "experience": {
    "eyebrow": "Career",
    "title": "Work experience"
  },
  "contact": {
    "eyebrow": "Contact",
    "title": "Let's talk",
    "blurb": "Open to full-time roles and select freelance work. Fastest way to reach me is email."
  },
  "footer": {
    "built": "built with Next.js & Tailwind",
    "top": "↑ back to top"
  },
  "caseStudy": {
    "role": "Role",
    "period": "Period",
    "stack": "Stack"
  }
}
```

- [ ] **Step 6: Create `src/messages/vi.json`**

```json
{
  "nav": {
    "about": "Giới thiệu",
    "projects": "Dự án",
    "experience": "Kinh nghiệm",
    "contact": "Liên hệ"
  },
  "hero": {
    "eyebrow": "Portfolio — 2026",
    "hi": "Xin chào, tôi là",
    "role": "Kỹ sư full-stack, xây phần mềm nhanh và gọn.",
    "pitch": "Tôi thiết kế và triển khai sản phẩm web trọn vẹn — từ schema cơ sở dữ liệu đến từng pixel giao diện. Gần đây: công cụ cho developer, dashboard, và các hệ thống chịu tải thật tốt.",
    "ctaProjects": "Xem dự án",
    "ctaContact": "Liên hệ ngay",
    "statYears": "năm kinh nghiệm",
    "statProjects": "dự án đã ra mắt",
    "statTeams": "đội đã dẫn dắt"
  },
  "about": {
    "eyebrow": "Giới thiệu",
    "title": "Quá trình & cách tiếp cận",
    "p1": "Tôi bắt đầu bằng việc sửa theme WordPress cho bạn bè, rồi dần dẫn dắt đội platform tại hai startup giai đoạn Series-B. Tôi quan tâm đến những hệ thống \"nhàm chán đúng chỗ\" — deploy dễ đoán, code dễ đọc, dashboard không cần ai canh chừng.",
    "p2": "Ngoài công việc, tôi viết ghi chú kỹ thuật ngắn về hệ thống phân tán và mentor các kỹ sư trẻ chuyển sang backend.",
    "stackLabel": "Công nghệ"
  },
  "focus": {
    "eyebrow": "Trọng tâm",
    "title": "Những điều tôi chú trọng"
  },
  "projects": {
    "eyebrow": "Dự án tiêu biểu",
    "title": "Dự án",
    "lede": "Một vài sản phẩm tôi làm gần đây. Mở case study để xem đầy đủ.",
    "viewCaseStudy": "Xem case study",
    "back": "← Quay lại dự án"
  },
  "experience": {
    "eyebrow": "Sự nghiệp",
    "title": "Kinh nghiệm làm việc"
  },
  "contact": {
    "eyebrow": "Liên hệ",
    "title": "Cùng trao đổi nhé",
    "blurb": "Sẵn sàng cho vị trí full-time và một số dự án freelance chọn lọc. Cách nhanh nhất để liên hệ là qua email."
  },
  "footer": {
    "built": "xây dựng với Next.js & Tailwind",
    "top": "↑ về đầu trang"
  },
  "caseStudy": {
    "role": "Vai trò",
    "period": "Thời gian",
    "stack": "Công nghệ"
  }
}
```

- [ ] **Step 7: Create `src/app/[locale]/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "Alex Tran — Portfolio",
  description: "Full-stack engineer building fast, quiet software.",
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <div className="wrap">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

(`ThemeProvider` and `AnimatedBackground` are added to this layout in Tasks 4 and 5.)

- [ ] **Step 8: Create `src/app/[locale]/page.tsx`**

```tsx
export default function Home() {
  return (
    <main id="top">
      <p style={{ padding: 40 }}>Locale routing OK</p>
    </main>
  );
}
```

- [ ] **Step 9: Delete the placeholder root layout/page**

Run: `rm src/app/layout.tsx src/app/page.tsx` (Windows PowerShell: `Remove-Item src/app/layout.tsx, src/app/page.tsx`)

- [ ] **Step 10: Wrap `next.config.ts` with the next-intl plugin**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 11: Verify locale routing**

Run: `npm run dev`, then visit:
- `http://localhost:3000/` → redirects to `/en`, shows "Locale routing OK".
- `http://localhost:3000/vi` → shows "Locale routing OK" with `<html lang="vi">` (check via devtools).
- `http://localhost:3000/fr` → 404.

- [ ] **Step 12: Commit**

```bash
git add src/i18n src/messages src/middleware.ts src/app next.config.ts
git commit -m "feat: add next-intl locale routing"
```

---

### Task 4: Shared `cn()` helper and theme system

**Files:**
- Create: `src/utils/cn.ts`
- Create: `src/features/portfolio/components/theme-provider.tsx`
- Create: `src/features/portfolio/components/theme-toggle.tsx`
- Create: `src/components/icons/icon-sun.tsx`
- Create: `src/components/icons/icon-moon.tsx`
- Create: `src/features/portfolio/components/index.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `.chip-btn`, `.chip-btn:focus-visible` from Task 2 globals.
- Produces: `cn(...classes: Array<string | false | null | undefined>): string` from `@/utils/cn` — the shared styling helper every later conditional-className task uses. `<ThemeProvider>` (wraps children, sets `data-theme` on `<html>`); `<ThemeToggle />` (self-contained button, no props) — both re-exported from `@/features/portfolio/components` and imported by the Nav component in Task 8. `IconSun`, `IconMoon` from `@/components/icons/icon-sun` / `icon-moon` (`ComponentProps<"svg">` props, per `CLAUDE.md`'s icon convention).

- [ ] **Step 1: Create `src/utils/cn.ts`**

```ts
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
```

- [ ] **Step 2: Add theme-icon CSS to `src/app/globals.css`**

```css
.theme-icon {
  width: 14px;
  height: 14px;
}
```

- [ ] **Step 3: Create `src/components/icons/icon-sun.tsx`**

```tsx
import type { ComponentProps } from "react";

export function IconSun(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
```

- [ ] **Step 4: Create `src/components/icons/icon-moon.tsx`**

```tsx
import type { ComponentProps } from "react";

export function IconMoon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
    </svg>
  );
}
```

- [ ] **Step 5: Create `src/features/portfolio/components/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 6: Create `src/features/portfolio/components/theme-toggle.tsx`**

```tsx
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
```

(The `isMounted` guard avoids a server/client markup mismatch, since the resolved theme is only known in the browser.)

- [ ] **Step 7: Create `src/features/portfolio/components/index.ts`**

```ts
export { ThemeProvider } from "./theme-provider";
export { ThemeToggle } from "./theme-toggle";
```

(This barrel gains one line per component in every task from here on — Tasks 5, 7, 8, 9, 10, 11, 12, 14, 15.)

- [ ] **Step 8: Wire `ThemeProvider` into the locale layout**

In `src/app/[locale]/layout.tsx`, import and wrap:

```tsx
import { ThemeProvider } from "@/features/portfolio/components";
```

Change the body contents to:

```tsx
<body>
  <ThemeProvider>
    <NextIntlClientProvider>
      <div className="wrap">{children}</div>
    </NextIntlClientProvider>
  </ThemeProvider>
</body>
```

- [ ] **Step 9: Temporarily render `<ThemeToggle />` on the placeholder home page to verify it**

In `src/app/[locale]/page.tsx`, add the import and render it under the existing text:

```tsx
import { ThemeToggle } from "@/features/portfolio/components";

export default function Home() {
  return (
    <main id="top">
      <p style={{ padding: 40 }}>Locale routing OK</p>
      <div style={{ padding: 40 }}>
        <ThemeToggle />
      </div>
    </main>
  );
}
```

- [ ] **Step 10: Verify theme toggling**

Run: `npm run dev`, visit `/en`.
Expected: clicking the toggle flips the page background between the light paper color and the dark ink color, and the icon swaps between sun and moon. Reload the page — the chosen theme persists. Clear `localStorage` and set the OS to dark mode — the page loads dark without clicking anything.

- [ ] **Step 11: Revert the temporary `ThemeToggle` render on the home page**

Remove the `<ThemeToggle />` block added in Step 9 (it moves into `Nav` in Task 8) — `src/app/[locale]/page.tsx` goes back to just the "Locale routing OK" paragraph.

- [ ] **Step 12: Commit**

```bash
git add src/utils/cn.ts src/components/icons src/features/portfolio/components src/app/globals.css src/app/[locale]/layout.tsx src/app/[locale]/page.tsx
git commit -m "feat: add cn() helper and light/dark theme system"
```

---

### Task 5: Animated background

**Files:**
- Create: `src/features/portfolio/components/animated-background.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `<AnimatedBackground />` (no props, renders the fixed blob layer) — rendered once in the locale layout, above `children`.

- [ ] **Step 1: Add background CSS to `src/app/globals.css`**

```css
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
  background: var(--blob-1);
  animation: driftA 11s ease-in-out infinite alternate;
}

.blob-b {
  width: 40vw;
  height: 40vw;
  right: -10vw;
  top: 10vw;
  background: var(--blob-2);
  animation: driftB 13s ease-in-out infinite alternate;
}

.blob-c {
  width: 32vw;
  height: 32vw;
  left: 22vw;
  bottom: -16vw;
  background: var(--blob-3);
  opacity: calc(var(--blob-opacity) * 0.75);
  animation: driftC 15s ease-in-out infinite alternate;
}

.blob-d {
  width: 30vw;
  height: 30vw;
  right: 12vw;
  bottom: -10vw;
  background: var(--blob-4);
  opacity: calc(var(--blob-opacity) * 0.7);
  animation: driftD 17s ease-in-out infinite alternate;
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

@media (prefers-reduced-motion: reduce) {
  .blob-a, .blob-b, .blob-c, .blob-d {
    animation: none;
  }
}
```

- [ ] **Step 2: Create `src/features/portfolio/components/animated-background.tsx`**

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

(Plain CSS keyframes, not Framer Motion: the animation is a fire-and-forget infinite loop with no interaction or React state involved, so CSS is the simpler and cheaper tool — Framer Motion is reserved for scroll-driven and hover-driven motion in later tasks.)

- [ ] **Step 3: Add the export to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { AnimatedBackground } from "./animated-background";
```

- [ ] **Step 4: Render it in the locale layout**

In `src/app/[locale]/layout.tsx`, add `AnimatedBackground` to the existing `@/features/portfolio/components` import:

```tsx
import { ThemeProvider, AnimatedBackground } from "@/features/portfolio/components";
```

```tsx
<body>
  <ThemeProvider>
    <NextIntlClientProvider>
      <AnimatedBackground />
      <div className="wrap">{children}</div>
    </NextIntlClientProvider>
  </ThemeProvider>
</body>
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, visit `/en`.
Expected: four soft, blurred colored blobs drift slowly behind the page content in both light and dark mode (toggle to confirm both), crossing paths periodically. In OS/browser reduced-motion mode, the blobs are static (no animation) but still visible.

- [ ] **Step 6: Commit**

```bash
git add src/features/portfolio/components src/app/globals.css src/app/[locale]/layout.tsx
git commit -m "feat: add animated gradient background"
```

---

### Task 6: Content data layer

**Files:**
- Create: `src/features/portfolio/types/content.ts`
- Create: `src/features/portfolio/constants/tech-stack.ts`
- Create: `src/features/portfolio/constants/keywords.ts`
- Create: `src/features/portfolio/content/experience/en.json`
- Create: `src/features/portfolio/content/experience/vi.json`
- Create: `src/features/portfolio/utils/experience.ts`
- Create: `src/features/portfolio/content/projects/en/realtime-order-dashboard.mdx`
- Create: `src/features/portfolio/content/projects/en/api-mock-cli.mdx`
- Create: `src/features/portfolio/content/projects/en/ecommerce-migration.mdx`
- Create: `src/features/portfolio/content/projects/vi/realtime-order-dashboard.mdx`
- Create: `src/features/portfolio/content/projects/vi/api-mock-cli.mdx`
- Create: `src/features/portfolio/content/projects/vi/ecommerce-migration.mdx`
- Create: `src/features/portfolio/utils/projects.ts`
- Modify: `src/app/[locale]/page.tsx` (temporary verification render — this task's version persists as the working `page.tsx` through Task 7 and is replaced in Task 8)

**Interfaces:**
- Produces:
  - `techStack: TechBadge[]` where `TechBadge` is an `interface { name: string; short: string; bg: string; fg: string }`
  - `focusKeywords: Record<"en" | "vi", string[]>`
  - `getExperience(locale: string): ExperienceEntry[]` where `ExperienceEntry` is an `interface { company: string; role: string; period: string; bullets: string[] }`
  - `getAllProjectsMeta(locale: string): ProjectMeta[]` where `ProjectMeta extends ProjectFrontmatter` and adds `{ slug: string }`
  - `getProjectSlugs(locale: string): string[]`
  - `getProjectSource(locale: string, slug: string): string` (raw MDX file contents including frontmatter, for `compileMDX` in Task 13)
  - `ProjectFrontmatter` is an `interface { title: string; summary: string; tech: string[]; githubUrl?: string; demoUrl?: string; image?: string; periods: string[]; country: { flag: string; name: string }; role: string; stack: string; hasPhoto: boolean }`

- [ ] **Step 1: Create `src/features/portfolio/types/content.ts`**

```ts
export interface ProjectFrontmatter {
  title: string;
  summary: string;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  periods: string[];
  country: { flag: string; name: string };
  role: string;
  stack: string;
  hasPhoto: boolean;
}

export interface ProjectMeta extends ProjectFrontmatter {
  slug: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface TechBadge {
  name: string;
  short: string;
  bg: string;
  fg: string;
}
```

- [ ] **Step 2: Create `src/features/portfolio/constants/tech-stack.ts`**

```ts
import type { TechBadge } from "@/features/portfolio/types/content";

export const techStack: TechBadge[] = [
  { name: "Next.js", short: "N", bg: "#12141a", fg: "#ffffff" },
  { name: "TypeScript", short: "TS", bg: "#2b5f9e", fg: "#ffffff" },
  { name: "Node.js", short: "JS", bg: "#2f6b30", fg: "#ffffff" },
  { name: "PostgreSQL", short: "Pg", bg: "#2c5478", fg: "#ffffff" },
  { name: "Redis", short: "Rd", bg: "#a92a20", fg: "#ffffff" },
  { name: "Docker", short: "Dk", bg: "#1f6fb8", fg: "#ffffff" },
  { name: "AWS", short: "AWS", bg: "#e08900", fg: "#1a0a02" },
  { name: "Go", short: "Go", bg: "#007d99", fg: "#ffffff" },
];
```

- [ ] **Step 3: Create `src/features/portfolio/constants/keywords.ts`**

```ts
export const focusKeywords: Record<"en" | "vi", string[]> = {
  en: ["Accessibility", "Performance", "Interface", "Frontend", "Backend", "Security", "Scalability", "Design Systems"],
  vi: ["Khả năng tiếp cận", "Hiệu năng", "Giao diện", "Frontend", "Backend", "Bảo mật", "Khả năng mở rộng", "Design System"],
};
```

- [ ] **Step 4: Create `src/features/portfolio/content/experience/en.json`**

```json
[
  {
    "company": "Northlane",
    "role": "Staff Software Engineer",
    "period": "2023 — Present",
    "bullets": [
      "Lead a team of 5 across the checkout and fulfillment platform",
      "Cut deploy time from 22min to 4min by rebuilding the CI pipeline",
      "Set the technical direction for the realtime dashboard rewrite"
    ]
  },
  {
    "company": "Fernbridge",
    "role": "Senior Backend Engineer",
    "period": "2020 — 2023",
    "bullets": [
      "Owned the payments service processing ~$40M/year in volume",
      "Migrated core services from monolith to a Go microservice split",
      "Mentored 3 junior engineers, two promoted within a year"
    ]
  },
  {
    "company": "Loop Studio",
    "role": "Full-stack Developer",
    "period": "2018 — 2020",
    "bullets": [
      "Built and shipped 12+ client web apps end to end",
      "Introduced automated testing, reducing production bugs by ~30%"
    ]
  }
]
```

- [ ] **Step 5: Create `src/features/portfolio/content/experience/vi.json`**

```json
[
  {
    "company": "Northlane",
    "role": "Staff Software Engineer",
    "period": "2023 — Hiện tại",
    "bullets": [
      "Dẫn dắt đội 5 người phụ trách nền tảng checkout và xử lý đơn",
      "Giảm thời gian deploy từ 22 phút xuống 4 phút nhờ xây lại CI pipeline",
      "Định hướng kỹ thuật cho việc viết lại dashboard realtime"
    ]
  },
  {
    "company": "Fernbridge",
    "role": "Senior Backend Engineer",
    "period": "2020 — 2023",
    "bullets": [
      "Phụ trách payments service xử lý ~40 triệu USD/năm",
      "Chuyển các service lõi từ monolith sang microservice bằng Go",
      "Mentor 3 kỹ sư trẻ, hai người được thăng chức trong vòng một năm"
    ]
  },
  {
    "company": "Loop Studio",
    "role": "Full-stack Developer",
    "period": "2018 — 2020",
    "bullets": [
      "Xây và triển khai trọn vẹn hơn 12 web app cho khách hàng",
      "Đưa automated testing vào quy trình, giảm ~30% lỗi production"
    ]
  }
]
```

- [ ] **Step 6: Create `src/features/portfolio/utils/experience.ts`**

```ts
import experienceEn from "@/features/portfolio/content/experience/en.json";
import experienceVi from "@/features/portfolio/content/experience/vi.json";
import type { ExperienceEntry } from "@/features/portfolio/types/content";

const experienceByLocale: Record<string, ExperienceEntry[]> = {
  en: experienceEn,
  vi: experienceVi,
};

export function getExperience(locale: string): ExperienceEntry[] {
  return experienceByLocale[locale] ?? experienceByLocale.en;
}
```

- [ ] **Step 7: Create the three English project MDX files**

`src/features/portfolio/content/projects/en/realtime-order-dashboard.mdx`:

```
---
title: "Realtime Order Dashboard"
summary: "Live order + inventory dashboard for a mid-size e-commerce team, replacing a 40s manual refresh with sub-second updates streamed straight to the warehouse floor."
tech: ["Next.js", "WebSocket", "PostgreSQL"]
githubUrl: "https://github.com/alextran/realtime-order-dashboard"
periods: ["2025"]
country:
  flag: "🇺🇸"
  name: "United States"
role: "Lead engineer"
stack: "Next.js, Node.js, WebSocket, PostgreSQL"
hasPhoto: true
---

## Problem

Warehouse staff were refreshing a static admin page every few minutes to catch new orders, causing fulfillment delays during peak hours.

## Approach

Built a WebSocket layer over the existing order service and a dashboard that streams order and stock changes directly to the floor, with offline queueing for spotty warehouse wifi.

## Result

Average time-to-fulfillment dropped by 34%, and the manual refresh workaround was retired entirely.
```

`src/features/portfolio/content/projects/en/api-mock-cli.mdx`:

```
---
title: "Open-source CLI for API mocking"
summary: "A CLI that spins up a mock API server from an OpenAPI spec in one command, used by roughly 1,200 developers across several companies."
tech: ["Go", "OpenAPI", "CLI"]
githubUrl: "https://github.com/alextran/api-mock-cli"
periods: ["2023", "2024"]
country:
  flag: "🌐"
  name: "Remote / Open source"
role: "Creator & maintainer"
stack: "Go, OpenAPI, Cobra"
hasPhoto: false
---

## Problem

Frontend teams were blocked waiting on backend endpoints during early sprints, with no lightweight way to fake real responses.

## Approach

Wrote a single-binary Go CLI that reads an OpenAPI spec and serves realistic mock responses, with request recording for later contract tests.

## Result

Adopted by several teams outside my own company; now sits at 1.2k GitHub stars and a small but active contributor base.
```

`src/features/portfolio/content/projects/en/ecommerce-migration.mdx`:

```
---
title: "E-commerce platform migration"
summary: "Migrated a legacy PHP storefront to a headless Next.js frontend without downtime, across three brand storefronts sharing one codebase."
tech: ["Next.js", "GraphQL", "Docker"]
githubUrl: "https://github.com/alextran/ecommerce-migration"
periods: ["2024"]
country:
  flag: "🇻🇳"
  name: "Vietnam"
role: "Tech lead"
stack: "Next.js, GraphQL, Docker, AWS"
hasPhoto: false
---

## Problem

An aging PHP monolith was slowing every new feature and made it hard to run experiments across three storefronts sharing one codebase.

## Approach

Introduced a headless commerce API and rebuilt the frontend in Next.js incrementally, storefront by storefront, behind a routing proxy so nothing went down.

## Result

Page load times fell by roughly half and the team shipped storefront experiments independently for the first time.
```

- [ ] **Step 8: Create the three Vietnamese project MDX files**

`src/features/portfolio/content/projects/vi/realtime-order-dashboard.mdx`:

```
---
title: "Dashboard đơn hàng thời gian thực"
summary: "Dashboard đơn hàng và tồn kho realtime cho đội thương mại điện tử cỡ vừa, thay refresh thủ công 40 giây bằng cập nhật dưới 1 giây xuống thẳng sàn kho."
tech: ["Next.js", "WebSocket", "PostgreSQL"]
githubUrl: "https://github.com/alextran/realtime-order-dashboard"
periods: ["2025"]
country:
  flag: "🇺🇸"
  name: "Mỹ"
role: "Kỹ sư chính"
stack: "Next.js, Node.js, WebSocket, PostgreSQL"
hasPhoto: true
---

## Vấn đề

Nhân viên kho phải refresh trang admin tĩnh mỗi vài phút để bắt đơn mới, gây chậm trễ khâu xử lý vào giờ cao điểm.

## Cách tiếp cận

Xây lớp WebSocket trên order service hiện có và dashboard stream trực tiếp thay đổi đơn hàng/tồn kho xuống sàn kho, có hàng đợi offline cho wifi kho chập chờn.

## Kết quả

Thời gian xử lý đơn trung bình giảm 34%, và cách refresh thủ công được loại bỏ hoàn toàn.
```

`src/features/portfolio/content/projects/vi/api-mock-cli.mdx`:

```
---
title: "CLI mã nguồn mở để mock API"
summary: "CLI dựng mock API server từ OpenAPI spec chỉ với một lệnh, khoảng 1.200 developer ở nhiều công ty đang dùng."
tech: ["Go", "OpenAPI", "CLI"]
githubUrl: "https://github.com/alextran/api-mock-cli"
periods: ["2023", "2024"]
country:
  flag: "🌐"
  name: "Từ xa / Mã nguồn mở"
role: "Người tạo & duy trì"
stack: "Go, OpenAPI, Cobra"
hasPhoto: false
---

## Vấn đề

Đội frontend hay bị chặn tiến độ vì chờ endpoint backend ở đầu sprint, chưa có cách giả lập response gọn nhẹ.

## Cách tiếp cận

Viết CLI Go dạng single-binary đọc OpenAPI spec và trả response mock hợp lý, có ghi lại request để làm contract test sau này.

## Kết quả

Được vài đội ngoài công ty tôi sử dụng; hiện đạt 1.2k sao GitHub và một nhóm contributor nhỏ nhưng tích cực.
```

`src/features/portfolio/content/projects/vi/ecommerce-migration.mdx`:

```
---
title: "Di chuyển nền tảng thương mại điện tử"
summary: "Chuyển storefront PHP cũ sang frontend Next.js headless mà không downtime, trên ba storefront thương hiệu dùng chung codebase."
tech: ["Next.js", "GraphQL", "Docker"]
githubUrl: "https://github.com/alextran/ecommerce-migration"
periods: ["2024"]
country:
  flag: "🇻🇳"
  name: "Việt Nam"
role: "Tech lead"
stack: "Next.js, GraphQL, Docker, AWS"
hasPhoto: false
---

## Vấn đề

Monolith PHP cũ làm chậm mọi tính năng mới và khó chạy thử nghiệm trên ba storefront dùng chung một codebase.

## Cách tiếp cận

Đưa vào API commerce headless và xây lại frontend bằng Next.js dần dần, từng storefront một, sau một proxy định tuyến để không gây gián đoạn.

## Kết quả

Thời gian tải trang giảm khoảng một nửa, và đội có thể chạy thử nghiệm từng storefront độc lập lần đầu tiên.
```

- [ ] **Step 9: Create `src/features/portfolio/utils/projects.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ProjectFrontmatter, ProjectMeta } from "@/features/portfolio/types/content";

const PROJECTS_DIR = path.join(process.cwd(), "src/features/portfolio/content/projects");

export function getProjectSlugs(locale: string): string[] {
  const dir = path.join(PROJECTS_DIR, locale);

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjectSource(locale: string, slug: string): string {
  const filePath = path.join(PROJECTS_DIR, locale, `${slug}.mdx`);

  return fs.readFileSync(filePath, "utf8");
}

export function getAllProjectsMeta(locale: string): ProjectMeta[] {
  return getProjectSlugs(locale).map((slug) => {
    const source = getProjectSource(locale, slug);
    const { data } = matter(source);

    return { slug, ...(data as ProjectFrontmatter) };
  });
}
```

- [ ] **Step 10: Verify the data layer loads without errors**

Temporarily add this to `src/app/[locale]/page.tsx` (removed again in Task 9 when `Hero`/`Projects` take over the page):

```tsx
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";
import { getExperience } from "@/features/portfolio/utils/experience";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const projects = getAllProjectsMeta(locale);
  const experience = getExperience(locale);

  return (
    <main id="top">
      <p style={{ padding: 40 }}>
        {projects.length} projects, {experience.length} experience entries loaded for locale &quot;{locale}&quot;.
      </p>
    </main>
  );
}
```

Run: `npm run dev`, visit `/en` and `/vi`.
Expected: both show "3 projects, 3 experience entries loaded for locale ...". No server errors in the terminal.

- [ ] **Step 11: Commit**

```bash
git add src/features/portfolio/types src/features/portfolio/constants src/features/portfolio/content src/features/portfolio/utils src/app/[locale]/page.tsx
git commit -m "feat: add project MDX and experience content with typed loaders"
```

---

### Task 7: Reveal (scroll-reveal wrapper)

**Files:**
- Create: `src/features/portfolio/components/reveal.tsx`
- Modify: `src/features/portfolio/components/index.ts`

**Interfaces:**
- Produces: `<Reveal>{children}</Reveal>` (`RevealProps = { children: ReactNode; className?: string; delay?: number }`) — a client component used by About, Projects, Experience, and Contact sections in Tasks 10–15 to fade/slide content in as it scrolls into view.

- [ ] **Step 1: Create `src/features/portfolio/components/reveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Add the export to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { Reveal } from "./reveal";
```

- [ ] **Step 3: Verify in isolation**

Temporarily render three stacked `<Reveal>` blocks with tall spacer `<div>`s between them in `src/app/[locale]/page.tsx`:

```tsx
import { Reveal } from "@/features/portfolio/components";

export default function Home() {
  return (
    <main id="top">
      <div style={{ height: "100vh" }} />
      <Reveal>
        <p style={{ padding: 40 }}>Reveal test</p>
      </Reveal>
      <div style={{ height: "100vh" }} />
    </main>
  );
}
```

Run: `npm run dev`, visit `/en`, scroll down.
Expected: "Reveal test" fades and slides up into view as it crosses into the viewport, and stays visible when scrolling back up. With OS reduced-motion enabled, it's visible immediately with no animation.

- [ ] **Step 4: Revert the temporary render**

`src/app/[locale]/page.tsx` goes back to the Task 6 Step 10 version (project/experience count check) — `Reveal` gets its real usage starting in Task 10.

- [ ] **Step 5: Commit**

```bash
git add src/features/portfolio/components
git commit -m "feat: add Reveal scroll-in-view animation wrapper"
```

---

### Task 8: Nav

**Files:**
- Create: `src/features/portfolio/hooks/use-scroll-spy.ts`
- Create: `src/features/portfolio/components/locale-switcher.tsx`
- Create: `src/features/portfolio/components/nav.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/page.tsx` (render `<Nav />` for real verification)

**Interfaces:**
- Consumes: `<ThemeToggle />` (Task 4), `.chip-btn` (Task 2), `cn()` (Task 4).
- Produces: `<Nav />` (no props) — rendered once at the top of the home page in Task 9 onward. `useScrollSpy(sectionIds: string[], navSelector: string): string | null`.

- [ ] **Step 1: Add nav CSS to `src/app/globals.css`**

```css
header.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(7px) saturate(140%);
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  border-bottom: 1px solid var(--line);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.mark {
  font-family: var(--mono);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.mark .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  font-size: 0.88rem;
  color: var(--fg-muted);
  position: relative;
  padding: 4px 2px;
}

.nav-links a:hover,
.nav-links a:focus-visible {
  color: var(--fg);
}

.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.nav-links a:hover::after,
.nav-links a:focus-visible::after {
  transform: scaleX(1);
}

.nav-links a.active {
  color: var(--fg);
}

.nav-links a.active::after {
  transform: scaleX(1);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hamburger {
  display: none;
}

@media (max-width: 760px) {
  .nav-links {
    display: none;
  }

  .hamburger {
    display: inline-flex;
  }

  .nav-links.open {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--line);
    padding: 16px 24px;
    gap: 16px;
  }
}
```

- [ ] **Step 2: Create `src/features/portfolio/hooks/use-scroll-spy.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[], navSelector: string): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const navElement = document.querySelector<HTMLElement>(navSelector);
    const navHeight = navElement?.offsetHeight ?? 64;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `-${navHeight}px 0px -50% 0px`, threshold: 0 }
    );

    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
    // sectionIds is a module-level constant array in every caller; re-running
    // this effect per render would just re-observe the same elements.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navSelector, sectionIds.join(",")]);

  return activeId;
}
```

- [ ] **Step 3: Create `src/features/portfolio/components/locale-switcher.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `src/features/portfolio/components/nav.tsx`**

```tsx
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
```

(The `#about`/`#projects`/`#experience`/`#contact`/`#top` links stay plain `<a>` — they are same-page hash anchors, not route navigation, so `next-intl`'s `Link` doesn't apply; see `CLAUDE.md`'s Internal links convention.)

- [ ] **Step 5: Add the exports to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { LocaleSwitcher } from "./locale-switcher";
export { Nav } from "./nav";
```

- [ ] **Step 6: Render `<Nav />` for verification**

Replace `src/app/[locale]/page.tsx` with:

```tsx
import { Nav } from "@/features/portfolio/components";
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";
import { getExperience } from "@/features/portfolio/utils/experience";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const projects = getAllProjectsMeta(locale);
  const experience = getExperience(locale);

  return (
    <main id="top">
      <Nav />
      <section id="about" style={{ height: "60vh" }}>
        <p>About ({projects.length} projects, {experience.length} experience)</p>
      </section>
      <section id="projects" style={{ height: "60vh" }}>
        <p>Projects</p>
      </section>
      <section id="experience" style={{ height: "60vh" }}>
        <p>Experience</p>
      </section>
      <section id="contact" style={{ height: "60vh" }}>
        <p>Contact</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run dev`, visit `/en`.
Expected: sticky nav with logo, four links, EN/VI toggle, theme toggle. Clicking EN/VI navigates between `/en` and `/vi` and swaps nav label language. Scrolling down highlights each nav link as its section's top clears the nav (per the offset logic from the spec). Resize below 760px width — links collapse behind a hamburger button that opens/closes a dropdown.

- [ ] **Step 8: Commit**

```bash
git add src/features/portfolio/hooks src/features/portfolio/components src/app/globals.css src/app/[locale]/page.tsx
git commit -m "feat: add sticky nav with scrollspy, locale switcher, theme toggle"
```

---

### Task 9: Hero section

**Files:**
- Create: `src/features/portfolio/components/hero.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Produces: `<Hero />` (no props) — rendered first inside `<main>` on the home page.

- [ ] **Step 1: Add hero CSS to `src/app/globals.css`**

```css
.hero {
  padding-top: 120px;
  padding-bottom: 110px;
  border-bottom: 1px solid var(--line);
}

.hero h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-top: 18px;
}

.hero h1 .accent {
  color: var(--accent);
}

.hero .pitch {
  margin-top: 22px;
  max-width: 58ch;
  font-size: 1.06rem;
  line-height: 1.7;
  color: var(--fg-muted);
}

.hero-ctas {
  display: flex;
  gap: 14px;
  margin-top: 34px;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  gap: 36px;
  margin-top: 56px;
  flex-wrap: wrap;
}

.stat .n {
  font-family: var(--mono);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--fg);
}

.stat .l {
  font-size: 0.86rem;
  color: var(--fg-muted);
  margin-top: 4px;
}

@media (max-width: 600px) {
  .hero-ctas {
    flex-wrap: nowrap;
  }

  .hero-ctas .btn {
    flex: 1 1 0;
  }

  .hero-stats {
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 10px;
  }

  .hero-stats .stat {
    flex: 1 1 0;
    text-align: center;
  }
}
```

- [ ] **Step 2: Create `src/features/portfolio/components/hero.tsx`**

```tsx
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="hero shell">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1>
        {t("hi")} <span className="accent">Alex Tran</span>.<br />
        {t("role")}
      </h1>
      <p className="pitch">{t("pitch")}</p>
      <div className="hero-ctas">
        <a className="btn btn-primary" href="#projects">
          {t("ctaProjects")}
        </a>
        <a className="btn btn-ghost" href="#contact">
          {t("ctaContact")}
        </a>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <div className="n">6+</div>
          <div className="l">{t("statYears")}</div>
        </div>
        <div className="stat">
          <div className="n">24</div>
          <div className="l">{t("statProjects")}</div>
        </div>
        <div className="stat">
          <div className="n">3</div>
          <div className="l">{t("statTeams")}</div>
        </div>
      </div>
    </section>
  );
}
```

(Server component — `useTranslations` from `next-intl` works in both server and client components; this one has no interactivity so it stays a server component for a smaller client bundle. The `#projects`/`#contact` CTAs are same-page hash anchors, so plain `<a>` per `CLAUDE.md`'s Internal links convention.)

- [ ] **Step 3: Add the export to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { Hero } from "./hero";
```

- [ ] **Step 4: Render it on the home page**

In `src/app/[locale]/page.tsx`, add `Hero` to the existing barrel import and replace the `<main>` contents:

```tsx
import { Nav, Hero } from "@/features/portfolio/components";
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";
import { getExperience } from "@/features/portfolio/utils/experience";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const projects = getAllProjectsMeta(locale);
  const experience = getExperience(locale);

  return (
    <main id="top">
      <Nav />
      <Hero />
      <section id="about" style={{ height: "60vh" }}>
        <p>About ({projects.length} projects, {experience.length} experience)</p>
      </section>
      <section id="projects" style={{ height: "60vh" }}>
        <p>Projects</p>
      </section>
      <section id="experience" style={{ height: "60vh" }}>
        <p>Experience</p>
      </section>
      <section id="contact" style={{ height: "60vh" }}>
        <p>Contact</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, visit `/en` and `/vi`.
Expected: hero renders name/tagline/pitch/CTAs/stats in the correct language. At a mobile width (< 600px), the two CTA buttons sit side by side at equal width, and the three stats sit in one equal-width row.

- [ ] **Step 6: Commit**

```bash
git add src/features/portfolio/components src/app/globals.css src/app/[locale]/page.tsx
git commit -m "feat: add hero section"
```

---

### Task 10: About + Tech stack

**Files:**
- Create: `src/features/portfolio/components/tech-stack.tsx`
- Create: `src/features/portfolio/components/about.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `<Reveal>` (Task 7), `techStack` (Task 6).
- Produces: `<About />` (no props) — replaces the placeholder `#about` section on the home page.

- [ ] **Step 1: Add About/TechStack CSS to `src/app/globals.css`**

```css
.about-copy {
  max-width: 68ch;
}

.tech-block {
  margin-top: 40px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 760px) {
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tech-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-raised);
}

.tech-glyph {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.74rem;
}

.tech-name {
  font-family: var(--mono);
  font-size: 0.86rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

- [ ] **Step 2: Create `src/features/portfolio/components/tech-stack.tsx`**

```tsx
import { techStack } from "@/features/portfolio/constants/tech-stack";

export function TechStack() {
  return (
    <div className="tech-grid">
      {techStack.map((tech) => (
        <div className="tech-badge" key={tech.name}>
          <span className="tech-glyph" style={{ background: tech.bg, color: tech.fg }}>
            {tech.short}
          </span>
          <span className="tech-name">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}
```

(`tech.bg`/`tech.fg` are per-badge brand colors sourced from the `techStack` constant, not hardcoded in the component — the same "one source" principle as the design tokens in `globals.css`, just data-driven instead of CSS-variable-driven because each badge needs its own brand color.)

- [ ] **Step 3: Create `src/features/portfolio/components/about.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { TechStack } from "@/features/portfolio/components/tech-stack";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="shell">
      <Reveal className="section-head">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
      </Reveal>
      <Reveal className="about-copy">
        <p className="lede">{t("p1")}</p>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("p2")}
        </p>
      </Reveal>
      <Reveal className="tech-block">
        <p className="eyebrow">{t("stackLabel")}</p>
        <TechStack />
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Add the exports to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { TechStack } from "./tech-stack";
export { About } from "./about";
```

- [ ] **Step 5: Render it on the home page**

In `src/app/[locale]/page.tsx`, add `About` to the barrel import and replace the placeholder `#about` `<section>`:

```tsx
import { Nav, Hero, About } from "@/features/portfolio/components";
```

```tsx
<Hero />
<About />
<section id="projects" style={{ height: "60vh" }}>
  <p>Projects</p>
</section>
```

- [ ] **Step 6: Verify**

Run: `npm run dev`, visit `/en`.
Expected: About section shows two bio paragraphs, then a "Tech stack" label and an 8-badge grid (4 columns desktop, 2 columns under 760px width), each badge showing a colored glyph + uppercase tech name. Scrolling the section into view fades/slides it in once. Switch to `/vi` — bio text and "Công nghệ" label are in Vietnamese; tech names stay in English (they're proper nouns, not translated — matches the content model).

- [ ] **Step 7: Commit**

```bash
git add src/features/portfolio/components src/app/globals.css src/app/[locale]/page.tsx
git commit -m "feat: add about section with tech stack grid"
```

---

### Task 11: Focus-areas marquee

**Files:**
- Create: `src/features/portfolio/components/focus-marquee.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `<Reveal>` (Task 7), `focusKeywords` (Task 6).
- Produces: `<FocusMarquee />` (no props), rendered between About and Projects on the home page. Renders its own `id="focus"` section (not part of the nav's scrollspy `SECTION_IDS` list — matches the spec, which doesn't give this section a nav link).

- [ ] **Step 1: Add marquee CSS to `src/app/globals.css`**

```css
.focus-section {
  overflow: hidden;
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

.marquee-item {
  font-family: var(--mono);
  font-weight: 700;
  font-size: clamp(1.6rem, 4.4vw, 2.7rem);
  letter-spacing: -0.01em;
  color: var(--fg-muted);
  display: flex;
  align-items: center;
  gap: 40px;
  white-space: nowrap;
  padding-right: 40px;
}

.marquee-item .dash {
  color: var(--accent);
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }

  .marquee {
    overflow-x: auto;
  }
}
```

- [ ] **Step 2: Create `src/features/portfolio/components/focus-marquee.tsx`**

```tsx
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { focusKeywords } from "@/features/portfolio/constants/keywords";

export function FocusMarquee() {
  const t = useTranslations("focus");
  const locale = useLocale() as "en" | "vi";
  const words = focusKeywords[locale] ?? focusKeywords.en;
  const trackWords = [...words, ...words];

  return (
    <section id="focus" className="focus-section">
      <div className="shell">
        <Reveal className="section-head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
        </Reveal>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {trackWords.map((word, index) => (
            <span className="marquee-item" key={`${word}-${index}`}>
              {word} <span className="dash">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

(The marquee track sits outside the `.shell` div — same structural trick as the prototype — so it bleeds full viewport width instead of being capped at 1100px.)

- [ ] **Step 3: Add the export to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { FocusMarquee } from "./focus-marquee";
```

- [ ] **Step 4: Render it on the home page**

In `src/app/[locale]/page.tsx`, add `FocusMarquee` to the barrel import:

```tsx
import { Nav, Hero, About, FocusMarquee } from "@/features/portfolio/components";
```

```tsx
<About />
<FocusMarquee />
<section id="projects" style={{ height: "60vh" }}>
  <p>Projects</p>
</section>
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, visit `/en`.
Expected: a full-bleed (edge-to-edge, not capped at the 1100px container) row of large mono keywords scrolling continuously leftward, looping seamlessly. Switch to `/vi` — words are the Vietnamese translations. With OS reduced-motion on, the track is static and horizontally scrollable instead of animating.

- [ ] **Step 6: Commit**

```bash
git add src/features/portfolio/components src/app/globals.css src/app/[locale]/page.tsx
git commit -m "feat: add focus-areas marquee section"
```

---

### Task 12: Project cards + Projects section

**Files:**
- Create: `src/features/portfolio/components/project-card.tsx`
- Create: `src/features/portfolio/components/projects.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `<Reveal>` (Task 7), `getAllProjectsMeta(locale)` → `ProjectMeta[]` (Task 6), `Link` from `@/i18n/navigation` (Task 3), `cn()` (Task 4).
- Produces: `<ProjectCard project={ProjectMeta} />` (`ProjectCardProps = { project: ProjectMeta }`), `<Projects projects={ProjectMeta[]} />` (`ProjectsProps = { projects: ProjectMeta[] }`) — `Projects` rendered on the home page with the same `projects` array already loaded in `page.tsx`.

- [ ] **Step 1: Add project-grid/card CSS to `src/app/globals.css`**

```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 720px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--bg-raised);
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow);
}

.card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
}

.card-media {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: none;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  transition: transform 0.45s ease;
}

.card:hover .card-image,
.card:focus-within .card-image {
  transform: scale(1.06);
}

@media (prefers-reduced-motion: reduce) {
  .card-image {
    transition: none;
  }

  .card:hover .card-image {
    transform: none;
  }
}

.card-image.has-photo {
  background: conic-gradient(from 210deg at 40% 40%, var(--accent), var(--accent-2), var(--accent));
}

.card-image.fallback {
  background: var(--bg-raised-2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.card-image.fallback span {
  font-family: var(--mono);
  font-weight: 700;
  letter-spacing: 0.01em;
  text-align: center;
  color: var(--fg-muted);
  font-size: clamp(1.1rem, 3.4vw, 1.6rem);
  line-height: 1.25;
}

.period-badges {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
}

.period-pill {
  font-family: var(--mono);
  font-size: 0.8rem;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(8, 10, 14, 0.65);
  color: #fff;
  backdrop-filter: blur(4px);
}

.case-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 7px 14px;
  border-radius: 999px;
  font-family: var(--mono);
  font-size: 0.82rem;
  background: rgba(8, 10, 14, 0.72);
  color: #fff;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.22s ease, transform 0.22s ease, background-color 0.22s ease, color 0.22s ease;
  backdrop-filter: blur(4px);
}

.card:hover .case-badge,
.card:focus-within .case-badge {
  opacity: 1;
  transform: translateY(0);
  background: var(--accent);
  color: #1a0a02;
}

@media (prefers-reduced-motion: reduce) {
  .case-badge {
    transition: none;
  }
}

.card-body {
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.card-body h3 {
  font-size: 1.12rem;
  font-weight: 700;
  transition: color 0.2s ease;
}

.card:hover .card-body h3,
.card:focus-within .card-body h3 {
  color: var(--accent);
}

.card-desc {
  color: var(--fg-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.card-meta-row {
  margin-top: auto;
  padding-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.country {
  font-size: 0.86rem;
  color: var(--fg-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-link {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--line);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 0.74rem;
  color: var(--fg-muted);
  text-decoration: none;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.icon-link:hover {
  color: var(--fg);
  border-color: color-mix(in srgb, var(--accent) 50%, var(--line));
}
```

- [ ] **Step 2: Create `src/features/portfolio/components/project-card.tsx`**

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

  return (
    <article className="card">
      <Link
        className="card-media"
        href={`/projects/${project.slug}`}
        aria-label={`${t("viewCaseStudy")}: ${project.title}`}
      >
        <div className={cn("card-image", project.hasPhoto ? "has-photo" : "fallback")} aria-hidden="true">
          {!project.hasPhoto && <span>{project.title}</span>}
        </div>
        <div className="period-badges">
          {project.periods.map((period) => (
            <span className="period-pill" key={period}>
              {period}
            </span>
          ))}
        </div>
        <span className="case-badge">{t("viewCaseStudy")} →</span>
      </Link>
      <div className="card-body">
        <h3>{project.title}</h3>
        <p className="card-desc">{project.summary}</p>
        <div className="card-tags">
          {project.tech.map((tech) => (
            <span className="pill" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className="card-meta-row">
          <span className="country">
            {project.country.flag} {project.country.name}
          </span>
          {project.githubUrl && (
            <a
              className="icon-link"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
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

(The whole media area is now a real link to `/projects/[slug]` rather than a modal trigger — Task 13 builds that destination page. The GitHub link is a plain `<a target="_blank">`, which is exactly the external-link exception in `CLAUDE.md`'s Internal links convention.)

- [ ] **Step 3: Create `src/features/portfolio/components/projects.tsx`**

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
    <section id="projects" className="shell">
      <Reveal className="section-head">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
        <p className="lede">{t("lede")}</p>
      </Reveal>
      <div className="project-grid">
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

- [ ] **Step 4: Add the exports to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { ProjectCard } from "./project-card";
export { Projects } from "./projects";
```

- [ ] **Step 5: Render it on the home page**

In `src/app/[locale]/page.tsx`, add `Projects` to the barrel import:

```tsx
import { Nav, Hero, About, FocusMarquee, Projects } from "@/features/portfolio/components";
```

```tsx
<About />
<FocusMarquee />
<Projects projects={projects} />
<section id="experience" style={{ height: "60vh" }}>
  <p>Experience</p>
</section>
```

- [ ] **Step 6: Verify**

Run: `npm run dev`, visit `/en`.
Expected: a 2-column grid (1 column under 720px) of 3 project cards. Each card shows an image area (gradient tile for the realtime-dashboard project since it's `hasPhoto: true`, large title-as-image tile for the other two), a period badge top-right (two stacked pills for the CLI project's `["2023","2024"]`), a hidden "View case study" badge that fades in bottom-right on hover/focus, a title that turns accent-colored and an image that zooms slightly on hover, a 3-line-clamped description, tech pills, country, and a GitHub icon link that opens in a new tab. Clicking the image or badge navigates to `/en/projects/realtime-order-dashboard` (a 404 until Task 13 exists — that's expected at this point).

- [ ] **Step 7: Commit**

```bash
git add src/features/portfolio/components src/app/globals.css src/app/[locale]/page.tsx
git commit -m "feat: add project cards and projects grid section"
```

---

### Task 13: Case-study detail page

**Files:**
- Create: `src/features/portfolio/pages/project-case-study-page.tsx`
- Create: `src/app/[locale]/projects/[slug]/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `getProjectSlugs`, `getProjectSource` (Task 6), `routing.locales` (Task 3), `Nav` (Task 8).
- Produces: static pages at `/en/projects/<slug>` and `/vi/projects/<slug>` for every MDX file in `src/features/portfolio/content/projects/{locale}/`. The route file (`src/app/[locale]/projects/[slug]/page.tsx`) stays a thin wrapper per `.claude/skills/nextjs-app-router/SKILL.md` — all real work lives in `ProjectCaseStudyPage`.

- [ ] **Step 1: Add case-study CSS to `src/app/globals.css`**

```css
.case-study {
  padding-top: 64px;
}

.case-study-back {
  font-family: var(--mono);
  font-size: 0.86rem;
  color: var(--fg-muted);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.case-study-back:hover {
  color: var(--fg);
}

.case-study h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-top: 20px;
}

.case-study-meta {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
  margin: 24px 0 32px;
  padding: 20px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.case-study-meta div .l {
  font-family: var(--mono);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-muted);
}

.case-study-meta div .v {
  font-size: 0.95rem;
  margin-top: 4px;
}

.case-study-body {
  max-width: 68ch;
  color: var(--fg-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.case-study-body h2 {
  color: var(--fg);
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
```

- [ ] **Step 2: Create `src/features/portfolio/pages/project-case-study-page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { compileMDX } from "next-mdx-remote/rsc";
import { Nav } from "@/features/portfolio/components/nav";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getProjectSlugs, getProjectSource } from "@/features/portfolio/utils/projects";
import type { ProjectFrontmatter } from "@/features/portfolio/types/content";

interface ProjectCaseStudyPageProps {
  locale: string;
  slug: string;
}

export function generateProjectStaticParams() {
  return routing.locales.flatMap((locale) => getProjectSlugs(locale).map((slug) => ({ locale, slug })));
}

export async function ProjectCaseStudyPage({ locale, slug }: ProjectCaseStudyPageProps) {
  if (!getProjectSlugs(locale).includes(slug)) {
    notFound();
  }

  const source = getProjectSource(locale, slug);
  const { content, frontmatter } = await compileMDX<ProjectFrontmatter>({
    source,
    options: { parseFrontmatter: true },
  });

  const t = await getTranslations({ locale, namespace: "caseStudy" });
  const tProjects = await getTranslations({ locale, namespace: "projects" });

  return (
    <main>
      <Nav />
      <article className="case-study shell">
        <Link className="case-study-back" href="/#projects">
          {tProjects("back")}
        </Link>
        <h1>{frontmatter.title}</h1>
        <div className="case-study-meta">
          <div>
            <div className="l">{t("role")}</div>
            <div className="v">{frontmatter.role}</div>
          </div>
          <div>
            <div className="l">{t("period")}</div>
            <div className="v">{frontmatter.periods.join(" · ")}</div>
          </div>
          <div>
            <div className="l">{t("stack")}</div>
            <div className="v">{frontmatter.stack}</div>
          </div>
        </div>
        <div className="case-study-body">{content}</div>
      </article>
    </main>
  );
}
```

(`compileMDX` parses the frontmatter itself here — `getProjectSource` returns the raw file including the `---` block, and `parseFrontmatter: true` strips and types it, so this page doesn't need `gray-matter` directly; `gray-matter` is only used in `getAllProjectsMeta`, Task 6, for the card-listing metadata.)

- [ ] **Step 3: Create `src/app/[locale]/projects/[slug]/page.tsx`**

```tsx
import { ProjectCaseStudyPage, generateProjectStaticParams } from "@/features/portfolio/pages/project-case-study-page";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateStaticParams = generateProjectStaticParams;

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  return <ProjectCaseStudyPage locale={locale} slug={slug} />;
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, visit `/en/projects/realtime-order-dashboard`.
Expected: back link, title, a Role/Period/Stack meta row (Period shows just "2025"), then the rendered MDX body with "Problem" / "Approach" / "Result" as headings and their paragraph content. Visit `/en/projects/api-mock-cli` — Period shows "2023 · 2024" (both phases). Visit `/vi/projects/realtime-order-dashboard` — everything in Vietnamese, including the MDX headings ("Vấn đề" / "Cách tiếp cận" / "Kết quả"). Visit `/en/projects/does-not-exist` — 404. From the home page, click a project card — it navigates here; click "← Back to projects" — it returns to `/en/#projects`.

- [ ] **Step 5: Commit**

```bash
git add src/features/portfolio/pages src/app/[locale]/projects src/app/globals.css
git commit -m "feat: add project case-study detail page"
```

---

### Task 14: Experience section

**Files:**
- Create: `src/features/portfolio/components/experience.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `<Reveal>` (Task 7), `getExperience(locale)` → `ExperienceEntry[]` (Task 6, already loaded in `page.tsx`).
- Produces: `<Experience entries={ExperienceEntry[]} />` (`ExperienceProps = { entries: ExperienceEntry[] }`).

- [ ] **Step 1: Add timeline CSS to `src/app/globals.css`**

```css
.timeline {
  display: flex;
  flex-direction: column;
}

.tl-item {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 24px;
  padding: 26px 0;
  border-top: 1px solid var(--line);
}

.tl-period {
  font-family: var(--mono);
  font-size: 0.86rem;
  color: var(--fg-muted);
  padding-top: 3px;
}

.tl-role {
  font-size: 1.05rem;
  font-weight: 700;
}

.tl-company {
  color: var(--accent);
  font-size: 0.9rem;
  margin-top: 2px;
}

.tl-bullets {
  margin: 12px 0 0;
  padding-left: 18px;
  color: var(--fg-muted);
  font-size: 0.9rem;
  line-height: 1.7;
}

@media (max-width: 600px) {
  .tl-item {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
```

- [ ] **Step 2: Create `src/features/portfolio/components/experience.tsx`**

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
    <section id="experience" className="shell">
      <Reveal className="section-head">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
      </Reveal>
      <Reveal className="timeline">
        {entries.map((entry) => (
          <div className="tl-item" key={`${entry.company}-${entry.period}`}>
            <div className="tl-period">{entry.period}</div>
            <div>
              <div className="tl-role">{entry.role}</div>
              <div className="tl-company">{entry.company}</div>
              <ul className="tl-bullets">
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

- [ ] **Step 3: Add the export to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { Experience } from "./experience";
```

- [ ] **Step 4: Render it on the home page**

In `src/app/[locale]/page.tsx`, add `Experience` to the barrel import:

```tsx
import { Nav, Hero, About, FocusMarquee, Projects, Experience } from "@/features/portfolio/components";
```

```tsx
<Projects projects={projects} />
<Experience entries={experience} />
<section id="contact" style={{ height: "60vh" }}>
  <p>Contact</p>
</section>
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, visit `/en`.
Expected: three timeline rows (period column, then role/company/bullets), most recent first. Under 600px width, each row stacks to a single column. Switch to `/vi` — everything translated.

- [ ] **Step 6: Commit**

```bash
git add src/features/portfolio/components src/app/globals.css src/app/[locale]/page.tsx
git commit -m "feat: add work experience timeline section"
```

---

### Task 15: Contact + Footer

**Files:**
- Create: `src/features/portfolio/components/contact.tsx`
- Create: `src/features/portfolio/components/footer.tsx`
- Modify: `src/features/portfolio/components/index.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `<Reveal>` (Task 7).
- Produces: `<Contact />`, `<Footer />` (no props) — the last two pieces of the home page.

- [ ] **Step 1: Add contact/footer CSS to `src/app/globals.css`**

```css
.contact-box {
  background: var(--bg-raised);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 44px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 26px;
}

.contact-blurb {
  max-width: none;
  width: 100%;
  margin: 0;
}

.contact-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

footer {
  padding: 32px 0 60px;
}

.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-row p {
  font-size: 0.86rem;
  color: var(--fg-muted);
  font-family: var(--mono);
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.social-row {
  display: flex;
  gap: 10px;
}

.social-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 0.78rem;
  color: var(--fg-muted);
  text-decoration: none;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.social-icon:hover {
  color: var(--fg);
  border-color: color-mix(in srgb, var(--accent) 50%, var(--line));
}

.to-top {
  font-family: var(--mono);
  font-size: 0.86rem;
  color: var(--fg-muted);
  text-decoration: none;
}

.to-top:hover {
  color: var(--fg);
}
```

- [ ] **Step 2: Create `src/features/portfolio/components/contact.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="shell" style={{ borderBottom: "none" }}>
      <Reveal className="section-head">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
      </Reveal>
      <Reveal className="contact-box">
        <p className="lede contact-blurb">{t("blurb")}</p>
        <div className="contact-links">
          <a className="btn btn-primary" href="mailto:alex.tran@example.com">
            alex.tran@example.com
          </a>
        </div>
      </Reveal>
    </section>
  );
}
```

(`mailto:` is a plain `<a>` per `CLAUDE.md`'s external-URL exception.)

- [ ] **Step 3: Create `src/features/portfolio/components/footer.tsx`**

```tsx
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="shell">
      <div className="footer-row">
        <p>© 2026 Alex Tran — {t("built")}</p>
        <div className="footer-right">
          <div className="social-row">
            <a className="social-icon" href="https://github.com/alextran" target="_blank" rel="noreferrer" aria-label="GitHub">
              GH
            </a>
            <a className="social-icon" href="https://linkedin.com/in/alextran" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              in
            </a>
            <a className="social-icon" href="https://facebook.com/alextran" target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
          </div>
          <a className="to-top" href="#top">
            {t("top")}
          </a>
        </div>
      </div>
    </footer>
  );
}
```

(Social links are external URLs with `target="_blank"`; "back to top" is a same-page hash anchor — both stay plain `<a>` per `CLAUDE.md`'s Internal links convention.)

- [ ] **Step 4: Add the exports to the components barrel**

In `src/features/portfolio/components/index.ts`, add:

```ts
export { Contact } from "./contact";
export { Footer } from "./footer";
```

- [ ] **Step 5: Assemble the final home page**

Create `src/features/portfolio/pages/home-page.tsx`:

```tsx
import { Nav, Hero, About, FocusMarquee, Projects, Experience, Contact, Footer } from "@/features/portfolio/components";
import { getAllProjectsMeta } from "@/features/portfolio/utils/projects";
import { getExperience } from "@/features/portfolio/utils/experience";

interface HomePageProps {
  locale: string;
}

export async function HomePage({ locale }: HomePageProps) {
  const projects = getAllProjectsMeta(locale);
  const experience = getExperience(locale);

  return (
    <main id="top">
      <Nav />
      <Hero />
      <About />
      <FocusMarquee />
      <Projects projects={projects} />
      <Experience entries={experience} />
      <Contact />
      <Footer />
    </main>
  );
}
```

Replace `src/app/[locale]/page.tsx` entirely:

```tsx
import { HomePage } from "@/features/portfolio/pages/home-page";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
```

(This is the same thin-route-page pattern as Task 13's case-study page: `src/app/[locale]/page.tsx` only unwraps `params` and renders the feature page.)

- [ ] **Step 6: Verify**

Run: `npm run dev`, visit `/en`.
Expected: Contact section shows the blurb spanning the full width of the box, above a single email button (no GitHub/LinkedIn buttons here anymore). Footer shows the copyright line on the left and, on the right, three small circular GitHub/LinkedIn/Facebook icon links plus "back to top" — clicking it scrolls to the hero. Switch to `/vi` — footer/contact text translated, social links unchanged (they're not language-dependent).

- [ ] **Step 7: Commit**

```bash
git add src/features/portfolio/components src/features/portfolio/pages/home-page.tsx src/app/globals.css src/app/[locale]/page.tsx
git commit -m "feat: add contact section, footer, and assemble full home page"
```

---

### Task 16: Final build, rules audit, and manual verification pass

**Files:**
- None created — this task verifies the assembled app against the spec's "Testing / verification" checklist and this repo's `CLAUDE.md` conventions.

**Interfaces:**
- None (verification-only task).

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds with no TypeScript or ESLint errors; output lists static pages for `/en`, `/vi`, and every `/[locale]/projects/[slug]` combination (6 total detail pages).

- [ ] **Step 2: Run the build locally**

Run: `npm run start`, visit `http://localhost:3000`.
Expected: same behavior as `npm run dev`, served from the production build.

- [ ] **Step 3: Run the dev-rules audit**

Run: `bash audit-rules.sh src`
Expected: mostly `OK` sections. Section 6 (`<svg>` outside `src/components/icons/`) and section 7 (`<a>` for internal links) are expected to report zero *unjustified* hits — every remaining `<a>` in the codebase is either a same-page hash anchor or a `target="_blank"`/`mailto:`/external-domain link, which is the documented exception in `CLAUDE.md`. If the audit finds anything else (a stray inline `<svg>`, a `<button>` where a link was meant, a missing `index.ts` barrel), fix it directly — this is a report, not a gate, but its hits are still real signal on a fresh codebase.

- [ ] **Step 4: Walk the spec's verification checklist**

With the production server running, confirm each item from `docs/superpowers/specs/2026-08-21-portfolio-design.md`:

- [ ] Light/dark toggle persists across reload and matches OS default when untouched (clear `localStorage`, toggle OS theme, reload).
- [ ] EN/VI toggle swaps all UI strings, project/experience content, and updates `<html lang>` (inspect via devtools).
- [ ] Scroll-reveal (About/Projects/Experience/Contact), marquee, blob drift, and card hover/zoom animations all work, and are all disabled/static under OS reduced-motion.
- [ ] Nav scrollspy highlights the correct link while scrolling through each section.
- [ ] Case-study navigation works for all 3 projects in both locales (6 pages), including the back link.
- [ ] Responsive check at a sub-600px width: hamburger nav opens/closes, hero CTAs and stats are equal-width, project grid is 1 column, tech-stack grid is 2 columns.
- [ ] Keyboard-only pass: Tab through the nav, toggles, project cards (media link + GitHub link), and case-study back link — every interactive element is reachable and shows a visible focus ring, and Enter activates each one.

- [ ] **Step 5: Fix any issues found during Steps 3-4**

If a check fails, fix the responsible component/CSS file directly (no separate task needed — this is a verification pass, not new scope) and re-run the affected checks.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: verify production build against spec checklist and dev-rules audit"
```

(Skip this commit if Step 5 required no fixes and nothing is staged.)
