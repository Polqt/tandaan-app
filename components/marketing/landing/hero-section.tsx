import { CirclePlay } from "lucide-react";
import Link from "next/link";
import { ProductMockup } from "@/components/marketing/landing/product-mockup";
import {
  AvatarCluster,
  HandUnderline,
  PaperPlaneDoodle,
  SketchStar,
} from "@/components/marketing/shared/sketch-primitives";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="landing-panel sketch-shell relative grid gap-10 py-9 lg:grid-cols-[0.62fr_1fr] lg:items-center">
      <PaperPlaneDoodle className="absolute right-[22%] top-5 hidden rotate-[-8deg] lg:block" />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-sketch-line)] bg-white/80 px-3 py-2 text-xs font-black text-[var(--color-sketch-ink)] shadow-sm dark:bg-slate-950/80">
          <SketchStar className="size-4" />
          Built for teams who think together
        </div>

        <h1 className="mt-7 max-w-[10ch] text-[clamp(3.25rem,7vw,5.85rem)] font-black leading-[0.98] tracking-[0] text-[var(--color-sketch-ink)]">
          Your ideas,
          <br />
          <span className="relative inline-block">
            remembered.
            <HandUnderline />
          </span>
          <br />
          Together.
        </h1>

        <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--color-sketch-muted)]">
          Collaborate in real time, capture knowledge, and replay every step of
          your team's thinking. All in one beautiful workspace.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild className="sketch-primary-button h-12 px-6">
            <Link href="/documents">Get Started Free</Link>
          </Button>
          <Button
            asChild
            className="h-12 rounded-lg border-[1.5px] border-[var(--color-sketch-ink)] bg-white px-5 text-[var(--color-sketch-ink)] hover:bg-[var(--color-sketch-soft)] dark:bg-slate-950"
            variant="outline"
          >
            <Link href="/blog/narrative-replays">
              <CirclePlay data-icon="inline-start" />
              Watch Demo
            </Link>
          </Button>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-[var(--color-sketch-muted)]">
          <AvatarCluster />
          <span>Loved by 2,000+ teams worldwide</span>
        </div>
      </div>

      <div className="relative min-h-[29rem]">
        <ProductMockup />
      </div>
    </section>
  );
}
