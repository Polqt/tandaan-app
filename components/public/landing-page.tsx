"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, AtSign, Globe, WandSparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import HeroAmbientCanvas from "./hero-ambient-canvas";
import {
  featureCards,
  focusTags,
  footerColumns,
  heroCards,
  testimonial,
} from "./landing-data";

gsap.registerPlugin(ScrollTrigger);

function useLandingGsap(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    const cleanups: Array<() => void> = [];

    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const reduceMotion = context.conditions?.reduceMotion;

      const heroItems = root.querySelectorAll("[data-hero-item]");
      const artifactCards = root.querySelectorAll<HTMLElement>(
        "[data-artifact-card]",
      );
      const floatCards =
        root.querySelectorAll<HTMLElement>("[data-float-card]");
      const doodles = root.querySelectorAll<HTMLElement>("[data-doodle]");
      const ambient = root.querySelector("[data-ambient]");
      const focus = root.querySelector("[data-focus]");
      const architecture = root.querySelector("[data-architecture]");
      const cta = root.querySelector("[data-cta]");
      const quote = root.querySelector("[data-quote]");
      const footer = root.querySelector("[data-footer]");

      if (!reduceMotion) {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (ambient) {
          intro.fromTo(
            ambient,
            { autoAlpha: 0, scale: 0.94, y: 12 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 1.15 },
            0,
          );
        }

        intro.fromTo(
          heroItems,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.08 },
          0.04,
        );

        intro.fromTo(
          artifactCards,
          { autoAlpha: 0, y: 20, rotateX: -8, z: -80 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            duration: 0.82,
            stagger: 0.09,
          },
          0.24,
        );

        intro.fromTo(
          doodles,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.7, stagger: 0.05 },
          0.18,
        );

        if (ambient) {
          gsap.to(ambient, {
            y: -10,
            duration: 5.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(ambient, {
            x: 12,
            duration: 6.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(ambient, {
            yPercent: -18,
            xPercent: 6,
            rotation: 2.2,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 1.35,
            },
          });
        }

        doodles.forEach((element, index) => {
          const depth = Number(element.dataset.depth || index + 1);
          gsap.to(element, {
            yPercent: depth * -20,
            xPercent: depth % 2 === 0 ? depth * 4.4 : depth * -4.4,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 1.4,
            },
          });
        });

        const ring = root.querySelector<HTMLElement>("[data-orbit-ring]");
        if (ring) {
          gsap.to(ring, {
            yPercent: -12,
            xPercent: 4,
            rotation: 8,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 1.8,
            },
          });
        }

        floatCards.forEach((card, index) => {
          const tiltX = index % 2 === 0 ? 2.5 : -2.5;
          const tiltY = index % 2 === 0 ? -2 : 2;

          gsap.to(card, {
            y: index % 2 === 0 ? -8 : 8,
            duration: 3.2 + index * 0.35,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.fromTo(
            card,
            { z: -36, rotateX: tiltX * -0.45, rotateY: tiltY * -0.45 },
            {
              z: 28,
              rotateX: tiltX,
              rotateY: tiltY,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.6,
              },
            },
          );

          const enter = () =>
            gsap.to(card, {
              y: -14,
              z: 54,
              rotateX: tiltX * 1.4,
              rotateY: tiltY * 1.4,
              boxShadow:
                "0 36px 80px rgba(82, 76, 68, 0.14), 0 8px 0 rgba(221, 216, 206, 0.92)",
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });

          const leave = () =>
            gsap.to(card, {
              y: 0,
              z: 0,
              rotateX: tiltX,
              rotateY: tiltY,
              boxShadow:
                "0 20px 42px rgba(82, 76, 68, 0.07), 0 3px 0 rgba(221, 216, 206, 0.82)",
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });

          card.addEventListener("pointerenter", enter);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", enter);
            card.removeEventListener("pointerleave", leave);
          });
        });

        const revealUp = (element: Element | null, vars?: gsap.TweenVars) => {
          if (!element) return;
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 82%",
                once: true,
              },
              ...vars,
            },
          );
        };

        revealUp(focus);
        revealUp(architecture);

        if (cta) {
          const ctaButton = cta.querySelector("[data-cta-button]");
          const ctaWatermark = cta.querySelector("[data-cta-watermark]");
          const ctaTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: cta,
              start: "top 80%",
              once: true,
            },
            defaults: { ease: "power3.out" },
          });

          ctaTimeline.fromTo(
            ctaWatermark,
            { autoAlpha: 0, scale: 0.88, y: 24 },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 1.35,
              ease: "power2.out",
            },
          );

          ctaTimeline.fromTo(
            cta.querySelectorAll("[data-cta-copy]"),
            { autoAlpha: 0, y: 38 },
            { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.12 },
            0.12,
          );

          ctaTimeline.fromTo(
            ctaButton,
            { autoAlpha: 0, y: 24, scale: 0.92, rotateX: -8 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.9,
              ease: "back.out(1.18)",
            },
            0.3,
          );
        }

        if (quote) {
          const quoteItems = quote.querySelectorAll("[data-quote-item]");
          gsap.fromTo(
            quote,
            { autoAlpha: 0, y: 48, scale: 0.965, rotateX: -4 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: quote,
                start: "top 84%",
                once: true,
              },
            },
          );

          gsap.fromTo(
            quoteItems,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: quote,
                start: "top 80%",
                once: true,
              },
            },
          );
        }

        revealUp(footer, { duration: 0.9 });
      }
    });

    return () => {
      cleanups.forEach((cleanup) => {
        cleanup();
      });
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
      mm.revert();
    };
  }, [rootRef]);
}

