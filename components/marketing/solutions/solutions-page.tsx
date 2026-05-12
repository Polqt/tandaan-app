import { ArrowRight, HelpCircle, Quote, Star } from "lucide-react";
import Link from "next/link";
import PublicFooter from "@/components/marketing/shared/public-footer";
import {
  HandUnderline,
  PaperPlaneDoodle,
  SketchStar,
} from "@/components/marketing/shared/sketch-primitives";
import { SolutionPersonaSwitcher } from "@/components/marketing/solutions/solution-persona-switcher";
import { Button } from "@/components/ui/button";
import {
  solutionPersonas,
  solutionWorkflow,
} from "@/lib/marketing/site-content";

const ratingStars = ["first", "second", "third", "fourth", "fifth"];

const faqs = [
  {
    answer:
      "Yes. The selector is only a guide. A workspace can include product, design, student, and startup workflows at the same time.",
    question: "Can I switch between team solutions?",
  },
  {
    answer:
      "Tandaan is built for small teams first, but permissions, replay links, and shared rooms scale to larger teams.",
    question: "Is there a plan for large teams?",
  },
  {
    answer:
      "Start free with a workspace and invite teammates when you are ready to collaborate.",
    question: "Can I try Tandaan.AI for free?",
  },
  {
    answer:
      "We keep the product surface focused: document work, comments, replay, analytics, and team workflows.",
    question: "How secure is my data?",
  },
];

function TeamDoodle() {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full text-[var(--color-sketch-ink)]"
      fill="none"
      viewBox="0 0 420 260"
    >
      <path
        d="M38 188c55-36 97-39 149-8M240 179c44-32 88-31 134 2"
        stroke="currentColor"
        strokeDasharray="6 8"
        strokeLinecap="round"
        strokeWidth="2"
      />
      {[92, 158, 246, 314].map((cx, index) => (
        <g key={cx}>
          <circle
            cx={cx}
            cy={index % 2 === 0 ? 86 : 74}
            fill={index === 1 ? "#d8f4f5" : "#eef0ff"}
            r="28"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d={`M${cx - 44} ${index % 2 === 0 ? 158 : 148}c9-31 31-48 55-48s45 17 53 48`}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
      ))}
      <rect
        fill="#fff"
        height="74"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        width="130"
        x="145"
        y="128"
      />
      <path
        d="M164 151h72M164 169h45M246 162l15 10-15 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SolutionsPage() {
  return (
    <div className="tandaan-page">
      <div className="sketch-grain pointer-events-none fixed inset-0 z-0 opacity-80" />
      <div className="relative z-10">
        <section className="sketch-shell grid min-h-[calc(100dvh-74px)] items-center gap-10 py-12 lg:grid-cols-[0.74fr_1fr]">
          <div>
            <h1 className="max-w-[12ch] text-[clamp(3rem,6vw,5rem)] font-black leading-[1] text-[var(--color-sketch-ink)]">
              Built for the way
              <br />
              <span className="relative inline-block">
                your team works.
                <HandUnderline />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--color-sketch-muted)]">
              Find the perfect solution for your team and start collaborating
              with clarity.
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
                <Link href="mailto:hello@tandaan.app">Talk to Sales</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[22rem]">
            <TeamDoodle />
            <PaperPlaneDoodle className="absolute right-3 top-2 size-20" />
            <SketchStar className="absolute left-6 top-5 rotate-12" />
            <SketchStar className="absolute bottom-8 right-9 -rotate-12" />
          </div>
        </section>

        <SolutionPersonaSwitcher personas={solutionPersonas} />

        <section className="sketch-shell border-t border-[var(--color-sketch-line)] py-12 lg:py-16">
          <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
            How it works for every team
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {solutionWorkflow.map((item, index) => (
              <article className="relative text-center" key={item.title}>
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -left-6 top-7 hidden h-px w-12 bg-[var(--color-sketch-ink)] md:block"
                  />
                ) : null}
                <div className="mx-auto flex size-14 items-center justify-center rounded-lg border border-[var(--color-sketch-line)] bg-white shadow-[3px_3px_0_rgba(24,24,39,0.10)] dark:bg-slate-950">
                  <item.icon className="size-7 text-[var(--color-sketch-ink)]" />
                </div>
                <h2 className="mt-4 text-sm font-black text-[var(--color-sketch-ink)]">
                  {item.title}
                </h2>
              </article>
            ))}
          </div>
        </section>

        <section className="sketch-shell grid gap-6 border-t border-[var(--color-sketch-line)] py-12 lg:grid-cols-[1fr_0.72fr] lg:py-16">
          <article className="sketch-card p-7">
            <Quote className="size-7 text-[var(--color-sketch-ink)]" />
            <blockquote className="mt-4 max-w-2xl font-hand text-2xl leading-8 text-[var(--color-sketch-ink)]">
              Tandaan.AI became our single source of truth. We ship faster and
              our team is more aligned than ever.
            </blockquote>
            <div className="mt-5 flex items-center gap-1 text-[var(--color-sketch-blue)]">
              {ratingStars.map((star) => (
                <Star className="size-4 fill-current" key={star} />
              ))}
            </div>
            <p className="mt-4 text-sm font-bold text-[var(--color-sketch-ink)]">
              Miguel Santos, Head of Product at FlowBase
            </p>
          </article>

          <article className="sketch-sticky-note rotate-[-2deg] p-6">
            <p className="font-hand text-2xl leading-8 text-[var(--color-sketch-ink)]">
              Different team?
              <br />
              Explore the solution library.
            </p>
            <div className="mt-5 grid gap-2 text-sm font-black text-[var(--color-sketch-blue)]">
              <Link
                className="inline-flex items-center gap-2"
                href="#designers"
              >
                For Designers <ArrowRight className="size-3" />
              </Link>
              <Link className="inline-flex items-center gap-2" href="#students">
                For Students <ArrowRight className="size-3" />
              </Link>
              <Link className="inline-flex items-center gap-2" href="#startups">
                For Startups <ArrowRight className="size-3" />
              </Link>
            </div>
          </article>
        </section>

        <section className="sketch-shell py-8">
          <div className="relative overflow-hidden rounded-lg border border-[var(--color-sketch-line)] bg-[var(--color-sketch-blue)] p-6 text-white shadow-[0_20px_44px_rgba(81,104,246,0.22)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Ready to solve problems together?
                </h2>
                <p className="mt-2 text-sm text-white/82">
                  Start your team's journey today.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-12 bg-white px-8 text-[var(--color-sketch-blue)] hover:bg-white/90"
                >
                  <Link href="/documents">Get Started Free</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 border border-white/70 bg-transparent px-8 text-white hover:bg-white/10"
                  variant="outline"
                >
                  <Link href="mailto:hello@tandaan.app">Talk to Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="sketch-shell border-t border-[var(--color-sketch-line)] py-12">
          <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
            Frequently asked questions
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {faqs.map((item) => (
              <details className="sketch-card p-4" key={item.question}>
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
