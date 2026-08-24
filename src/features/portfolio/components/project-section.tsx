import type { ReactNode } from "react";

interface ProjectSectionProps {
  content: ReactNode;
}

export function ProjectSection({ content }: ProjectSectionProps) {
  if (!content) return null;

  return (
    <div className="case-study-body text-fg-muted text-base leading-[1.75]">
      {content}
    </div>
  );
}
