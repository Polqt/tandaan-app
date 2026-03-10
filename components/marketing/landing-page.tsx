"use client";

import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Eye,
  Link2,
  PencilLine,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import HeroScene from "./hero-scene";

const featureCards = [
  {
    copy: "Turn every autosaved snapshot into a navigable timeline with authorship and change summaries.",
    icon: Clock3,
    title: "Playback note evolution",
  },
  {
    copy: "Pair Clerk identities with live collaborators so the timeline explains who moved the document forward.",
    icon: Users2,
    title: "See who changed what",
  },
  {
    copy: "Generate a single replay URL for hiring demos, async reviews, or product walkthroughs.",
    icon: Link2,
    title: "Share polished public replays",
  },
];

const workflowSteps = [
  "Write together in the editor.",
  "Autosave snapshots with structural change summaries.",
  "Open replay to scrub the timeline and inspect revisions.",
  "Share a public replay link for demos or review.",
];

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-10 lg:px-6 lg:py-14">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <m.div
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="space-y-8"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#99f6e4] bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm">
              <Eye className="h-4 w-4 text-[#0f766e]" />
              Notes that can explain themselves
            </div>

            <div className="space-y-5">
              <h1 className="font-display max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Collaborative notes with a replay layer built for product demos.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Tandaan captures the working history behind your notes, then
                turns that history into a clean playback experience for reviews,
                hiring portfolios, and async handoff.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="h-11 rounded-full px-6 text-sm">
                <Link href="/documents">
                  Open Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-full border-slate-300 bg-white/80 px-6 text-sm"
                variant="outline"
              >
                <Link href="/docs">Explore the docs</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Collab
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  Realtime
                </p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Replay
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  Versioned
                </p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Sharing
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  Public link
                </p>
              </div>
            </div>
          </m.div>

          <m.div
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            initial={
              shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }
            }
            transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
          >
            <HeroScene />
          </m.div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {featureCards.map(({ copy, icon: Icon, title }, index) => (
            <m.div
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
              key={title}
              transition={{ delay: 0.06 + index * 0.06, duration: 0.35 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f766e] text-white shadow-[0_20px_40px_rgba(15,118,110,0.24)]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-display mt-5 text-2xl font-semibold text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
            </m.div>
          ))}
        </section>

        <section className="grid gap-8 rounded-4xl border border-white/70 bg-slate-950 px-6 py-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.14)] lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Workflow
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold">
              A product flow, not just a text editor.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              The workspace handles drafting, collaboration, replay, and demo
              sharing in one sequence so the note remains useful after editing
              stops.
            </p>
          </div>

          <div className="grid gap-3">
            {workflowSteps.map((step, index) => (
              <div
                className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
                key={step}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{step}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {index === 0 &&
                      "Liveblocks-backed editing keeps collaborators in sync."}
                    {index === 1 &&
                      "Snapshots store content, timestamp, author, and structural summary."}
                    {index === 2 &&
                      "Replay view lets you scrub revisions and inspect change density."}
                    {index === 3 &&
                      "A single public route makes the work presentation-ready."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Ready to ship
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-slate-950">
              Use Tandaan as your note workspace and your portfolio walkthrough.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-full px-6">
              <Link href="/documents">
                Start writing
                <PencilLine className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-11 rounded-full px-6"
              variant="outline"
            >
              <Link href="/docs">Read implementation notes</Link>
            </Button>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
