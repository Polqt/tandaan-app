import { FREE_DOC_LIMIT, PLAN_LIMITS } from "@/types/billing";

export const publicBillingTiers = [
  {
    accent: "ink",
    cta: "Start free",
    description:
      "For personal notes, first projects, and small collaboration loops.",
    featured: false,
    name: PLAN_LIMITS.free.label,
    points: [
      `Up to ${FREE_DOC_LIMIT} documents`,
      "7-day replay timeline",
      "2 public replay links",
      "Community support",
    ],
    price: "PHP 0",
    priceNote: "forever",
  },
  {
    accent: "red",
    cta: `Upgrade to Pro - PHP ${PLAN_LIMITS.pro.price}/mo`,
    description:
      "For teams who need deeper replay context and unlimited working space.",
    featured: true,
    name: PLAN_LIMITS.pro.label,
    points: [
      "Unlimited documents",
      "Full replay timeline and chapters",
      "AI session summaries",
      "Priority support",
    ],
    price: `PHP ${PLAN_LIMITS.pro.price}`,
    priceNote: "per month",
  },
] as const;

export const billingQuestions = [
  {
    answer:
      "Yes. The free plan is designed for trying Tandaan with real notes before committing to Pro.",
    question: "Can I use Tandaan for free?",
  },
  {
    answer:
      "The app uses PayMongo checkout. Signed-in users can start upgrade checkout from the billing page or from the workspace limit banner.",
    question: "How does upgrade checkout work?",
  },
  {
    answer:
      "Your documents stay intact. The workspace returns to free-plan limits for new document creation.",
    question: "What happens if I cancel Pro?",
  },
];
