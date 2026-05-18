import { HeroSection } from "@/components/marketing/landing/hero-section";
import {
  LandingFaq,
  LandingFeatureGrid,
  LandingFinalCta,
  LandingProofCta,
  LandingWorkflow,
  LandingWorkspaceShowcase,
} from "@/components/marketing/landing/landing-sections";
import PublicFooter from "@/components/marketing/shared/public-footer";

export default function LandingPage() {
  return (
    <div className="bg-[#fbfbfa]">
      <HeroSection />
      <LandingFeatureGrid />
      <LandingWorkflow />
      <LandingWorkspaceShowcase />
      <LandingProofCta />
      <LandingFaq />
      <LandingFinalCta />
      <PublicFooter />
    </div>
  );
}
