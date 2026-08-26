import { CopyButton } from "@/features/portfolio/components/copy-button";
import { getCopyValue } from "@/features/portfolio/utils/contact";
import type { IconLink } from "@/features/portfolio/types/content";

interface IconLinkButtonProps {
  iconLink: IconLink;
}

export function IconLinkButton({ iconLink }: IconLinkButtonProps) {
  const { Icon, href, label, displayText } = iconLink;

  return (
    <div className="group flex w-full sm:w-auto items-center justify-between h-[2.125rem] rounded-full border border-line text-fg-muted overflow-hidden transition-colors duration-150 ease-[ease] hover:text-fg hover:border-accent focus-within:text-fg focus-within:border-accent">
      <a
        className="inline-flex items-center h-full no-underline"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
      >
        <span className="w-[2.125rem] h-[2.125rem] flex-none flex items-center justify-center">
          {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
        </span>
        <span className="grid grid-cols-[1fr] sm:grid-cols-[0fr] sm:group-hover:grid-cols-[1fr] sm:group-focus-within:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-[ease] motion-reduce:transition-none">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[0.82rem]">
            {displayText}
          </span>
        </span>
      </a>
      <span className="grid grid-cols-[1fr] sm:grid-cols-[0fr] sm:group-hover:grid-cols-[1fr] sm:group-focus-within:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-[ease] motion-reduce:transition-none">
        <span className="overflow-hidden flex items-center pr-1">
          <CopyButton value={getCopyValue(href)} label={label} />
        </span>
      </span>
    </div>
  );
}
