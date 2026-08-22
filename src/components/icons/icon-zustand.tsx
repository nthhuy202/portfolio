import type { ComponentProps } from "react";

/**
 * Zustand has no entry in Simple Icons; this is a generic paw-print
 * pictogram (not the official brand mark) referencing its bear mascot.
 */
export function IconZustand(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <ellipse cx="12" cy="15.5" rx="5" ry="4" />
      <circle cx="6.2" cy="8.4" r="2.1" />
      <circle cx="11.2" cy="5.6" r="2.1" />
      <circle cx="16.8" cy="6.4" r="2.1" />
    </svg>
  );
}
