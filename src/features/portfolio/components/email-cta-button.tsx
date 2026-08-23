interface EmailCtaButtonProps {
  email: string;
}

export function EmailCtaButton({ email }: EmailCtaButtonProps) {
  return (
    <a
      className="inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold py-3 px-5 rounded-[var(--radius)] border border-transparent transition-[transform,background,border-color] duration-150 ease-[ease] cursor-pointer no-underline bg-accent text-[#1a0a02] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,white_12%)]"
      href={`mailto:${email}`}
    >
      {email}
    </a>
  );
}
