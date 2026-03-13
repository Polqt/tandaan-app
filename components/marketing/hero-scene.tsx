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
      className="relative mx-auto h-120 w-full max-w-xl perspective-[1400px]"
      style={{ transformStyle: "preserve-3d" }}
    >

      <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_40%_30%,oklch(0.68_0.19_25/0.14),transparent_55%),radial-gradient(circle_at_70%_70%,oklch(0.55_0.2_260/0.1),transparent_45%)] blur-xl" />

      <m.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                rotateX: [10, 7, 10],
                rotateY: [-14, -10, -14],
                y: [0, -8, 0],
              }
        }
        className="absolute inset-x-6 top-8 transform-gpu rounded-4xl border border-white/60 bg-white/85 p-6 shadow-[0_32px_100px_rgba(11,17,32,0.16)] backdrop-blur-sm"
        style={{
          transform: "rotateX(10deg) rotateY(-14deg) translateZ(0px)",
          transformStyle: "preserve-3d",
        }}
        transition={shouldReduceMotion ? undefined : floatingCardTransition}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Replay Console
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">
              Storyboard every note revision
            </h3>
          </div>
          <div className="rounded-2xl bg-coral p-3 text-white shadow-sm">
            <Layers3 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#0b1120] p-5 text-white">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>Live Session</span>
              <span>12 snapshots</span>
            </div>
            <div className="mt-5 space-y-2.5">
              <div className="h-2.5 w-10/12 rounded-full bg-white/90" />
              <div className="h-2.5 w-8/12 rounded-full bg-white/50" />
              <div className="h-2.5 w-6/12 rounded-full bg-coral" />
            </div>
            <div className="mt-6 flex items-end gap-2.5">
              {[36, 56, 42, 74, 88, 62].map((height, i) => (
                <div
                  className="w-full rounded-t-lg bg-linear-to-t from-coral to-white/70"
                  key={`bar-${height}-${i}`}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Portfolio share
              </p>
              <p className="mt-2.5 text-sm text-slate-600">
                Generate a single public replay link without exposing the editor.
              </p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Change digest
              </p>
              <p className="font-display mt-2.5 text-2xl font-bold text-slate-950">
                +4 / ~2 / -1
              </p>
            </div>
          </div>
        </div>
      </m.div>

      {/* Cobalt floating card */}
      <m.div
        animate={
          shouldReduceMotion
            ? undefined
            : { rotateZ: [0, 3, 0], y: [0, -12, 0] }
        }
        className="absolute left-0 top-28 w-48 transform-gpu rounded-[1.75rem] border border-cobalt/30 bg-cobalt p-5 text-white shadow-[0_22px_60px_rgba(55,48,163,0.25)]"
        style={{ transform: "translateZ(90px) rotateY(18deg)" }}
        transition={
          shouldReduceMotion
            ? undefined
            : { ...floatingCardTransition, delay: 0.6, duration: 5.4 }
        }
      >
        <MessageSquareQuote className="h-5 w-5" />
        <p className="mt-4 text-[15px] font-bold leading-snug">
          Context stays attached to every revision.
        </p>
      </m.div>
    </div>
  );
}
