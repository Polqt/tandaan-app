import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/product/product-page";

export const metadata: Metadata = {
  title: "Product | Tandaan.AI",
  description:
    "Explore Tandaan.AI collaboration, replay, analytics, comments, version history, permissions, and integrations.",
};

export default function ProductRoute() {
  return <ProductPage />;
}
