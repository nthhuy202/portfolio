import type { ComponentProps } from "react";

/**
 * AOS (Animate On Scroll) has no entry in Simple Icons; this is a generic
 * scroll-reveal pictogram (not the official brand mark).
 */
export function IconAos(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20V6" />
      <path d="M6.5 11.5 12 6l5.5 5.5" />
      <path d="M4 21h16" />
    </svg>
  );
}
