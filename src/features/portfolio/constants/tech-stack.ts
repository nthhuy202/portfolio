import {
  IconReact,
  IconNextjs,
  IconTypeScript,
  IconRedux,
  IconTanStack,
  IconTailwindCss,
  IconSass,
  IconFigma,
  IconGit,
} from "@/components/icons";
import type { TechBadge } from "@/features/portfolio/types/content";

export const techStack: TechBadge[] = [
  { name: "React", Icon: IconReact, bg: "#20232a", fg: "#61dafb" },
  { name: "Next.js", Icon: IconNextjs, bg: "#12141a", fg: "#ffffff" },
  { name: "TypeScript", Icon: IconTypeScript, bg: "#2b5f9e", fg: "#ffffff" },
  { name: "Redux Toolkit", Icon: IconRedux, bg: "#764abc", fg: "#ffffff" },
  { name: "TanStack Query", Icon: IconTanStack, bg: "#ff4154", fg: "#ffffff" },
  { name: "Tailwind CSS", Icon: IconTailwindCss, bg: "#0ea5e9", fg: "#062a3d" },
  { name: "Sass/SCSS", Icon: IconSass, bg: "#cc6699", fg: "#ffffff" },
  { name: "Figma", Icon: IconFigma, bg: "#a259ff", fg: "#ffffff" },
  { name: "Git", Icon: IconGit, bg: "#f05033", fg: "#ffffff" },
];