function ArtifactStrip() {
  return (
    <section className="relative grid gap-6 pt-1 lg:grid-cols-3">
      {heroCards.map((card) => (
        <article
          className={`artifact-card artifact-card-interactive ${card.tilt}`}
          data-artifact-card
          data-float-card
          key={card.id}
        >
          {card.type === "note" ? (
            <>
              <div className="flex items-center justify-between text-[13px] text-[var(--color-es-soft-ink)]">
                <span>{card.eyebrow}</span>
                <span>x</span>
              </div>
              <div className="mt-7 space-y-4">
                {card.lines.map((_, index) => (
                  <div
                    className={`h-3 rounded-full bg-[rgba(47,52,48,0.08)] ${
                      index === 0
                        ? "w-[72%]"
                        : index === 1
                          ? "w-[86%]"
                          : "w-[68%]"
                    }`}
                    key={`${card.id}-${index}`}
                  />
                ))}
              </div>
              <p className="mt-10 text-right text-[11px] text-[var(--color-es-soft-ink)]">
                {card.meta}
              </p>
            </>
          ) : null}

          {card.type === "quote" ? (
            <>
              <p className="handwritten-note absolute left-1/2 top-[-1.2rem] -translate-x-1/2 text-[var(--color-es-muted)]">
                {card.note}
              </p>
              <div className="flex items-center gap-3 text-[var(--color-es-ink)]">
                <WandSparkles className="size-4" />
                <h3 className="text-[1.82rem] font-semibold tracking-[-0.04em]">
                  {card.eyebrow}
                </h3>
              </div>
              <p className="mt-5 max-w-[24ch] text-lg italic leading-8 text-[var(--color-es-soft-ink)]">
                {card.quote}
              </p>
              <div className="mt-7 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[rgba(47,52,48,0.08)] text-xs text-[var(--color-es-soft-ink)]">
                  ↺
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-[rgba(47,52,48,0.08)] text-xs text-[var(--color-es-soft-ink)]">
                  ⊕
                </span>
              </div>
            </>
          ) : null}

          {card.type === "photo" ? (
            <>
              <div className="overflow-hidden rounded-[1.1rem] border border-[var(--color-es-line)] bg-[linear-gradient(145deg,#1a2029_0%,#2a313d_45%,#9f8b74_100%)] p-3">
                <div className="h-44 rounded-[0.95rem] bg-[radial-gradient(circle_at_86%_20%,rgba(255,241,214,0.95),transparent_10%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)),linear-gradient(135deg,#27303b,#1d232d_54%,#3d4348)]" />
              </div>
              <p className="pt-3 text-center font-medium text-[var(--color-es-soft-ink)]">
                {card.eyebrow}
              </p>
            </>
          ) : null}
        </article>
      ))}

      <div className="pointer-events-none absolute inset-x-0 -bottom-11 hidden justify-center lg:flex">
        <p className="handwritten-note text-[var(--color-es-soft-ink)]">
          ↓ Scroll for artifacts
        </p>
      </div>
    </section>
  );
}

