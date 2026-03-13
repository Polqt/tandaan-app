import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingTiers = [
  {
    cta: "Start free",
    highlight: false,
    name: "Starter",
    price: "$0",
    points: [
      "Unlimited personal notes",
      "7-day replay timeline",
      "2 public replay links",
    ],
  },
  {
    cta: "Upgrade to Pro",
    highlight: true,
    name: "Pro",
    price: "$16",
    points: [
      "Unlimited replay chapters",
      "Timeline AI query assistant",
      "Decision Ledger annotations",
      "Priority export presets",
    ],
  },
  {
    cta: "Contact sales",
    highlight: false,
    name: "Team",
    price: "$39",
    points: [
      "Workspace trust trace reports",
      "Role-based replay access",
      "Audit-ready provenance logs",
      "SSO and shared governance",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      {/* Hero blurb - asymmetric */}
      <section className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-coral">
            Pricing
          </p>
          <h1 className="font-display mt-4 max-w-xl text-balance text-5xl font-bold tracking-tight text-slate-950 lg:text-6xl lg:leading-[1.05]">
            Plans built for narrative collaboration.
          </h1>
        </div>
        <div>
          <p className="max-w-md text-[15px] leading-7 text-slate-600">
            Every plan includes realtime collaboration and replay sharing. Scale
            up when your team needs timeline intelligence and governance.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-11 rounded-full px-6 font-semibold"
            >
              <Link href="/documents">
                Open Workspace
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-11 rounded-full px-6 font-semibold"
              variant="outline"
            >
              <Link href="/docs">Read Docs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="grid gap-5 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <div
            className={`relative rounded-[2rem] border p-7 transition hover:shadow-lg ${
              tier.highlight
                ? "border-coral/40 bg-coral-light/50 shadow-md shadow-coral/10"
                : "border-white/60 bg-white/80 shadow-sm backdrop-blur-sm"
            }`}
            key={tier.name}
          >
            {tier.highlight && (
              <div className="absolute -top-3 right-6 rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
                Popular
              </div>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {tier.name}
            </p>
            <p className="font-display mt-4 text-5xl font-bold text-slate-950 lg:text-6xl">
              {tier.price}
              <span className="ml-1.5 text-base font-medium text-slate-400">
                /mo
              </span>
            </p>

            <ul className="mt-6 space-y-3">
              {tier.points.map((point) => (
                <li
                  className="flex items-start gap-2.5 text-[15px] text-slate-700"
                  key={point}
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`mt-7 h-11 w-full rounded-full text-sm font-semibold ${
                tier.highlight
                  ? "bg-slate-950 text-white hover:bg-slate-800"
                  : ""
              }`}
              variant={tier.highlight ? "default" : "outline"}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
}
