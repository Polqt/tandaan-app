import { ArrowRight, Check, FileText, PlayCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PaperStackIllustration from "@/components/marketing/shared/paper-stack-illustration";
import PublicFooter from "@/components/marketing/shared/public-footer";
import { Button } from "@/components/ui/button";
import {
  accentClassNames,
  featureDeepDives,
  featurePillars,
  workflowSteps,
} from "@/lib/marketing/site-content";

export const metadata: Metadata = {
  title: "Features | Tandaan",
  description:
    "Rooms, notes, replays, comments, and trust traces for collaborative document work.",
};

export default function FeaturesPage() {
  return (
    <div className="public-page">
      <div className="paper-grain pointer-events-none fixed inset-0 z-0 opacity-70" />
      <div className="relative z-10">
        <section className="public-shell grid min-h-[72vh] items-center gap-10 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:py-20">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.02] text-(--color-paper-ink) sm:text-6xl">
              Everything your document remembers
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-(--color-paper-muted) sm:text-xl sm:leading-9">
              Tandaan turns notes, comments, files, people, and replay history
              into one working artifact your team can inspect later.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                className="paper-button paper-button-red h-12 px-6"
              >
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
                <Link href="/blog/narrative-replays">
                  Read about replay
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="hero-object relative min-h-120">
            <PaperStackIllustration compact showRoomCard={false} />
            <div className="paper-note absolute bottom-[12%] right-[9%] hidden w-56 rotate-[5deg] bg-[#fff1b8] lg:block">
              <p className="font-hand text-2xl leading-6 text-(--color-paper-ink)">
                Rooms keep the messy parts together.
              </p>
            </div>
          </div>
        </section>

        <section className="public-torn-section py-16 lg:py-24">
          <div className="public-shell grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featurePillars.map((feature) => (
              <article className="paper-panel min-h-72 p-5" key={feature.title}>
                <div
                  className={`mb-8 flex size-10 items-center justify-center border ${accentClassNames[feature.accent]}`}
                >
                  <feature.icon className="size-5" />
                </div>
                <h2 className="text-2xl font-bold leading-tight text-(--color-paper-ink)">
                  {feature.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-(--color-paper-muted)">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-shell py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="text-4xl font-bold text-(--color-paper-ink) sm:text-5xl">
                Built around the actual work
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-(--color-paper-muted)">
                The product stays close to the document surface, but it keeps
                enough structure for teams to find the why behind the what.
              </p>
            </div>
            <div className="space-y-4">
              {featureDeepDives.map((item) => (
                <article className="paper-ledger p-5" key={item.label}>
                  <div className="grid gap-4 sm:grid-cols-[5rem_1fr]">
                    <span className="font-hand text-5xl text-paper-blue">
                      {item.label}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-(--color-paper-ink)">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base leading-8 text-(--color-paper-muted)">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-band py-16 lg:py-24">
          <div className="public-shell">
            <h2 className="max-w-2xl text-4xl font-bold text-(--color-paper-ink) sm:text-5xl">
              From loose note to replayable decision
            </h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <article className="paper-panel min-h-68 p-5" key={step.title}>
                  <span
                    className="flex size-8 items-center justify-center rounded-full border-2 border-(--color-paper-ink) font-hand text-xl font-bold text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </span>
                  <step.icon className="mt-7 size-7 text-(--color-paper-ink)" />
                  <h3 className="mt-5 text-2xl font-bold leading-tight text-(--color-paper-ink)">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-(--color-paper-muted)">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-shell grid gap-5 py-16 md:grid-cols-3 lg:py-24">
          {["Live documents", "Replay chapters", "Shareable context"].map(
            (label, index) => (
              <div
                className="paper-panel flex min-h-48 flex-col justify-between p-5"
                key={label}
              >
                {index === 0 ? (
                  <FileText className="size-8 text-paper-red" />
                ) : index === 1 ? (
                  <PlayCircle className="size-8 text-paper-blue" />
                ) : (
                  <Check className="size-8 text-paper-green" />
                )}
                <p className="font-hand text-3xl text-(--color-paper-ink)">
                  {label}
                </p>
              </div>
            ),
          )}
        </section>

        <PublicFooter />
      </div>
    </div>
  );
}
