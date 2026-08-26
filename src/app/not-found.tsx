import Link from "next/link";

export const metadata = { title: "Page not found" };

// Catches paths that don't resolve to a supported locale (e.g. "/xx/foo") —
// the [locale] layout's isSupportedLocale check never runs for these, so
// there's no next-intl context/Nav here. Plain next/link (not next-intl's)
// since there is no resolved locale to prefix a link with.
export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-bg text-fg">
      <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-accent">404</p>
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] mt-[1.125rem]">
        Page not found
      </h1>
      <p className="mt-[1.375rem] max-w-[48ch] text-fg-muted text-[1.06rem] leading-[1.7]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-8 rounded-[var(--radius)] border border-transparent transition-[transform,background,border-color] duration-150 ease-[ease] cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)] mt-[2.125rem]"
        href="/en"
      >
        Back to home
      </Link>
    </div>
  );
}
