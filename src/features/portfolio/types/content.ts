import type { ComponentProps, ComponentType } from "react";

export interface ProjectFrontmatter {
  title: string;
  summary: string;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  periods: string[];
  country: string;
  role: string;
  client?: string;
  team?: string;
  priority?: number;
}

export interface ProjectMeta extends ProjectFrontmatter {
  slug: string;
}

export interface CaseStudySectionHeadings {
  problem: string;
  responsibilities: string;
  challengesAndSolutions: string;
  result: string;
  keyLearning: string;
}

export interface ProjectSections {
  problem?: string;
  responsibilities?: string;
  challengesAndSolutions?: string;
  result?: string;
  keyLearning?: string;
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
  Icon?: ComponentType<ComponentProps<"svg">> | null;
  bg?: string;
  fg?: string;
  url?: string;
}

export interface IconLink {
  Icon?: ComponentType<ComponentProps<"svg">>;
  href: string;
  label: string;
  brandColor: string;
  displayText: string;
}
