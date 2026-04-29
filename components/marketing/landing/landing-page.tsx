import { HeroSection } from "@/components/marketing/landing/hero-section";
import {
  BillingTeaser,
  BlogTeaser,
  FaqSection,
  LandingFeatureStrip,
  ReplaySection,
  WorkflowSection,
} from "@/components/marketing/landing/landing-sections";
import PublicFooter from "@/components/marketing/shared/public-footer";

export default function LandingPage() {
  return (
    <div className="public-page">
      <div className="paper-grain pointer-events-none fixed inset-0 z-0 opacity-70" />
      <div className="relative z-10">
        <HeroSection />
        <LandingFeatureStrip />
        <WorkflowSection />
        <ReplaySection />
        <BillingTeaser />
        <BlogTeaser />
        <FaqSection />
        <PublicFooter />
      </div>
    </div>
  );
}
