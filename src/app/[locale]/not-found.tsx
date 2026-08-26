import { getTranslations } from "next-intl/server";
import { Nav } from "@/features/portfolio/components/nav";
import { Footer } from "@/features/portfolio/components/footer";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  const t = await getTranslations("notFound");

  return { title: t("title") };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-[68.75rem] mx-auto">
        <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent">{t("eyebrow")}</p>
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] mt-[1.125rem]">
          {t("title")}
        </h1>
        <p className="mt-[1.375rem] max-w-[48ch] text-fg-muted text-[1.06rem] leading-[1.7]">
          {t("description")}
        </p>
        <Link
          className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-8 rounded-[var(--radius)] border border-transparent transition-[transform,background,border-color] duration-150 ease-[ease] cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)] mt-[2.125rem]"
          href="/"
        >
          {t("backHome")}
        </Link>
      </section>
      <Footer />
    </main>
  );
}
