import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { evaluate } from "next-mdx-remote-client/rsc";
import { Nav } from "@/features/portfolio/components/nav";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getAllProjectsMeta, getProjectSlugs, getProjectSource } from "@/features/portfolio/utils/projects";
import type { ProjectFrontmatter } from "@/features/portfolio/types/content";

interface ProjectCaseStudyPageProps {
  locale: string;
  slug: string;
}

interface GenerateProjectMetadataProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateProjectStaticParams() {
  return routing.locales.flatMap((locale) => getProjectSlugs(locale).map((slug) => ({ locale, slug })));
}

export async function generateProjectMetadata({ params }: GenerateProjectMetadataProps): Promise<Metadata> {
  const { locale, slug } = await params;
  // Reuses the gray-matter-based frontmatter loader (already used for the projects
  // grid) instead of running the MDX `evaluate()` compile a second time just for
  // title/summary — cheaper and avoids double-compiling the same file.
  const project = getAllProjectsMeta(locale).find((meta) => meta.slug === slug);

  if (!project) {
    return {};
  }

  return { title: project.title, description: project.summary };
}

export async function ProjectCaseStudyPage({ locale, slug }: ProjectCaseStudyPageProps) {
  if (!getProjectSlugs(locale).includes(slug)) {
    notFound();
  }

  const source = getProjectSource(locale, slug);
  // next-mdx-remote/rsc's compileMDX crashes in Next.js 15 + React 19 RSC rendering
  // ("Attempted to render ... without development properties") because its jsx-runtime
  // pick relies on a runtime process.env.NODE_ENV check instead of a bundler-resolved
  // import; next-mdx-remote-client is the maintained fork that fixes this. Same shape,
  // renamed export (evaluate instead of compileMDX).
  // evaluate()'s generic requires `extends Record<string, unknown>`, which an
  // `interface` (this project's convention over `type`) never structurally satisfies
  // even when its shape matches — cast after the call instead of adding an index
  // signature to ProjectFrontmatter just to please this one call site.
  const { content, frontmatter: rawFrontmatter, error } = await evaluate({
    source,
    options: { parseFrontmatter: true },
  });
  // evaluate() returns compile errors instead of throwing (unlike compileMDX) — an
  // empty `content` fallback would otherwise ship silently on a malformed .mdx file.
  if (error) throw error;
  const frontmatter = rawFrontmatter as unknown as ProjectFrontmatter;

  const t = await getTranslations({ locale, namespace: "caseStudy" });
  const tProjects = await getTranslations({ locale, namespace: "projects" });

  return (
    <main>
      <Nav />
      <article className="pt-16 max-w-[68.75rem] mx-auto px-6">
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
