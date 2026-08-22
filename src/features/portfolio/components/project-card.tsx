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
    <article className="group bg-bg-raised border border-line rounded-lg overflow-hidden flex flex-col transition-[transform,border-color,box-shadow] duration-200 ease-[ease] shadow-[var(--shadow)] hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-accent)_45%,var(--color-line))]">
      <Link
        className="relative block w-full aspect-[16/10] border-none p-0 m-0 cursor-pointer bg-none overflow-hidden"
        href={`/projects/${project.slug}`}
        aria-label={`${t("viewCaseStudy")}: ${project.title}`}
      >
        <div
          className={cn(
            "w-full h-full transition-transform duration-[450ms] ease-[ease] group-hover:scale-[1.06] group-focus-within:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100",
            project.hasPhoto
              ? "bg-[conic-gradient(from_210deg_at_40%_40%,var(--color-accent),var(--color-accent-2),var(--color-accent))]"
              : "bg-bg-raised-2 flex items-center justify-center p-[18px]"
          )}
          aria-hidden="true"
        >
          {!project.hasPhoto && (
            <span className="font-mono font-bold tracking-[0.01em] text-center text-fg-muted text-[clamp(1.1rem,3.4vw,1.6rem)] leading-[1.25]">{project.title}</span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 flex gap-1.5">
          {project.periods.map((period) => (
            <span className="font-mono text-[0.8rem] py-1 px-[9px] rounded-full bg-[rgba(8,10,14,0.65)] text-white backdrop-blur-[4px]" key={period}>
              {period}
            </span>
          ))}
        </div>
        <span className="absolute bottom-2.5 right-2.5 py-[7px] px-3.5 rounded-full font-mono text-[0.82rem] bg-[rgba(8,10,14,0.72)] text-white opacity-0 translate-y-2 transition-[opacity,transform,background-color,color] duration-[220ms] ease-[ease] backdrop-blur-[4px] motion-reduce:transition-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-accent group-hover:text-[#1a0a02] group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:bg-accent group-focus-within:text-[#1a0a02]">
          {t("viewCaseStudy")} →
        </span>
      </Link>
      <div className="pt-5 px-[22px] pb-[22px] flex flex-col gap-3 flex-1">
        <h3 className="text-[1.12rem] font-bold transition-colors duration-200 ease-[ease] group-hover:text-accent group-focus-within:text-accent">{project.title}</h3>
        <p className="text-fg-muted text-[0.9rem] leading-[1.6] line-clamp-3">{project.summary}</p>
        <div className="flex flex-wrap gap-[7px]">
          {project.tech.map((tech) => (
            <span className="font-mono text-[0.8rem] py-[5px] px-[11px] rounded-full border border-line text-accent-2 bg-bg-raised-2" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-1.5 flex items-center justify-between gap-3">
          <span className="text-[0.86rem] text-fg-muted flex items-center gap-1.5">
            {project.country.flag} {project.country.name}
          </span>
          {project.githubUrl && (
            <a
              className="w-[30px] h-[30px] rounded-full border border-line flex-none flex items-center justify-center font-mono text-[0.74rem] text-fg-muted no-underline transition-[color,border-color] duration-150 ease-[ease] hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))]"
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
