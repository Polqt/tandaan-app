import type { Metadata } from "next";
import { SolutionsPage } from "@/components/marketing/solutions/solutions-page";

export const metadata: Metadata = {
  title: "Solutions | Tandaan.AI",
  description:
    "Use Tandaan.AI for product teams, designers, students, and startups that need clearer async collaboration.",
};

export default function SolutionsRoute() {
  return <SolutionsPage />;
}
