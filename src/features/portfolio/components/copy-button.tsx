"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconCheck, IconCopy } from "@/components/icons";
import { cn } from "@/utils/cn";

const COPIED_RESET_DELAY_MS = 2500;

interface CopyButtonProps {
  value: string;
  label: string;
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const t = useTranslations("a11y");
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), COPIED_RESET_DELAY_MS);
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center w-[2.125rem] h-[2.125rem] flex-none rounded-full border border-line text-fg-muted transition-colors duration-150 ease-[ease] hover:text-fg hover:border-[var(--color-accent)] focus-visible:text-fg focus-visible:border-[var(--color-accent)]",
        isCopied && "text-[var(--color-accent)] border-[var(--color-accent)]",
      )}
      onClick={handleCopy}
      aria-label={isCopied ? t("linkCopied", { label }) : t("copyLink", { label })}
    >
      {isCopied ? <IconCheck className="w-4 h-4" aria-hidden="true" /> : <IconCopy className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}
