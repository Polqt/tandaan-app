import { ArrowRight, Check, Plus, Star } from "lucide-react";
import Link from "next/link";
import PublicFooter from "@/components/marketing/shared/public-footer";
import { Button } from "@/components/ui/button";
import {
  billingQuestions,
  publicBillingTiers,
} from "@/lib/marketing/billing-plans";

export default function BillingPage() {
  return (
    <div className="bg-[#fbfbfa]">
      <section className="px-5 pb-14 pt-14 md:pt-18">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex rounded-full bg-[#e4f2ff] px-4 py-2 text-sm font-extrabold text-[#1688e8]">
            Simple pricing for replayable work
          </div>
          <h1 className="mx-auto mt-6 max-w-5xl text-[clamp(3.25rem,7vw,6.25rem)] font-black leading-[0.95] tracking-[-0.055em] text-[#1e1e22]">
            Start free. Upgrade when the workspace earns it.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[#77777c]">
            Start with the free workspace. Upgrade when your team needs
            unlimited documents, full replay history, and priority support.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          {publicBillingTiers.map((tier) => (
            <article
              className={`rounded-[24px] p-7 ring-1 ring-slate-200 ${
                tier.featured
                  ? "bg-[#101116] text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]"
                  : "bg-white text-[#1e1e22]"
              }`}
              key={tier.name}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-2xl font-black tracking-[-0.03em] ${
                      tier.featured ? "text-white" : "text-[#1e1e22]"
                    }`}
                  >
                    {tier.name}
                  </p>
                  <p className="mt-5 text-6xl font-black tracking-[-0.055em]">
                    {tier.price}
                  </p>
                  <p
                    className={`mt-2 text-sm font-extrabold uppercase tracking-wide ${
                      tier.featured ? "text-white/60" : "text-[#77777c]"
                    }`}
                  >
                    {tier.priceNote}
                  </p>
                </div>
                {tier.featured ? (
                  <span className="flex size-12 items-center justify-center rounded-full bg-[#e4f2ff] text-[#1688e8]">
                    <Star className="size-5 fill-current" />
                  </span>
                ) : null}
              </div>

              <p
                className={`mt-6 text-lg leading-8 ${
                  tier.featured ? "text-white/72" : "text-[#77777c]"
                }`}
              >
                {tier.description}
              </p>
              <ul className="mt-7 space-y-4">
                {tier.points.map((point) => (
                  <li className="flex items-start gap-3 text-base" key={point}>
                    <Check
                      className={`mt-1 size-5 shrink-0 ${
                        tier.featured ? "text-[#72d6ff]" : "text-[#1688e8]"
                      }`}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-9 h-[3.25rem] w-full rounded-full text-base font-extrabold ${
                  tier.featured
                    ? "bg-white text-[#101116] hover:bg-slate-100"
                    : "bg-[#101116] text-white hover:bg-[#24252c]"
                }`}
              >
                <Link href="/sign-in">
                  {tier.featured ? "Open workspace to upgrade" : "Start free"}
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-5xl font-black tracking-[-0.045em] text-[#1e1e22] md:text-6xl">
            Billing questions
          </h2>
          <div className="mt-9 divide-y divide-slate-200">
            {billingQuestions.map((item, index) => (
              <details
                className="group py-7"
                key={item.question}
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-xl font-black tracking-[-0.02em] text-[#1e1e22]">
                  {item.question}
                  <span className="flex size-7 shrink-0 items-center justify-center">
                    <Plus className="size-6 transition group-open:rotate-45" />
                  </span>
                </summary>
                <p className="mt-5 max-w-4xl text-lg leading-8 text-[#77777c]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
