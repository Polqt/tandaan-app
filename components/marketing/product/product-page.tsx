import { ArrowRight, CirclePlay, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";
import { ProductMockup } from "@/components/marketing/landing/product-mockup";
import { ProductTabs } from "@/components/marketing/product/product-tabs";
import PublicFooter from "@/components/marketing/shared/public-footer";
import {
  HandUnderline,
  PaperPlaneDoodle,
  SketchStar,
} from "@/components/marketing/shared/sketch-primitives";
import { Button } from "@/components/ui/button";
import {
  accentClassNames,
  productFeatureGrid,
  productTabs,
  productUseCases,
  workflowSteps,
} from "@/lib/marketing/site-content";

const faqs = [
  {
    answer:
      "Tandaan.AI is a collaborative document workspace with comments, replay, analytics, and workflows built into the writing surface.",
    question: "What is Tandaan.AI?",
  },
  {
    answer:
      "Yes. Teams can start free, then upgrade when they need longer replay history, more documents, and expanded collaboration controls.",
    question: "Can I use Tandaan for free?",
  },
  {
    answer:
      "Replay captures meaningful document activity, comments, and decisions so teammates can review the story behind the final version.",
    question: "How does session replay work?",
  },
  {
    answer:
      "The public API is planned around documents, replay links, and team analytics. Integrations are designed to stay lightweight.",
    question: "Do you have an API?",
  },
];

export function ProductPage() {
  return (
    <div className="tandaan-page">
      <div className="sketch-grain pointer-events-none fixed inset-0 z-0 opacity-80" />
      <div className="relative z-10">
        <section className="sketch-shell relative grid min-h-[calc(100dvh-74px)] items-center gap-10 py-12 lg:grid-cols-[0.62fr_1fr]">
          <PaperPlaneDoodle className="absolute right-[18%] top-8 hidden rotate-[-7deg] lg:block" />
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-sketch-line)] bg-white/80 px-3 py-2 text-xs font-black text-[var(--color-sketch-ink)] shadow-sm dark:bg-slate-950/80">
              <SketchStar className="size-4" />
              Built for how teams create and remember together
            </div>
            <h1 className="mt-7 max-w-[12ch] text-[clamp(3.1rem,6.5vw,5.4rem)] font-black leading-[0.98] text-[var(--color-sketch-ink)]">
              One workspace.
              <br />
              <span className="relative inline-block">
                Infinite clarity.
                <HandUnderline />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--color-sketch-muted)]">
              Collaborate, capture, and replay every step of your team's
              thinking in one real-time document workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
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
          </div>
          <ProductMockup />
        </section>

        <ProductTabs tabs={productTabs} />

        <section className="sketch-shell border-t border-[var(--color-sketch-line)] py-12 lg:py-16">
          <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
            See how Tandaan.AI works
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {workflowSteps.map((step, index) => (
              <article
                className="sketch-card min-h-44 p-5 text-center"
                key={step.title}
              >
                <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-[var(--color-sketch-line)] bg-white dark:bg-slate-950">
                  <step.icon className="size-6 text-[var(--color-sketch-ink)]" />
                </div>
                <span className="mt-4 inline-flex size-5 items-center justify-center rounded-full bg-[var(--color-sketch-blue)] text-[10px] font-black text-white">
                  {index + 1}
                </span>
                <h2 className="mt-3 text-base font-black text-[var(--color-sketch-ink)]">
                  {step.title}
                </h2>
                <p className="mt-2 text-xs leading-5 text-[var(--color-sketch-muted)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="sketch-shell border-t border-[var(--color-sketch-line)] py-12 lg:py-16"
          id="integrations"
        >
          <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
            Everything you need in one place
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productFeatureGrid.map((feature) => (
              <article className="sketch-card min-h-52 p-5" key={feature.title}>
                <div
                  className={`mb-8 flex size-11 items-center justify-center rounded-lg border ${accentClassNames[feature.accent]}`}
                >
                  <feature.icon className="size-5" />
                </div>
                <h2 className="text-xl font-black text-[var(--color-sketch-ink)]">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-sketch-muted)]">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="sketch-shell border-t border-[var(--color-sketch-line)] py-12 lg:py-16">
          <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
            Built for teams of all kinds
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productUseCases.map((item) => (
              <Link
                className="sketch-card group min-h-36 p-5 transition hover:-translate-y-1"
                href="/solutions"
                key={item.title}
              >
                <FileText className="size-7 text-[var(--color-sketch-blue)]" />
                <h2 className="mt-4 text-lg font-black text-[var(--color-sketch-ink)]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-sketch-muted)]">
                  {item.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[var(--color-sketch-blue)]">
                  Learn more
                  <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="sketch-shell py-8">
          <div className="relative overflow-hidden rounded-lg border border-[var(--color-sketch-line)] bg-[var(--color-sketch-blue)] p-6 text-white shadow-[0_20px_44px_rgba(81,104,246,0.22)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Start your first collaborative document today.
                </h2>
                <p className="mt-2 text-sm text-white/82">
                  No credit card required.
                </p>
              </div>
              <Button
                asChild
                className="h-12 bg-white px-8 text-[var(--color-sketch-blue)] hover:bg-white/90"
              >
                <Link href="/documents">
                  Get Started Free
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <PaperPlaneDoodle className="absolute bottom-1 right-7 size-20 text-white/65" />
          </div>
        </section>

        <section className="sketch-shell border-t border-[var(--color-sketch-line)] py-12">
          <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
            Frequently asked questions
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {faqs.map((item) => (
              <details className="sketch-card group p-4" key={item.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[var(--color-sketch-ink)]">
                  {item.question}
                  <HelpCircle className="size-4 text-[var(--color-sketch-blue)]" />
                </summary>
                <p className="mt-4 text-sm leading-7 text-[var(--color-sketch-muted)]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  );
}
