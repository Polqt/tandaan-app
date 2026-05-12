import { ArrowRight, Mail, Quote, Star } from "lucide-react";
import Link from "next/link";
import { FeatureDoodle } from "@/components/marketing/shared/sketch-primitives";
import { Button } from "@/components/ui/button";
import { landingFeatures, workflowSteps } from "@/lib/marketing/site-content";

const ratingStars = ["first", "second", "third", "fourth", "fifth"];

export function LandingFeatureGrid() {
  return (
    <section className="landing-panel sketch-shell flex flex-col justify-center py-10">
      <div>
        <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
          Powerful features for modern teams
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {landingFeatures.map((feature) => (
            <article
              className="sketch-card group min-h-64 p-6 transition duration-200 hover:-translate-y-1 hover:rotate-[-0.3deg] hover:shadow-[0_20px_44px_rgba(20,24,40,0.09)]"
              key={feature.title}
            >
              <h2 className="text-xl font-black text-[var(--color-sketch-ink)]">
                {feature.title}
              </h2>
              <p className="mt-4 max-w-76 text-sm leading-7 text-[var(--color-sketch-muted)]">
                {feature.body}
              </p>
              <FeatureDoodle className="mt-5" type={feature.illustration} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingWorkflow() {
  return (
    <section className="landing-panel sketch-shell flex flex-col justify-center py-10">
      <div>
        <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
          Your workflow, beautifully connected
        </p>
        <div className="sketch-card mt-8 grid gap-4 p-5 md:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <article
              className="relative flex min-h-48 flex-col items-center justify-center text-center"
              key={step.title}
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -left-6 top-1/2 hidden h-px w-12 bg-[var(--color-sketch-ink)] md:block"
                />
              ) : null}
              <div className="flex size-14 items-center justify-center rounded-lg border-[1.5px] border-[var(--color-sketch-ink)] bg-white shadow-[3px_3px_0_rgba(24,24,39,0.10)] dark:bg-slate-950">
                <step.icon className="size-7 text-[var(--color-sketch-ink)]" />
              </div>
              <h2 className="mt-4 text-lg font-black text-[var(--color-sketch-ink)]">
                {step.title}
              </h2>
              <p className="mt-2 max-w-40 text-xs leading-5 text-[var(--color-sketch-muted)]">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingProofCta() {
  return (
    <section className="landing-panel sketch-shell grid items-center gap-5 py-10 lg:grid-cols-[0.82fr_0.18fr_1fr]">
      <article className="sketch-card min-h-64 p-7">
        <Quote className="size-7 text-[var(--color-sketch-ink)]" />
        <blockquote className="mt-4 font-hand text-2xl leading-8 text-[var(--color-sketch-ink)]">
          Tandaan.AI changed the way our team works. It feels like Notion,
          Figma, and a time machine had a baby.
        </blockquote>
        <div className="mt-5 flex items-center gap-1 text-[var(--color-sketch-blue)]">
          {ratingStars.map((star) => (
            <Star className="size-4 fill-current" key={star} />
          ))}
        </div>
        <p className="mt-4 text-sm font-bold text-[var(--color-sketch-ink)]">
          Carlo, Head of Product at Flowbase
        </p>
      </article>

      <div className="hidden items-center justify-center lg:flex">
        <div className="relative size-28">
          <div className="absolute inset-4 rounded-full border-[1.5px] border-[var(--color-sketch-ink)] bg-white dark:bg-slate-950" />
          <div className="absolute left-1/2 top-9 size-8 -translate-x-1/2 rounded-full border-[1.5px] border-[var(--color-sketch-ink)] bg-[#fff1a8]" />
          <div className="absolute bottom-5 left-7 h-8 w-14 rounded-[50%] border-[1.5px] border-[var(--color-sketch-ink)] bg-[#fff1a8]" />
          <span className="absolute -right-1 top-3 font-hand text-xl text-[var(--color-sketch-ink)]">
            ok
          </span>
        </div>
      </div>

      <article className="sketch-card flex min-h-64 flex-col items-center justify-center p-7 text-center">
        <h2 className="max-w-sm text-3xl font-black leading-tight text-[var(--color-sketch-ink)]">
          Start building smarter workflows today.
        </h2>
        <Button asChild className="sketch-primary-button mt-6 h-12 px-10">
          <Link href="/documents">
            Get Started Free
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        <p className="relative mt-5 text-sm text-[var(--color-sketch-muted)]">
          No credit card required
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-1/2 h-0.5 w-40 -translate-x-1/2 bg-[var(--color-sketch-teal)]"
          />
        </p>
      </article>
    </section>
  );
}

export function LandingFinalCta() {
  return (
    <section className="landing-panel sketch-shell flex flex-col justify-center py-10">
      <div className="sketch-card relative overflow-hidden p-7 md:p-9">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
              Ready to remember what matters?
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-sketch-muted)]">
              Join thousands of teams already using Tandaan.AI to keep ideas,
              decisions, and collaboration history in one calm workspace.
            </p>
            <form
              action="/sign-in"
              className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <label className="sr-only" htmlFor="landing-email">
                Work email
              </label>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-sketch-muted)]" />
                <input
                  className="h-12 w-full rounded-lg border border-[var(--color-sketch-line)] bg-white pl-10 pr-4 text-sm text-[var(--color-sketch-ink)] outline-none transition placeholder:text-[var(--color-sketch-muted)] focus:border-[var(--color-sketch-blue)] focus:ring-4 focus:ring-[var(--color-sketch-blue)]/10 dark:bg-slate-950"
                  id="landing-email"
                  placeholder="Enter your work email"
                  type="email"
                />
              </div>
              <Button className="sketch-primary-button h-12 px-7" type="submit">
                Get Started Free
              </Button>
            </form>
          </div>

          <div className="relative hidden size-36 md:block">
            <div className="absolute inset-4 rounded-full border-[1.5px] border-[var(--color-sketch-ink)] bg-[#fff1a8]" />
            <div className="absolute left-1/2 top-8 size-8 -translate-x-1/2 rounded-full border-[1.5px] border-[var(--color-sketch-ink)] bg-white" />
            <div className="absolute left-9 top-20 h-10 w-20 rounded-[50%] border-[1.5px] border-[var(--color-sketch-ink)] bg-white" />
            <div className="absolute right-0 top-0 h-14 w-12 border-l-[1.5px] border-[var(--color-sketch-ink)]">
              <span className="absolute left-0 top-0 h-px w-12 bg-[var(--color-sketch-ink)]" />
              <span className="absolute left-0 top-9 h-px w-10 bg-[var(--color-sketch-ink)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
