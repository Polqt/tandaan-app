"use client";

import { useMemo, useState } from "react";
import type { SolutionPersona, SolutionPersonaId } from "@/types/marketing";

export function useSolutionPersona(personas: SolutionPersona[]) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<SolutionPersonaId>(
    personas[0]?.id ?? "product-teams",
  );

  const selectedPersona = useMemo(
    () =>
      personas.find((persona) => persona.id === selectedPersonaId) ??
      personas[0],
    [personas, selectedPersonaId],
  );

  return {
    selectedPersona,
    selectedPersonaId,
    setSelectedPersonaId,
  };
}
