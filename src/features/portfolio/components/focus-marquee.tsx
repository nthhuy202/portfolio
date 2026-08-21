import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { focusKeywords } from "@/features/portfolio/constants/keywords";
import { isSupportedLocale } from "@/i18n/routing";

export function FocusMarquee() {
  const t = useTranslations("focus");
  const rawLocale = useLocale();
  const locale = isSupportedLocale(rawLocale) ? rawLocale : "en";
  const words = focusKeywords[locale];
  const trackWords = [...words, ...words];

  return (
    <section id="focus" className="focus-section">
      <div className="shell">
        <Reveal className="section-head">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
        </Reveal>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {trackWords.map((word, index) => (
            <span className="marquee-item" key={`${word}-${index}`}>
              {word} <span className="dash">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
