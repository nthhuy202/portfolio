import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { TechStack } from "@/features/portfolio/components/tech-stack";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="shell">
      <Reveal className="section-head">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
      </Reveal>
      <Reveal className="about-copy">
        <p className="lede">{t("p1")}</p>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("p2")}
        </p>
      </Reveal>
      <Reveal className="tech-block">
        <p className="eyebrow">{t("stackLabel")}</p>
        <TechStack />
      </Reveal>
    </section>
  );
}
