"use client";

import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Layers3,
  Link2,
  ShieldCheck,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const docsSections = [
  {
    body: "BlockNote handles the editing surface while Liveblocks + Yjs keep the room synchronized across collaborators.",
    icon: Users2,
    title: "Realtime editing",
  },
  {
    body: "Every timed snapshot stores content, author, timestamp, and a structural change digest so replay stays readable.",
    icon: Clock3,
    title: "Replay snapshots",
  },
  {
    body: "Replay links publish a dedicated viewer route so demos stay clean and the editor remains private.",
    icon: Link2,
    title: "Public sharing",
  },
];

const implementationNotes = [
  "Private replay data is resolved through Firestore + Clerk profile lookups on the server.",
  "Public replay pages consume a share id instead of requiring document access.",
  "The product shell now distinguishes public marketing routes from the editor shell.",
  "Sidebar and auth-dependent workspace queries are skipped on marketing routes.",
];

export default function DocsPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 lg:px-6 lg:py-14">
        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <m.div
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Docs
            </p>
            <h1 className="font-display mt-4 text-5xl font-semibold tracking-tight text-slate-950">
              Tandaan turns collaborative notes into replayable product
              artifacts.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              These notes describe the current product surface, the
              collaboration model, and the replay architecture that supports
              demo-ready sharing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-full px-6">
                <Link href="/documents">
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-full px-6"
                variant="outline"
              >
                <Link href="/">Back to product</Link>
              </Button>
            </div>
          </m.div>

          <m.div
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: 1, rotateX: 0, rotateY: 0 }
            }
            className="perspective-[1400px]"
            initial={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, rotateX: 8, rotateY: -10 }
            }
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div
              className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_35px_100px_rgba(15,23,42,0.14)]"
              style={{ transform: "rotateX(10deg) rotateY(-14deg)" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(15,118,110,0.1),transparent_36%)]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Surface map
                    </p>
                    <h2 className="font-display mt-2 text-2xl font-semibold text-slate-950">
                      Product layers
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-slate-950 p-3 text-white">
                    <Layers3 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Editor
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      BlockNote + Liveblocks room
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Replay
                      </p>
                      <p className="mt-2 font-semibold text-slate-950">
                        Timeline + change digest
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Docs
                      </p>
                      <p className="mt-2 font-semibold text-slate-950">
                        Marketing + product explanation
                      </p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-[#99f6e4] bg-[#0f766e] p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.18em] text-teal-100">
                      Share route
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      Public replay pages for demos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {docsSections.map(({ body, icon: Icon, title }, index) => (
            <m.article
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
              key={title}
              transition={{ delay: 0.08 * index, duration: 0.45 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f766e] text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-display mt-5 text-2xl font-semibold text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
            </m.article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-4xl border border-white/70 bg-slate-950 p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-teal-300" />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Implementation notes
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {implementationNotes.map((note, index) => (
                <div
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"
                  key={note}
                >
                  <p className="text-sm font-medium text-white/70">
                    0{index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-white/70 bg-white/85 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Shipping focus
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold text-slate-950">
              Tandaan should feel like a product, not a demo scaffold.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The current direction emphasizes a clean collaboration core,
              public replay storytelling, and a sharper marketing surface so the
              project reads like a cohesive SaaS note product.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Next reasonable additions
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>Workspace analytics for replay engagement.</li>
                <li>Replay thumbnails on document cards.</li>
                <li>Named templates for demo-ready note structures.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
