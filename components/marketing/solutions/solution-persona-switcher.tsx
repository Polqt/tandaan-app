"use client";

import { CheckCircle2 } from "lucide-react";
import { ProductMockup } from "@/components/marketing/landing/product-mockup";
import { HandUnderline } from "@/components/marketing/shared/sketch-primitives";
import { useSolutionPersona } from "@/hooks/marketing/use-solution-persona";
import { cn } from "@/lib/utils";
import type { SolutionPersona } from "@/types/marketing";

type SolutionPersonaSwitcherProps = {
  personas: SolutionPersona[];
};

export function SolutionPersonaSwitcher({
  personas,
}: SolutionPersonaSwitcherProps) {
  const { selectedPersona, selectedPersonaId, setSelectedPersonaId } =
    useSolutionPersona(personas);

  if (!selectedPersona) {
    return null;
  }

  return (
    <section className="sketch-shell py-12 lg:py-16">
      <div className="flex flex-wrap gap-2 rounded-lg border border-[var(--color-sketch-line)] bg-white p-2 shadow-sm dark:bg-slate-950">
        {personas.map((persona) => (
          <button
            aria-pressed={persona.id === selectedPersonaId}
            className={cn(
              "relative min-h-12 flex-1 rounded-md px-4 text-sm font-black transition",
              persona.id === selectedPersonaId
                ? "bg-[var(--color-sketch-soft)] text-[var(--color-sketch-blue)]"
                : "text-[var(--color-sketch-muted)] hover:bg-[var(--color-sketch-soft)] hover:text-[var(--color-sketch-ink)]",
            )}
            id={persona.id}
            key={persona.id}
            onClick={() => setSelectedPersonaId(persona.id)}
            type="button"
          >
            {persona.label}
            {persona.id === selectedPersonaId ? (
              <HandUnderline className="-bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 bg-[var(--color-sketch-blue)]" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="sketch-card p-6">
          <p className="text-xs font-black uppercase text-[var(--color-sketch-blue)]">
            The Challenge
          </p>
          <h2 className="mt-4 text-2xl font-black text-[var(--color-sketch-ink)]">
            For {selectedPersona.label}
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-sketch-muted)]">
            {selectedPersona.challenge}
          </p>
          <div className="mt-8 rounded-lg border border-[var(--color-sketch-line)] bg-[var(--color-sketch-soft)] p-4">
            <p className="text-xs font-black uppercase text-[var(--color-sketch-muted)]">
              Relevant features
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selectedPersona.features.map((feature) => (
                <div
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-sketch-ink)]"
                  key={feature}
                >
                  <CheckCircle2 className="size-4 text-[var(--color-sketch-teal)]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="sketch-card p-6">
          <p className="text-xs font-black uppercase text-[var(--color-sketch-blue)]">
            Our Solution
          </p>
          <p className="mt-4 max-w-2xl text-lg font-black leading-8 text-[var(--color-sketch-ink)]">
            {selectedPersona.solution}
          </p>
          <div className="mt-6">
            <ProductMockup compact />
          </div>
        </article>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {selectedPersona.impact.map((metric) => (
          <article className="sketch-card p-6 text-center" key={metric.label}>
            <p className="text-5xl font-black text-[var(--color-sketch-blue)]">
              {metric.value}
            </p>
            <p className="mt-2 text-sm font-bold text-[var(--color-sketch-muted)]">
              {metric.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
