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
const ORDER_PREFIX_PATTERN = /^\d+-/;
const MDX_FILE_PATTERN = /\.mdx$/;

// Maps a `##` heading's text, in any locale, to the section it belongs to —
// so a project file whose headings weren't translated into the current
// locale still renders instead of silently dropping that section.
const SECTION_KEY_BY_HEADING_TEXT = new Map<string, keyof ProjectSections>(
  Object.values(SECTION_HEADINGS_BY_LOCALE).flatMap((headings) =>
    (Object.keys(headings) as (keyof ProjectSections)[]).map((key) => [
      headings[key],
      key,
    ]),
  ),
);

function toPublicSlug(filename: string): string {
  return filename.replace(ORDER_PREFIX_PATTERN, "");
}

function getProjectFilenames(locale: string): string[] {
  const dir = path.join(PROJECTS_DIR, locale);

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(MDX_FILE_PATTERN, ""));
}

export function getProjectSlugs(locale: string): string[] {
  return getProjectFilenames(locale).map(toPublicSlug);
}

export function getProjectSource(locale: string, slug: string): string {
  const filename = getProjectFilenames(locale).find(
    (name) => toPublicSlug(name) === slug,
  );

  if (!filename) {
    throw new Error(`Project not found: ${locale}/${slug}`);
  }

  const filePath = path.join(PROJECTS_DIR, locale, `${filename}.mdx`);

  return fs.readFileSync(filePath, "utf8");
}

export function getAllProjectsMeta(locale: string): ProjectMeta[] {
  const projects = getProjectFilenames(locale).map((filename) => {
    const filePath = path.join(PROJECTS_DIR, locale, `${filename}.mdx`);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));

    return { slug: toPublicSlug(filename), ...(data as ProjectFrontmatter) };
  });

  // Lower priority number sorts first; projects without a priority keep their
  // current (by filename order) relative order via Array.sort's stability.
  return projects.sort(
    (a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity),
  );
}

export function splitProjectSections(body: string): ProjectSections {
  const matches = [...body.matchAll(SECTION_HEADING_PATTERN)];
  const sections: ProjectSections = {};

  matches.forEach((match, index) => {
    const key = SECTION_KEY_BY_HEADING_TEXT.get(match[1].trim());
    if (!key) return;

    const start = match.index ?? 0;
    const end =
      index + 1 < matches.length
        ? (matches[index + 1].index ?? body.length)
        : body.length;
    sections[key] = body.slice(start, end).trim();
  });

  return sections;
}
