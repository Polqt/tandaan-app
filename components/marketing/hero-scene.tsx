"use client";

import { m, useReducedMotion } from "framer-motion";
import { Globe2, Layers3, MessageSquareQuote, Sparkles } from "lucide-react";

const floatingCardTransition = {
  duration: 6,
  ease: "easeInOut" as const,
  repeat: Number.POSITIVE_INFINITY,
  repeatType: "mirror" as const,
};

export default function HeroScene() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto h-[28rem] w-full max-w-[34rem] [perspective:1400px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(15,118,110,0.16),_transparent_62%)] blur-xl" />

      <m.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotateX: [10, 8, 10],
                rotateY: [-14, -11, -14],
                y: [0, -6, 0],
              }
        }
        className="absolute inset-x-8 top-10 transform-gpu rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.14)]"
        style={{
          transform: "rotateX(10deg) rotateY(-14deg) translateZ(0px)",
          transformStyle: "preserve-3d",
        }}
        transition={shouldReduceMotion ? undefined : floatingCardTransition}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Replay Console
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Storyboard every note revision
            </h3>
          </div>
          <div className="rounded-2xl bg-[#0f766e] p-3 text-white">
            <Layers3 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
              <span>Live Session</span>
              <span>12 snapshots</span>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-3 w-10/12 rounded-full bg-white/90" />
              <div className="h-3 w-8/12 rounded-full bg-white/50" />
              <div className="h-3 w-6/12 rounded-full bg-[#2dd4bf]" />
            </div>
            <div className="mt-8 flex items-end gap-3">
              {[36, 56, 42, 74, 88, 62].map((height) => (
                <div
                  className="w-full rounded-t-full bg-gradient-to-t from-[#14b8a6] to-white/80"
                  key={height}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Portfolio share
              </p>
              <p className="mt-3 text-sm text-slate-700">
                Generate a single public replay link without exposing the
                editor.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Change digest
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                +4 / ~2 / -1
              </p>
            </div>
          </div>
        </div>
      </m.div>

      <m.div
        animate={
          shouldReduceMotion
            ? undefined
            : { rotateZ: [0, 3, 0], y: [0, -10, 0] }
        }
        className="absolute left-0 top-24 w-52 transform-gpu rounded-[1.75rem] border border-[#99f6e4] bg-[#0f766e] p-5 text-white shadow-[0_22px_60px_rgba(15,118,110,0.22)]"
        style={{ transform: "translateZ(90px) rotateY(18deg)" }}
        transition={
          shouldReduceMotion
            ? undefined
            : { ...floatingCardTransition, delay: 0.6, duration: 5.4 }
        }
      >
        <MessageSquareQuote className="h-5 w-5" />
        <p className="mt-5 text-lg font-semibold">
          Context stays attached to every revision.
        </p>
      </m.div>

      <m.div
        animate={
          shouldReduceMotion ? undefined : { rotateZ: [0, -3, 0], x: [0, 6, 0] }
        }
        className="absolute bottom-2 right-0 w-56 transform-gpu rounded-[1.75rem] border border-white/70 bg-white/95 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.14)]"
        style={{ transform: "translateZ(70px) rotateY(-18deg)" }}
        transition={
          shouldReduceMotion
            ? undefined
            : { ...floatingCardTransition, delay: 1.2, duration: 5.2 }
        }
      >
        <div className="flex items-center gap-3 text-slate-950">
          <div className="rounded-2xl bg-slate-950 p-2 text-white">
            <Globe2 className="h-4 w-4" />
          </div>
          <p className="font-semibold">Ship review-ready demos</p>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Replay links work for demos, design reviews, and async handoff.
        </p>
      </m.div>

      <m.div
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.45, 0.7, 0.45], scale: [1, 1.02, 1] }
        }
        className="absolute right-20 top-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/75 text-[#0f766e] shadow-[0_20px_60px_rgba(15,118,110,0.18)]"
        transition={
          shouldReduceMotion
            ? undefined
            : { ...floatingCardTransition, duration: 4.8 }
        }
      >
        <Sparkles className="h-5 w-5" />
      </m.div>
    </div>
  );
}
