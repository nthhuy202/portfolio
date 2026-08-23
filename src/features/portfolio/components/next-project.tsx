import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/features/portfolio/types/content";

interface NextProjectProps {
  project: ProjectMeta;
}

export function NextProject({ project }: NextProjectProps) {
  const t = useTranslations("caseStudy");

  return (
    <section className="py-16 border-t border-line max-w-[68.75rem] mx-auto px-6">
      <Link className="group flex items-center justify-between gap-4 no-underline" href={`/projects/${project.slug}`}>
        <div>
          <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent">{t("nextProject")}</p>
          <p className="text-[1.3rem] font-bold mt-1.5 text-fg transition-colors duration-150 ease-[ease] group-hover:text-accent">{project.title}</p>
        </div>
        <span className="font-mono text-[1.3rem] text-fg-muted transition-colors duration-150 ease-[ease] group-hover:text-accent" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
