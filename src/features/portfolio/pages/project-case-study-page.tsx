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
