import type { ComponentProps } from "react";

/**
 * ApexCharts has no entry in Simple Icons; this is a generic bar-chart
 * pictogram (not the official brand mark) using their documented primary color.
 */
export function IconApexCharts(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 20h18v1.5H3zM5 18.5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1zm6.5 0a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM18 18.5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1Z" />
    </svg>
  );
}
