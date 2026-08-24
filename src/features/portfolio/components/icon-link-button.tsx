import type { CSSProperties } from "react";
import type { IconLink } from "@/features/portfolio/types/content";

interface IconLinkButtonProps {
  iconLink: IconLink;
}

export function IconLinkButton({ iconLink }: IconLinkButtonProps) {
  const { Icon, href, label, brandColor, displayText } = iconLink;

  return (
    <a
      className="inline-flex items-center h-[2.125rem] max-w-[2.125rem] overflow-hidden rounded-full border border-line text-fg-muted no-underline transition-[max-width,color,border-color,background-color] duration-300 ease-[ease] hover:text-fg hover:border-[var(--color-accent)] hover:max-w-[16rem] focus-visible:text-fg focus-visible:border-[var(--color-accent)] focus-visible:bg-[color-mix(in_srgb,var(--brand-color)_12%,transparent)] focus-visible:max-w-[16rem] motion-reduce:transition-none"
      style={{ "--brand-color": brandColor } as CSSProperties}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
    >
      <span className="w-[2.125rem] h-[2.125rem] flex-none flex items-center justify-center">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </span>
      <span className="whitespace-nowrap pr-4 pl-1 font-mono text-[0.82rem]">
        {displayText}
      </span>
    </a>
  );
}
