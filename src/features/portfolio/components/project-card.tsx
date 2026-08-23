import Image from "next/image";
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
            !project.image && "bg-bg-raised-2 flex items-center justify-center p-[1.125rem]"
          )}
          aria-hidden="true"
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <span className="font-mono font-bold tracking-[0.01em] text-center text-fg-muted text-[clamp(1.1rem,3.4vw,1.6rem)] leading-[1.25]">{project.title}</span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 flex gap-1.5">
          {project.periods.map((period) => (
            <span className="font-mono text-[0.8rem] py-1 px-[0.5625rem] rounded-full bg-[rgba(8,10,14,0.65)] text-white backdrop-blur-[0.25rem]" key={period}>
              {period}
            </span>
          ))}
        </div>
        <span className="absolute bottom-2.5 right-2.5 py-[0.4375rem] px-3.5 rounded-full font-mono text-[0.82rem] bg-[rgba(8,10,14,0.72)] text-white opacity-0 translate-y-2 transition-[opacity,transform,background-color,color] duration-[380ms] ease-in-out backdrop-blur-[0.25rem] motion-reduce:transition-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-accent group-hover:text-[#1a0a02] group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:bg-accent group-focus-within:text-[#1a0a02]">
          {t("viewCaseStudy")} →
        </span>
      </Link>
      <div className="pt-5 px-[1.375rem] pb-[1.375rem] flex flex-col gap-3 flex-1">
        <h3 className="text-[1.12rem] font-bold transition-colors duration-200 ease-[ease] group-hover:text-accent group-focus-within:text-accent">{project.title}</h3>
        <p className="text-fg-muted text-[0.9rem] leading-[1.6] line-clamp-3">{project.summary}</p>
        <div className="mt-auto pt-1.5 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-[0.4375rem] flex-1 min-w-0">
            {project.tech.map((tech) => (
              <span className="font-mono text-[0.8rem] py-[0.3125rem] px-[0.6875rem] rounded-full border border-line text-accent-2 bg-bg-raised-2" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-none">
            <span className="text-[0.86rem] text-fg-muted">{project.country}</span>
            {project.githubUrl && (
              <a
                className="w-[1.875rem] h-[1.875rem] rounded-full border border-line flex-none flex items-center justify-center font-mono text-[0.74rem] text-fg-muted no-underline transition-[color,border-color] duration-150 ease-[ease] hover:text-fg hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))]"
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
      </div>
    </article>
  );
}
