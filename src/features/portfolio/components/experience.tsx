import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import type { ExperienceEntry } from "@/features/portfolio/types/content";

interface ExperienceProps {
  entries: ExperienceEntry[];
}

export function Experience({ entries }: ExperienceProps) {
  const t = useTranslations("experience");

  return (
    <section
      id="experience"
      className="py-24 border-b border-line relative max-w-[68.75rem] mx-auto px-6"
    >
      <Reveal className="mb-11 max-w-[40rem]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">
          {t("eyebrow")}
        </p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">
          {t("title")}
        </h2>
      </Reveal>
      <Reveal className="flex flex-col">
        {entries.map((entry) => (
          <div
            className="grid grid-cols-3 gap-6 py-[1.625rem] border-t border-line max-sm:grid-cols-1 max-sm:gap-1.5"
            key={`${entry.company}-${entry.period}`}
          >
            <div className="col-span-1 max-sm:col-span-[unset]">
              <div className="font-mono text-[0.86rem] text-fg-muted pt-[0.1875rem]">
                {entry.period}
              </div>

              <div className="text-2xl font-bold"> {entry.company}</div>
              
              <div className="text-accent text-[0.9rem] mt-0.5">
                {entry.role}
              </div>
            </div>

            <div className="col-span-2 max-sm:col-span-[unset]">
              <ul className="mt-3 pl-[1.125rem] text-fg-muted text-[0.9rem] leading-[1.7] list-disc max-sm:ml-5">
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
