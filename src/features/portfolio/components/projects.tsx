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
    <section
      id="projects"
      className="py-24 border-b border-line relative max-w-[68.75rem] mx-auto px-6"
    >
      <Reveal className="mb-11 max-w-[40rem]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">
          {t("eyebrow")}
        </p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">
          {t("title")}
        </h2>
        <p className="text-fg-muted text-base leading-[1.65] mt-3.5 max-w-[56ch]">
          {t("lede")}
        </p>
      </Reveal>
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {projects.map((project) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
