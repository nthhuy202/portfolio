import type { CSSProperties } from "react";
import { Reveal } from "@/features/portfolio/components/reveal";
import { TECH_BADGE_STAGGER_DELAY_SECONDS, techStack } from "@/features/portfolio/constants/tech-stack";

export function TechStack() {
  return (
    <div className="grid grid-cols-4 gap-3 mt-4 max-md:grid-cols-2">
      {techStack.map((tech, index) => (
        <Reveal key={tech.name} delay={index * TECH_BADGE_STAGGER_DELAY_SECONDS}>
          <div
            className="group flex items-center gap-2.5 py-3 px-3.5 border border-line rounded-lg bg-bg-raised transition-[transform,border-color] duration-200 ease-[ease] hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--tech-fg)_45%,var(--color-line))]"
            style={{ "--tech-bg": tech.bg, "--tech-fg": tech.fg } as CSSProperties}
          >
            <span className="w-8 h-8 rounded-[0.4375rem] flex-none flex items-center justify-center bg-bg-raised-2 text-fg-muted transition-colors duration-200 ease-[ease] group-hover:bg-[var(--tech-bg)] group-hover:text-[var(--tech-fg)]">
              <tech.Icon className="w-[1.125rem] h-[1.125rem]" aria-hidden="true" />
            </span>
            <span className="font-mono text-[0.86rem] tracking-[0.02em] uppercase">{tech.name}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
