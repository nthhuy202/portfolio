import type { CaseStudySectionHeadings } from "@/features/portfolio/types/content";

// The `##` heading text recognized for each section, across every locale —
// see splitProjectSections() in utils/projects.ts, which accepts any locale's
// heading text regardless of which locale's MDX file it appears in (content
// authors don't always translate headings). A heading not listed here for any
// locale is simply omitted from the page.
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
