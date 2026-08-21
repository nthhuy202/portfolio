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
