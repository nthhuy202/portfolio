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
    <section id="focus" className="py-24 border-b border-line relative overflow-hidden">
      <div className="max-w-[68.75rem] mx-auto px-6">
        <Reveal className="mb-11 max-w-[40rem]">
          <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
        </Reveal>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {trackWords.map((word, index) => (
            <span className="font-mono font-bold text-[clamp(1.6rem,4.4vw,2.7rem)] tracking-[-0.01em] text-fg-muted flex items-center gap-10 whitespace-nowrap pr-10" key={`${word}-${index}`}>
              {word} <span className="text-accent">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
