import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="max-sm:pt-6 pt-[7.5rem] pb-[6.875rem] border-b border-line relative max-w-[68.75rem] mx-auto px-6">
      <Reveal>
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">
          {t("eyebrow")}
        </p>
        <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold tracking-[-0.03em] leading-[1.05] mt-[1.125rem]">
          {t("hi")} <span className="text-accent">{t("name")}</span>.<br />
          {t("role")}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-[1.375rem] max-w-[58ch] text-[1.06rem] leading-[1.7] text-fg-muted">
          {t("pitch")}
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="flex gap-3.5 mt-[2.125rem] flex-wrap max-sm:flex-nowrap">
          <a
            className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-16 rounded-[var(--radius)] border border-transparent transition-[transform,background,border-color] duration-150 ease-[ease] cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)] max-sm:flex-1 max-sm:px-5"
            href="#projects"
          >
            {t("ctaProjects")}
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-20 rounded-[var(--radius)] border border-line transition-[transform,background,border-color] duration-150 ease-[ease] cursor-pointer no-underline bg-transparent text-fg hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] max-sm:flex-1 max-sm:px-5"
            href="#contact"
          >
            {t("ctaContact")}
          </a>
        </div>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="flex gap-9 mt-14 flex-wrap max-sm:flex-nowrap max-sm:justify-between max-sm:gap-2.5">
          <div className="max-sm:flex-1 max-sm:text-center">
            <div className="font-mono text-2xl font-semibold text-fg">
              {t("statYearsValue")}
            </div>
            <div className="text-[0.86rem] text-fg-muted mt-1">
              {t("statYears")}
            </div>
          </div>
          <div className="max-sm:flex-1 max-sm:text-center">
            <div className="font-mono text-2xl font-semibold text-fg">
              {t("statProjectsValue")}
            </div>
            <div className="text-[0.86rem] text-fg-muted mt-1">
              {t("statProjects")}
            </div>
          </div>
          <div className="max-sm:flex-1 max-sm:text-center">
            <div className="font-mono text-2xl font-semibold text-fg">
              {t("statClientsValue")}
            </div>
            <div className="text-[0.86rem] text-fg-muted mt-1">
              {t("statClients")}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
