import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import PaperStackIllustration from "@/components/marketing/shared/paper-stack-illustration";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="public-hero public-shell grid items-center gap-8 py-5 sm:gap-10 sm:py-8 lg:min-h-[42rem] lg:grid-cols-[0.94fr_1.06fr] lg:py-12">
      <div className="relative z-10 max-w-3xl">
        <h1 className="public-hero-title max-w-[8.8ch]">Remember together</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-(--color-paper-muted) sm:text-xl sm:leading-9">
          Your living workspace for notes, rooms, and replayable decisions.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Button asChild className="paper-button paper-button-red h-12 px-6">
            <Link href="/documents">
              Start writing
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="paper-link-button h-12 px-2"
            variant="ghost"
          >
            <Link href="/billing">
              View pricing
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex max-w-md items-start gap-3">
          <div className="mt-1 flex size-9 shrink-0 items-center justify-center border border-(--color-paper-ink) bg-[#fff3b8]">
            <Check className="size-4" />
          </div>
          <p className="font-hand text-lg leading-6 text-(--color-paper-muted) sm:text-xl">
            Built for teams who think in notes, decisions, and context.
          </p>
        </div>
      </div>

      <div className="hero-object relative min-h-68 overflow-visible lg:min-h-[32rem]">
        <PaperStackIllustration />
      </div>
    </section>
  );
}
