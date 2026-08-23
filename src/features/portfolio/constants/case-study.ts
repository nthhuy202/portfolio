import type { CaseStudySectionHeadings } from "@/features/portfolio/types/content";

// The exact `##` heading text each locale's project MDX must use for a section
// to be recognized — see splitProjectSections() in utils/projects.ts. A section
// whose heading isn't present in the MDX body is simply omitted from the page.
export const SECTION_HEADINGS_BY_LOCALE: Record<string, CaseStudySectionHeadings> = {
  en: {
    problem: "Problem",
    responsibilities: "Responsibilities",
    challengesAndSolutions: "Challenges & Solutions",
    result: "Result",
    keyLearning: "Key Learning",
  },
  vi: {
    problem: "Vấn đề",
    responsibilities: "Trách nhiệm",
    challengesAndSolutions: "Thách thức & Giải pháp",
    result: "Kết quả",
    keyLearning: "Bài học",
  },
};

export const EMPTY_META_VALUE_PLACEHOLDER = "—";
