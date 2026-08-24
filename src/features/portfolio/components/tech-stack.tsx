import type { CSSProperties } from "react";
import { Reveal } from "@/features/portfolio/components/reveal";
import {
  TECH_BADGE_STAGGER_DELAY_SECONDS,
  techStack,
} from "@/features/portfolio/constants/tech-stack";

interface TechStackProps {
  names?: string[];
}

export function TechStack({ names }: TechStackProps) {
  const badges = names
    ? techStack.filter((tech) => names.includes(tech.name))
    : techStack.filter((tech) => tech.Icon && tech.bg && tech.fg && tech.url);

  return (
    <div className="grid grid-cols-4 gap-3 mt-4 max-md:grid-cols-2">
      {badges.map((tech, index) => (
        <Reveal
          key={tech.name}
          delay={index * TECH_BADGE_STAGGER_DELAY_SECONDS}
        >
          <a
            className="group flex items-center gap-2.5 py-3 px-3.5 border border-line rounded-lg bg-bg-raised no-underline cursor-pointer transition-[transform,border-color] duration-200 ease-[ease] hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--color-accent)_45%,var(--color-line))]"
            href={tech.url}
            target="_blank"
            rel="noreferrer"
            style={
              { "--tech-bg": tech.bg, "--tech-fg": tech.fg } as CSSProperties
            }
          >
            {tech.Icon && (
              <span className="size-6 rounded-[0.4375rem] flex-none flex items-center justify-center border border-line bg-fg-muted/10 text-fg-muted transition-colors duration-200 ease-[ease] group-hover:bg-[var(--tech-bg)] group-hover:text-[var(--tech-fg)] group-hover:border-transparent">
                <tech.Icon
                  className="w-[1.125rem] h-[1.125rem]"
                  aria-hidden="true"
                />
              </span>
            )}
            <span className="font-mono text-[0.86rem] tracking-[0.02em] text-fg">
              {tech.name}
            </span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
