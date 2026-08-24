import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";
import { ContactLinks } from "@/features/portfolio/components/contact-links";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 relative max-w-[68.75rem] mx-auto px-6">
      <Reveal className="mb-11 max-w-[40rem]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal>
        <ContactLinks blurb={t("blurb")} />
      </Reveal>
    </section>
  );
}
