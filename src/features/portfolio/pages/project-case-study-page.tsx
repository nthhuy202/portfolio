import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { evaluate } from "next-mdx-remote-client/rsc";
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
  // next-mdx-remote/rsc's compileMDX crashes in Next.js 15 + React 19 RSC rendering
  // ("Attempted to render ... without development properties") because its jsx-runtime
  // pick relies on a runtime process.env.NODE_ENV check instead of a bundler-resolved
  // import; next-mdx-remote-client is the maintained fork that fixes this. Same shape,
  // renamed export (evaluate instead of compileMDX).
  // evaluate()'s generic requires `extends Record<string, unknown>`, which an
  // `interface` (this project's convention over `type`) never structurally satisfies
  // even when its shape matches — cast after the call instead of adding an index
  // signature to ProjectFrontmatter just to please this one call site.
  const { content, frontmatter: rawFrontmatter } = await evaluate({
    source,
    options: { parseFrontmatter: true },
  });
  const frontmatter = rawFrontmatter as unknown as ProjectFrontmatter;

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
