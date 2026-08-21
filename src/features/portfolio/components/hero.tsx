import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="hero shell">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1>
        {t("hi")} <span className="accent">Alex Tran</span>.<br />
        {t("role")}
      </h1>
      <p className="pitch">{t("pitch")}</p>
      <div className="hero-ctas">
        <a className="btn btn-primary" href="#projects">
          {t("ctaProjects")}
        </a>
        <a className="btn btn-ghost" href="#contact">
          {t("ctaContact")}
        </a>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <div className="n">6+</div>
          <div className="l">{t("statYears")}</div>
        </div>
        <div className="stat">
          <div className="n">24</div>
          <div className="l">{t("statProjects")}</div>
        </div>
        <div className="stat">
          <div className="n">3</div>
          <div className="l">{t("statTeams")}</div>
        </div>
      </div>
    </section>
  );
}
