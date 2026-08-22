import type { ComponentProps } from "react";

/**
 * Yup has no entry in Simple Icons; this is a generic checkmark pictogram
 * (not the official brand mark), matching its role as a validation library.
 */
export function IconYup(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  );
}
