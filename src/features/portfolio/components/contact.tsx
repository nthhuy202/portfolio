import { useTranslations } from "next-intl";
import { Reveal } from "@/features/portfolio/components/reveal";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 relative max-w-[68.75rem] mx-auto px-6">
      <Reveal className="mb-11 max-w-[40rem]">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent flex items-center gap-[0.6em]">{t("eyebrow")}</p>
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-bold tracking-[-0.01em] mt-2.5">{t("title")}</h2>
      </Reveal>
      <Reveal className="bg-bg-raised border border-line rounded-lg p-11 flex flex-col items-start gap-[1.625rem]">
        <p className="text-fg-muted text-base leading-[1.65] max-w-none w-full m-0">{t("blurb")}</p>
        <div className="flex gap-4 flex-wrap">
          <a
            className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-5 rounded-[var(--radius)] border border-transparent transition-[transform,background,border-color] duration-150 ease-[ease] cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)]"
            href="mailto:nthhuy202@gmail.com"
          >
            nthhuy202@gmail.com
          </a>
        </div>
      </Reveal>
    </section>
  );
}
