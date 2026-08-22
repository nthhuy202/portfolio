import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { TechStack } from "@/features/portfolio/components/tech-stack";
import type { AboutHighlight } from "@/features/portfolio/types/content";

export function About() {
  const t = useTranslations("about");
  const highlights = t.raw("highlights") as AboutHighlight[];

  return (
    <section id="about" className="py-24 border-b border-line relative max-w-[1100px] mx-auto px-6">
      <Reveal className="mb-11 max-w-[640px]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal className="max-w-[68ch]">
        <p className="text-fg-muted text-base leading-[1.65] mt-3.5 max-w-[56ch]">{t("intro")}</p>
        <ul className="mt-5 space-y-4 max-w-[56ch]">
          {highlights.map((highlight) => (
            <li className="text-fg-muted text-base leading-[1.65]" key={highlight.title}>
              <span className="font-semibold text-fg">{highlight.title}:</span> {highlight.description}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal className="mt-10">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("stackLabel")}</p>
        <TechStack />
      </Reveal>
    </section>
  );
}
