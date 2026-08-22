import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

import type {
  ProjectFrontmatter,
  ProjectMeta,
} from "@/features/portfolio/types/content";

const PROJECTS_DIR = path.join(
  process.cwd(),
  "src/features/portfolio/content/projects",
);

export function getProjectSlugs(locale: string): string[] {
  const dir = path.join(PROJECTS_DIR, locale);

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjectSource(locale: string, slug: string): string {
  const filePath = path.join(PROJECTS_DIR, locale, `${slug}.mdx`);

  return fs.readFileSync(filePath, "utf8");
}

export function getAllProjectsMeta(locale: string): ProjectMeta[] {
  return getProjectSlugs(locale).map((slug) => {
    const source = getProjectSource(locale, slug);
    const { data } = matter(source);

    return { slug, ...(data as ProjectFrontmatter) };
  });
}
