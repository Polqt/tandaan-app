export type Plan = "free" | "pro";

export const PLAN_LIMITS = {
  free: {
    documents: 3,
    label: "Free",
    price: 0,
  },
  pro: {
    documents: Infinity,
    label: "Pro",
    price: 299, // PHP per month
  },
} as const satisfies Record<
  Plan,
  { documents: number; label: string; price: number }
>;

export const FREE_DOC_LIMIT = PLAN_LIMITS.free.documents;