function FocusSection() {
  return (
    <section
      className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]"
      data-focus
    >
      <div className="relative max-w-[38rem]">
        <div
          className="artifact-card artifact-card-interactive -rotate-[1.85deg]"
          data-float-card
        >
          <div className="sticky-note">No toolbars! finally.</div>
          <div className="mb-5 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#ffb69d]" />
            <span className="size-2 rounded-full bg-[#f2d98c]" />
            <span className="size-2 rounded-full bg-[#b7d8b1]" />
            <span className="ml-auto text-[12px] text-[var(--color-es-soft-ink)]">
              Editing: Manifest.txt
            </span>
          </div>
          <div className="space-y-5 text-[15px] leading-8 text-[var(--color-es-soft-ink)]">
            <p className="font-semibold text-[var(--color-es-ink)]">
              # Focus Mode: Engaged
            </p>
            <p>The world is loud, but this screen is quiet.</p>
            <p className="font-medium text-[var(--color-es-ink)]">
              It&apos;s just you and the blinking cursor.
            </p>
            <div className="h-4 w-40 rounded-full bg-[rgba(47,52,48,0.08)]" />
          </div>
        </div>
        <p className="handwritten-note absolute -bottom-7 right-1 text-[var(--color-es-muted)]">
          pure digital bliss
        </p>
      </div>

      <div className="relative space-y-6">
        <p className="section-scribble absolute right-0 top-[-3.35rem] rotate-[12deg]">
          FOCUS MODE
        </p>
        <h2 className="font-display text-[clamp(2.7rem,4.5vw,4.1rem)] font-bold tracking-[-0.06em] text-[var(--color-es-ink)]">
          Artifact: Focus Mode
        </h2>
        <p className="max-w-2xl text-[1.32rem] leading-[1.78] text-[var(--color-es-soft-ink)]">
          We didn&apos;t just remove features. We performed a digital exorcism.
          No toolbars to haunt you, no menus to distract you. Just you and your
          thoughts on a digital canvas that feels like fresh, textured vellum.
        </p>
        <div className="flex flex-wrap gap-3">
          {focusTags.map((tag) => (
            <span
              className="rounded-full border border-[var(--color-es-line)] bg-[rgba(255,255,255,0.72)] px-5 py-3 text-[15px] font-medium text-[var(--color-es-soft-ink)]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="handwritten-note absolute bottom-6 right-1 text-[var(--color-es-muted)]">
          Is this ink still wet?
        </p>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="landing-band relative" data-architecture>
      <p className="section-scribble absolute left-6 top-4 -rotate-[14deg]">
        STRUCTURE
      </p>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-[clamp(2.8rem,4.9vw,4.5rem)] font-bold tracking-[-0.06em] text-[var(--color-es-ink)]">
          The Piece-by-Piece Architecture
        </h2>
        <p className="mt-3 text-[1.42rem] italic text-[var(--color-es-soft-ink)]">
          It&apos;s like Notion, if Notion was founded by a poet and a
          carpenter.
        </p>
      </div>

      <div className="mt-16 grid gap-7 lg:grid-cols-3">
        {featureCards.map((card) => (
          <article
            className={`artifact-card artifact-card-interactive bg-white ${card.tilt}`}
            data-float-card
            key={card.id}
          >
            <p className="handwritten-note absolute right-6 top-[-1rem] text-[var(--color-es-muted)]">
              {card.note}
            </p>
            <card.icon className="size-5 text-[var(--color-es-soft-ink)]" />
            <h3 className="mt-7 text-[1.9rem] font-semibold tracking-[-0.05em] text-[var(--color-es-ink)]">
              {card.title}
            </h3>
            <p className="mt-4 text-[1.03rem] leading-8 text-[var(--color-es-soft-ink)]">
              {card.body}
            </p>
          </article>
        ))}
      </div>

      <p className="section-scribble absolute bottom-2 right-6 rotate-[3deg]">
        ORGANIZED CHAOS
      </p>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative pb-1 pt-4 text-center" data-cta>
      <p
        className="handwritten-note absolute left-5 top-0 -rotate-[14deg] text-[var(--color-es-muted)]"
        data-cta-copy
      >
        The ink is calling.
      </p>
      <span className="landing-watermark" data-cta-watermark>
        WRITE
      </span>
      <div className="relative mx-auto max-w-4xl">
        <h2
          className="mx-auto max-w-[12.5ch] font-display text-[clamp(3.15rem,5.6vw,5rem)] font-bold tracking-[-0.065em] text-[var(--color-es-ink)]"
          data-cta-copy
        >
          Ready to spill some digital ink?
        </h2>
        <div className="mt-7 flex justify-center">
          <Button
            asChild
            size="lg"
            className="h-16 rounded-sm border border-[var(--color-es-ink)] bg-[var(--color-es-ink)] px-11 text-lg font-semibold text-white shadow-[0_18px_32px_rgba(47,52,48,0.14)] hover:bg-[var(--color-es-primary)]"
          >
            <Link href="/documents" data-cta-button>
              Start Your First Page
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
        <p
          className="handwritten-note absolute right-[18%] top-[62%] text-[var(--color-es-soft-ink)]"
          data-cta-copy
        >
          ink-free, mostly.
        </p>
        <p
          className="handwritten-note absolute bottom-[-1.8rem] right-6 text-[var(--color-es-muted)]"
          data-cta-copy
        >
          What&apos;s on your mind?
        </p>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="quote-shell relative" data-quote>
      <span
        className="absolute left-10 top-4 text-7xl text-[rgba(47,52,48,0.14)]"
        data-quote-item
      >
        "
      </span>
      <p
        className="handwritten-note absolute left-6 top-16 text-[var(--color-es-muted)]"
        data-quote-item
      >
        Thinking aloud.
      </p>
      <div className="mx-auto max-w-5xl text-center">
        <p
          className="text-[clamp(2rem,4vw,3.05rem)] font-semibold italic leading-[1.4] text-[var(--color-es-ink)]"
          data-quote-item
        >
          {testimonial.body}
        </p>
        <div
          className="mt-10 flex items-center justify-center gap-4"
          data-quote-item
        >
          <div className="flex size-12 items-center justify-center rounded-full border border-[var(--color-es-line)] bg-[var(--color-es-raised)] text-sm font-semibold text-[var(--color-es-ink)]">
            JV
          </div>
          <div className="text-left">
            <p className="text-lg font-semibold text-[var(--color-es-ink)]">
              {testimonial.name}
            </p>
            <p className="text-sm text-[var(--color-es-soft-ink)]">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="landing-footer" data-footer>
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-6">
          <h2 className="font-display text-[3rem] font-semibold tracking-[-0.06em] text-[var(--color-es-ink)]">
            Tandaan
          </h2>
          <p className="max-w-md text-[1.24rem] leading-[1.8] text-[var(--color-es-soft-ink)]">
            Built for the writers who still smell the paper even if it&apos;s
            digital. A product of intentional chaos and excess caffeine.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="mailto:hello@tandaan.app"
              className="footer-icon"
              aria-label="Email Tandaan"
            >
              <AtSign className="size-5" />
            </Link>
            <Link href="/docs" className="footer-icon" aria-label="Open docs">
              <Globe className="size-5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div className="space-y-4" key={column.id}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-es-soft-ink)]">
                {column.title}
              </p>
              <div className="flex flex-col gap-4 text-[1.12rem] text-[var(--color-es-ink)]">
                {column.links.map((link) => (
                  <Link
                    className="transition hover:text-[var(--color-es-soft-ink)]"
                    href={link.href}
                    key={link.id}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-11 flex flex-col gap-4 border-t border-[var(--color-es-line)] pt-7 text-[1rem] text-[var(--color-es-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Tandaan. Don&apos;t be too organized.</p>
        <p className="handwritten-note text-[1.45rem] text-[var(--color-es-soft-ink)]">
          made with messy love.
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingGsap(rootRef);

  return (
    <div className="landing-page" ref={rootRef}>
      <div className="paper-noise pointer-events-none absolute inset-0 opacity-70" />

      <section className="landing-hero" data-hero>
        <div className="hero-ambient-layer" data-ambient>
          <HeroAmbientCanvas />
        </div>
        <div className="relative z-10">
          <p
            className="hero-kicker mx-auto max-w-max"
            data-doodle
            data-depth="1"
          >
            Psst... are you tired of the grid?
          </p>
          <div className="mx-auto mt-9 max-w-[90rem] text-center">
            <p
              className="handwritten-note absolute left-3 top-[63%] hidden text-[rgba(47,52,48,0.11)] lg:block"
              data-doodle
              data-depth="2"
            >
              Just start here...
            </p>
            <p
              className="handwritten-note absolute right-10 top-[61%] hidden text-[var(--color-es-soft-ink)] lg:block"
              data-doodle
              data-depth="3"
            >
              it&apos;s better
              <br />
              this way
            </p>
            <WandSparkles
              className="absolute right-8 top-4 hidden size-7 text-[rgba(47,52,48,0.15)] lg:block"
              data-doodle
              data-depth="4"
            />
            <div
              className="hero-ring pointer-events-none absolute left-1/2 top-[12%] hidden h-[31rem] w-[31rem] -translate-x-[-7%] rounded-full lg:block"
              data-doodle
              data-orbit-ring
            />
            <h1 className="hero-title" data-hero-item>
              Stop fighting your tools. Start flirting with your ideas.
            </h1>
            <p className="hero-copy mx-auto mt-7 max-w-[45rem]" data-hero-item>
              The anti-database. A tactile thinking space that feels like
              premium vellum, designed for the &quot;just let me write&quot;
              enthusiasts.
            </p>
            <div
              className="mt-9 flex flex-wrap items-center justify-center gap-6"
              data-hero-item
            >
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full border border-[var(--color-es-primary)] bg-[var(--color-es-primary)] px-10 text-lg font-semibold text-white hover:bg-[var(--color-es-ink)]"
              >
                <Link href="/documents">Start Writing</Link>
              </Button>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 border-b border-[var(--color-es-ink)] pb-1 text-lg font-semibold text-[var(--color-es-ink)]"
              >
                View Features
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="landing-shell">
        <ArtifactStrip />
        <FocusSection />
      </div>

      <ArchitectureSection />

      <div className="landing-shell">
        <CtaSection />
        <TestimonialSection />
      </div>

      <LandingFooter />
    </div>
  );
}
