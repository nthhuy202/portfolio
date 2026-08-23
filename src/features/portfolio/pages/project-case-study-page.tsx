import matter from "gray-matter";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { evaluate } from "next-mdx-remote-client/rsc";
import { Nav } from "@/features/portfolio/components/nav";
import { Footer } from "@/features/portfolio/components/footer";
import { TechStack } from "@/features/portfolio/components/tech-stack";
import { ProjectMetaGrid } from "@/features/portfolio/components/project-meta-grid";
import { ProjectSection } from "@/features/portfolio/components/project-section";
import { NextProject } from "@/features/portfolio/components/next-project";
import { ProjectContactCta } from "@/features/portfolio/components/project-contact-cta";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  getAllProjectsMeta,
  getProjectSlugs,
  getProjectSource,
  splitProjectSections,
} from "@/features/portfolio/utils/projects";

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
  const project = getAllProjectsMeta(locale).find((meta) => meta.slug === slug);

  if (!project) {
    return {};
  }

  return { title: project.title, description: project.summary };
}

async function evaluateSection(source?: string): Promise<ReactNode> {
  if (!source) return null;

  // Each section is its own MDX document (no frontmatter) so the Techstack grid
  // can be spliced in between the Responsibilities and Challenges & Solutions
  // sections without parsing/rebuilding the compiled MDX tree.
  const { content, error } = await evaluate({ source, options: {} });
  if (error) throw error;

  return content;
}

export async function ProjectCaseStudyPage({ locale, slug }: ProjectCaseStudyPageProps) {
  const projects = getAllProjectsMeta(locale);
  const currentIndex = projects.findIndex((project) => project.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const frontmatter = projects[currentIndex];
  const { content: body } = matter(getProjectSource(locale, slug));
  const sections = splitProjectSections(locale, body);

  const [problemContent, responsibilitiesContent, challengesContent, resultContent, keyLearningContent] = await Promise.all([
    evaluateSection(sections.problem),
    evaluateSection(sections.responsibilities),
    evaluateSection(sections.challengesAndSolutions),
    evaluateSection(sections.result),
    evaluateSection(sections.keyLearning),
  ]);

  const t = await getTranslations({ locale, namespace: "caseStudy" });
  const tProjects = await getTranslations({ locale, namespace: "projects" });

  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main>
      <Nav />
      <article className="pt-16 max-w-[68.75rem] mx-auto px-6 pb-20">
        <Link className="font-mono text-[0.86rem] text-fg-muted no-underline inline-flex items-center gap-1.5 hover:text-fg" href="/#projects">
          {tProjects("back")}
        </Link>
        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-[-0.02em] mt-5">{frontmatter.title}</h1>
        <p className="text-fg-muted text-base leading-[1.65] mt-4 max-w-[60ch]">{frontmatter.summary}</p>

        <ProjectMetaGrid frontmatter={frontmatter} />

        {frontmatter.demoUrl && (
          <a
            className="inline-flex items-center justify-center gap-2 mb-10 text-[0.92rem] font-semibold py-3 px-5 rounded-[var(--radius)] border border-transparent transition-[transform,background,border-color] duration-150 ease-[ease] cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)]"
            href={frontmatter.demoUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t("viewLiveProject")} ↗
          </a>
        )}

        {frontmatter.image && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-line mb-10">
            <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 68.75rem"
            />
          </div>
        )}

        <div className="flex flex-col gap-10">
          <ProjectSection content={problemContent} />
          <ProjectSection content={responsibilitiesContent} />
          {frontmatter.tech.length > 0 && (
            <div>
              <h2 className="text-[1.2rem] font-bold mb-3">{t("techstackTitle")}</h2>
              <TechStack names={frontmatter.tech} />
            </div>
          )}
          <ProjectSection content={challengesContent} />
          <ProjectSection content={resultContent} />
          <ProjectSection content={keyLearningContent} />
        </div>
      </article>

      <Footer />
      {nextProject.slug !== slug && <NextProject project={nextProject} />}
      <ProjectContactCta />
    </main>
  );
}
