import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

import { SECTION_HEADINGS_BY_LOCALE } from "@/features/portfolio/constants/case-study";
import type {
  ProjectFrontmatter,
  ProjectMeta,
  ProjectSections,
} from "@/features/portfolio/types/content";

const PROJECTS_DIR = path.join(
  process.cwd(),
  "src/features/portfolio/content/projects",
);

const SECTION_HEADING_PATTERN = /^## (.+)$/gm;

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
  const projects = getProjectSlugs(locale).map((slug) => {
    const source = getProjectSource(locale, slug);
    const { data } = matter(source);

    return { slug, ...(data as ProjectFrontmatter) };
  });

  // Lower priority number sorts first; projects without a priority keep their
  // current (alphabetical, by filename) relative order via Array.sort's stability.
  return projects.sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));
}

export function splitProjectSections(locale: string, body: string): ProjectSections {
  const headings = SECTION_HEADINGS_BY_LOCALE[locale] ?? SECTION_HEADINGS_BY_LOCALE.en;
  const matches = [...body.matchAll(SECTION_HEADING_PATTERN)];
  const rawByHeadingText = new Map<string, string>();

  matches.forEach((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? body.length) : body.length;
    rawByHeadingText.set(match[1].trim(), body.slice(start, end).trim());
  });

  return {
    problem: rawByHeadingText.get(headings.problem),
    responsibilities: rawByHeadingText.get(headings.responsibilities),
    challengesAndSolutions: rawByHeadingText.get(headings.challengesAndSolutions),
    result: rawByHeadingText.get(headings.result),
    keyLearning: rawByHeadingText.get(headings.keyLearning),
  };
}
