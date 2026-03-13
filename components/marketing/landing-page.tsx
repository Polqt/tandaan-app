"use client";

import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Clock3,
  Compass,
  Orbit,
  Play,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import HeroScene from "./hero-scene";

const replayChapters = [
  {
    details:
      "Capture intent, references, and constraints before drafting starts.",
    minute: "00:42",
    title: "Frame The Problem",
  },
  {
    details:
      "Highlight decision pivots and who introduced each structural shift.",
    minute: "03:18",
    title: "Draft In Public",
  },
  {
    details: "Export replay chapters as a clean narrative for async review.",
    minute: "06:05",
    title: "Share The Story",
  },
];

const storytellingRows = [
  {
    body: "Automatically segment long writing sessions into understandable chapters. Stakeholders can jump straight to decision moments instead of replaying everything.",
    icon: Orbit,
    kicker: "Narrative Replay",
    title: "Version history that reads like a storyline.",
    accent: "coral",
  },
  {
    body: "Track the rationale behind meaningful edits. Every chapter can carry context tags, sources, and owner notes so future teammates can understand why changes happened.",
    icon: Compass,
    kicker: "Decision Ledger",
    title: "Keep the why, not only the what.",
    accent: "cobalt",
  },
  {
    body: 'Ask "When did this become policy?" and jump to exact replay timestamps. Tandaan answers from your note timeline, not from static final text.',
    icon: Bot,
    kicker: "Ask The Timeline",
    title: "Query your process, not just your content.",
    accent: "lime",
  },
];


