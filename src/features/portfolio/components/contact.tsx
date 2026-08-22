import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="shell" style={{ borderBottom: "none" }}>
      <Reveal className="section-head">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
      </Reveal>
      <Reveal className="contact-box">
        <p className="lede contact-blurb">{t("blurb")}</p>
        <div className="contact-links">
          <a className="btn btn-primary" href="mailto:nthhuy202@gmail.com">
            nthhuy202@gmail.com
          </a>
        </div>
      </Reveal>
    </section>
  );
}
