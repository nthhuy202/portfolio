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
        "inline-flex items-center justify-center w-7 h-7 flex-none rounded-full text-fg-muted transition-colors duration-150 ease-[ease] hover:text-fg hover:bg-bg-raised-2 focus-visible:text-fg focus-visible:bg-bg-raised-2",
        isCopied && "text-[var(--color-accent)]",
      )}
      onClick={handleCopy}
      aria-label={isCopied ? t("linkCopied", { label }) : t("copyLink", { label })}
    >
      {isCopied ? <IconCheck className="w-4 h-4" aria-hidden="true" /> : <IconCopy className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}