export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();

  const anim = (y = 28, delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            delay,
          },
        };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-coral-light/40 blur-[120px]" />
          <div className="absolute -right-40 top-[20%] h-[500px] w-[500px] rounded-full bg-cobalt-light/30 blur-[100px]" />
          <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-lime-light/30 blur-[100px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-5 py-12 lg:px-8 lg:py-16">
          <section className="grid items-center gap-10 pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <m.div {...anim(32)} className="space-y-8">

              <div className="space-y-6">
                <h1 className="font-display max-w-[14ch] text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-slate-950">
                  Build ideas.{" "}
                  <span className="text-coral">Ship the story</span> behind
                  them.
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-slate-600">
                  Tandaan transforms collaborative notes into replayable product
                  narratives so teams review{" "}
                  <em className="font-medium not-italic text-slate-800">
                    decisions
                  </em>
                  , not just outcomes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-slate-950 px-7 text-sm font-medium hover:bg-slate-800"
                >
                  <Link href="/documents">
                    Open Workspace
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full border-slate-300 px-7 text-sm font-medium"
                  variant="outline"
                >
                </Button>
              </div>
            </m.div>

            <m.div
              initial={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, scale: 0.96 }
              }
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 1, scale: 1 }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
              }
            >
              <HeroScene />
            </m.div>
          </section>

          {/* ─── PRODUCT DEMO ─── */}
          <section className="grid gap-6 pb-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <m.div
              {...anim(24)}
              className="overflow-hidden rounded-4xl border border-white/10 bg-[#0b1120] p-8 text-white shadow-[0_40px_100px_rgba(11,17,32,0.35)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Product Demo
                  </p>
                  <h2 className="font-display mt-3 text-balance text-3xl font-bold lg:text-4xl">
                    Scroll a story, not a changelog.
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20">
                  <Play className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {replayChapters.map((chapter, index) => (
                  <div
                    className="group grid gap-3 rounded-2xl border border-white/6 bg-white/4 p-4 transition hover:bg-white/8 md:grid-cols-[auto_1fr_auto] md:items-center"
                    key={chapter.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral font-display font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{chapter.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {chapter.details}
                      </p>
                    </div>
                    <p className="font-mono text-xs tracking-wider text-slate-500">
                      {chapter.minute}
                    </p>
                  </div>
                ))}
              </div>
            </m.div>

            <m.div {...anim(24, 0.08)} className="grid gap-5">
              <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-7 shadow-sm backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Rare by design
                </p>
                <h3 className="font-display mt-3 text-2xl font-bold text-slate-950">
                  Timeline AI that references real revisions.
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Ask your timeline when a policy changed, why a section was
                  rewritten, and who drove each decision.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-lime/40 bg-lime-light/60 p-7 shadow-sm">
                <div className="flex items-center gap-3 text-slate-800">
                  <Clock3 className="h-5 w-5 text-lime" />
                  <p className="text-sm font-semibold">
                    Replay confidence score
                  </p>
                </div>
                <p className="font-display mt-5 text-5xl font-bold text-slate-950">
                  93%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Based on chapter coverage, rationale tags, and source links.
                </p>
              </div>
            </m.div>
          </section>

          <section className="space-y-6 pb-32">
            <m.div {...anim(20)} className="max-w-2xl pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-coral">
                Features
              </p>
              <h2 className="font-display mt-3 text-balance text-4xl font-bold leading-tight text-slate-950 lg:text-5xl">
                Tools that think in narratives, not file diffs.
              </h2>
            </m.div>

            {storytellingRows.map(
              ({ body, icon: Icon, kicker, title, accent }, index) => {
                const accentMap: Record<
                  string,
                  { bg: string; icon: string; border: string }
                > = {
                  coral: {
                    bg: "bg-coral-light/50",
                    icon: "bg-coral text-white",
                    border: "border-coral/20",
                  },
                  cobalt: {
                    bg: "bg-cobalt-light/50",
                    icon: "bg-cobalt text-white",
                    border: "border-cobalt/20",
                  },
                  lime: {
                    bg: "bg-lime-light/50",
                    icon: "bg-lime text-slate-900",
                    border: "border-lime/30",
                  },
                };
                const colors = accentMap[accent];
                const flipped = index % 2 === 1;

                return (
                  <m.article
                    {...anim(22, index * 0.06)}
                    className={`group grid items-center gap-6 rounded-4xl border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition hover:shadow-lg lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 ${
                      flipped ? "lg:[direction:rtl]" : ""
                    }`}
                    key={title}
                  >
                    <div className={flipped ? "lg:[direction:ltr]" : ""}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {kicker}
                      </p>
                      <h3 className="font-display mt-3 text-balance text-2xl font-bold text-slate-950 lg:text-3xl">
                        {title}
                      </h3>
                      <p className="mt-4 text-[15px] leading-7 text-slate-600">
                        {body}
                      </p>
                    </div>

                    <div
                      className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} p-7 ${
                        flipped ? "lg:[direction:ltr]" : ""
                      }`}
                    >
                      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/50 blur-md" />
                      <div className="relative">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.icon} shadow-sm`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="mt-6 space-y-2.5">
                          <div className="h-3 w-11/12 rounded-full bg-slate-900/80" />
                          <div className="h-3 w-9/12 rounded-full bg-slate-400/60" />
                          <div className="h-3 w-7/12 rounded-full bg-slate-300/50" />
                          <div className="h-3 w-5/12 rounded-full bg-slate-200/40" />
                        </div>
                      </div>
                    </div>
                  </m.article>
                );
              },
            )}
          </section>

          <footer className="grid gap-8 rounded-4xl border border-white/10 bg-[#0b1120] p-8 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <p className="font-display text-lg font-bold tracking-tight">
                Tandaan
              </p>
              <h2 className="font-display mt-4 max-w-md text-balance text-3xl font-bold leading-snug">
                For teams that care about execution speed{" "}
                <span className="text-coral">and</span> decision memory.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-400">
                Capture collaborative work, keep rationale visible, and share
                replay narratives that make asynchronous alignment easier.
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              {[
                { label: "Open Workspace", href: "/documents" },
                { label: "Developer Docs", href: "/docs" },
                { label: "Blog", href: "/blog" },
                { label: "Public Replay Experience", href: "/docs/replay-api" },
              ].map((link) => (
                <Link
                  key={link.label}
                  className="rounded-xl border border-white/6 bg-white/4 px-5 py-3.5 font-medium transition hover:bg-white/8"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </LazyMotion>
  );
}
