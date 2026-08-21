import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import type { ExperienceEntry } from "@/features/portfolio/types/content";

interface ExperienceProps {
  entries: ExperienceEntry[];
}

export function Experience({ entries }: ExperienceProps) {
  const t = useTranslations("experience");

  return (
    <section id="experience" className="shell">
      <Reveal className="section-head">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
      </Reveal>
      <Reveal className="timeline">
        {entries.map((entry) => (
          <div className="tl-item" key={`${entry.company}-${entry.period}`}>
            <div className="tl-period">{entry.period}</div>
            <div>
              <div className="tl-role">{entry.role}</div>
              <div className="tl-company">{entry.company}</div>
              <ul className="tl-bullets">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
