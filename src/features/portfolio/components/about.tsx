import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { TechStack } from "@/features/portfolio/components/tech-stack";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 border-b border-line relative max-w-[1100px] mx-auto px-6">
      <Reveal className="mb-11 max-w-[640px]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal className="max-w-[68ch]">
        <p className="text-fg-muted text-base leading-[1.65] mt-3.5 max-w-[56ch]">{t("p1")}</p>
        <p className="text-fg-muted text-base leading-[1.65] mt-4 max-w-[56ch]">{t("p2")}</p>
      </Reveal>
      <Reveal className="mt-10">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("stackLabel")}</p>
        <TechStack />
      </Reveal>
    </section>
  );
}
