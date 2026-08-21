"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[], navSelector: string): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const navElement = document.querySelector<HTMLElement>(navSelector);
    const navHeight = navElement?.offsetHeight ?? 64;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `-${navHeight}px 0px -50% 0px`, threshold: 0 }
    );

    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
    // sectionIds is a module-level constant array in every caller; re-running
    // this effect per render would just re-observe the same elements.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navSelector, sectionIds.join(",")]);

  return activeId;
}
