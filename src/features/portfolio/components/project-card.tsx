import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import type { ProjectMeta } from "@/features/portfolio/types/content";

interface ProjectCardProps {
  project: ProjectMeta;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  const tA11y = useTranslations("a11y");

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
              aria-label={tA11y("viewSourceOnGithub")}
            >
              GH
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
