import type { ComponentProps, ComponentType } from "react";

export interface ProjectFrontmatter {
  title: string;
  summary: string;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  periods: string[];
  country: { flag: string; name: string };
  role: string;
  stack: string;
  hasPhoto: boolean;
}

export interface ProjectMeta extends ProjectFrontmatter {
  slug: string;
}

export interface AboutHighlight {
  title: string;
  description: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface TechBadge {
  name: string;
  Icon: ComponentType<ComponentProps<"svg">>;
  bg: string;
  fg: string;
}

export interface SocialLink {
  Icon: ComponentType<ComponentProps<"svg">>;
  href: string;
  label: string;
  brandColor: string;
}
