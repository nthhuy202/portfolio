import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="pt-[120px] pb-[110px] border-b border-line relative max-w-[1100px] mx-auto px-6">
      <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
      <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold tracking-[-0.03em] leading-[1.05] mt-[18px]">
        {t("hi")} <span className="text-accent">Alex Tran</span>.<br />
        {t("role")}
      </h1>
      <p className="mt-[22px] max-w-[58ch] text-[1.06rem] leading-[1.7] text-fg-muted">{t("pitch")}</p>
      <div className="flex gap-3.5 mt-[34px] flex-wrap max-[600px]:flex-nowrap">
        <a
          className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-5 rounded-[var(--radius)] border border-transparent transition-[transform,background,border-color] duration-150 ease cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)] max-[600px]:flex-1"
          href="#projects"
        >
          {t("ctaProjects")}
        </a>
        <a
          className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-5 rounded-[var(--radius)] border border-line transition-[transform,background,border-color] duration-150 ease cursor-pointer no-underline bg-transparent text-fg hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--color-accent)_50%,var(--color-line))] max-[600px]:flex-1"
          href="#contact"
        >
          {t("ctaContact")}
        </a>
      </div>
      <div className="flex gap-9 mt-14 flex-wrap max-[600px]:flex-nowrap max-[600px]:justify-between max-[600px]:gap-2.5">
        <div className="max-[600px]:flex-1 max-[600px]:text-center">
          <div className="font-mono text-2xl font-semibold text-fg">6+</div>
          <div className="text-[0.86rem] text-fg-muted mt-1">{t("statYears")}</div>
        </div>
        <div className="max-[600px]:flex-1 max-[600px]:text-center">
          <div className="font-mono text-2xl font-semibold text-fg">24</div>
          <div className="text-[0.86rem] text-fg-muted mt-1">{t("statProjects")}</div>
        </div>
        <div className="max-[600px]:flex-1 max-[600px]:text-center">
          <div className="font-mono text-2xl font-semibold text-fg">3</div>
          <div className="text-[0.86rem] text-fg-muted mt-1">{t("statTeams")}</div>
        </div>
      </div>
    </section>
  );
}
