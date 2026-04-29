import type { Metadata } from "next";
import BillingPage from "@/components/marketing/billing/billing-page";

export const metadata: Metadata = {
  title: "Billing | Tandaan",
  description:
    "Simple Tandaan billing with a free workspace and Pro upgrade for unlimited documents and full replay history.",
};

export default function PublicBillingPage() {
  return <BillingPage />;
}
