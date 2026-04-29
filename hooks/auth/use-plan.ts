import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import type { Plan } from "@/types/billing";

export function usePlan(): { plan: Plan; isLoading: boolean } {
  const { user, isLoaded } = useUser();

  const { data, isLoading } = useQuery({
    enabled: isLoaded && Boolean(user?.id),
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const res = await fetch("/api/users/plan");
      if (!res.ok) throw new Error("Failed to fetch plan");
      const json = (await res.json()) as { plan: Plan };
      return json.plan;
    },
    queryKey: ["user-plan", user?.id],
    staleTime: 5 * 60 * 1000,
  });

  return {
    isLoading: !isLoaded || isLoading,
    plan: data ?? "free",
  };
}
