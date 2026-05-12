"use client";

import { Check } from "lucide-react";
import { ProductMockup } from "@/components/marketing/landing/product-mockup";
import { HandUnderline } from "@/components/marketing/shared/sketch-primitives";
import { useProductTab } from "@/hooks/marketing/use-product-tab";
import { cn } from "@/lib/utils";
import type { ProductTab } from "@/types/marketing";

type ProductTabsProps = {
  tabs: ProductTab[];
};

export function ProductTabs({ tabs }: ProductTabsProps) {
  const { activeTab, setActiveTab } = useProductTab(tabs[0]?.id);
  const selectedTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  if (!selectedTab) {
    return null;
  }

  return (
    <section className="sketch-shell py-12 lg:py-16" id="core-features">
      <div className="border-y border-[var(--color-sketch-line)] py-5">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
            Core Features
          </p>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                aria-pressed={tab.id === activeTab}
                className={cn(
                  "relative min-h-11 rounded-lg px-4 text-sm font-bold transition",
                  tab.id === activeTab
                    ? "bg-[var(--color-sketch-soft)] text-[var(--color-sketch-blue)]"
                    : "text-[var(--color-sketch-muted)] hover:bg-[var(--color-sketch-soft)] hover:text-[var(--color-sketch-ink)]",
                )}
                id={tab.id}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.title}
                {tab.id === activeTab ? (
                  <HandUnderline className="-bottom-1 left-3 h-1 w-[calc(100%-1.5rem)] bg-[var(--color-sketch-blue)]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.62fr_1fr]">
        <div>
          <h2 className="max-w-sm text-3xl font-black leading-tight text-[var(--color-sketch-ink)]">
            {selectedTab.title} that feels natural.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-[var(--color-sketch-muted)]">
            {selectedTab.body}
          </p>
          <ul className="mt-6 grid gap-3">
            {selectedTab.bullets.map((bullet) => (
              <li
                className="flex items-center gap-3 text-sm font-semibold text-[var(--color-sketch-ink)]"
                key={bullet}
              >
                <Check className="size-4 text-[var(--color-sketch-blue)]" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <ProductMockup compact />
      </div>
    </section>
  );
}
