import { useTranslations } from "next-intl";
import { EMPTY_META_VALUE_PLACEHOLDER } from "@/features/portfolio/constants/case-study";
import type { ProjectFrontmatter } from "@/features/portfolio/types/content";

interface ProjectMetaGridProps {
  frontmatter: ProjectFrontmatter;
}

export function ProjectMetaGrid({ frontmatter }: ProjectMetaGridProps) {
  const t = useTranslations("caseStudy");

  const items = [
    { label: t("client"), value: frontmatter.country ?? EMPTY_META_VALUE_PLACEHOLDER },
    { label: t("role"), value: frontmatter.role },
    { label: t("timeline"), value: frontmatter.periods.join(" · ") },
    { label: t("team"), value: frontmatter.team ?? EMPTY_META_VALUE_PLACEHOLDER },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 max-md:grid-cols-2 mt-6 mb-8 py-5 border-t border-b border-line">
      {items.map((item) => (
        <div key={item.label}>
          <div className="font-mono text-[0.76rem] uppercase tracking-[0.1em] text-fg-muted">{item.label}</div>
          <div className="text-[0.95rem] mt-1">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
