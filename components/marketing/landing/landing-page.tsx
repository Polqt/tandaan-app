import { HeroSection } from "@/components/marketing/landing/hero-section";
import {
  LandingFeatureGrid,
  LandingFinalCta,
  LandingProofCta,
  LandingWorkflow,
} from "@/components/marketing/landing/landing-sections";
import PublicFooter from "@/components/marketing/shared/public-footer";

export default function LandingPage() {
  return (
    <div className="tandaan-page">
      <div className="sketch-grain pointer-events-none fixed inset-0 z-0 opacity-80" />
      <div className="landing-scroll relative z-10">
        <HeroSection />
        <LandingFeatureGrid />
        <LandingWorkflow />
        <LandingProofCta />
        <LandingFinalCta />
        <section className="landing-panel flex items-end">
          <div className="w-full">
            <PublicFooter />
          </div>
        </section>
      </div>
    </div>
  );
}
