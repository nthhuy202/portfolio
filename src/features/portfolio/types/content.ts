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

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface TechBadge {
  name: string;
  short: string;
  bg: string;
  fg: string;
}
