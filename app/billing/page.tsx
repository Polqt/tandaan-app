"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePlan } from "@/hooks/usePlan";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const PRO_FEATURES = [
  "Unlimited documents",
  "Full replay timeline & chapters",
  "AI session summaries",
  "Priority support",
];

const FREE_FEATURES = [
  `Up to 3 documents`,
  "Replay timeline (7 days)",
  "2 public replay links",
  "Community support",
];

function StatusBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  if (!status) return null;

  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
        status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {status === "success" ? (
        <>
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Payment successful — your Pro plan is now active.
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 shrink-0" />
          Payment was not completed. You can try again below.
        </>
      )}
    </div>
  );
}

export default function BillingPage() {
  const { user } = useUser();
  const { plan, isLoading } = usePlan();
  const queryClient = useQueryClient();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const isPro = plan === "pro";

  // Refetch plan after returning from PayMongo
  useEffect(() => {
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ["user-plan", user.id] });
    }
  }, [queryClient, user?.id]);

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      if (!res.ok) throw new Error();
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Could not start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Downgrade to Free? You'll lose access to Pro features immediately.")) return;
    setIsCancelling(true);
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      if (!res.ok) throw new Error();
      await queryClient.invalidateQueries({ queryKey: ["user-plan", user?.id] });
      toast.success("Subscription cancelled. You're now on the Free plan.");
    } catch {
      toast.error("Could not cancel. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="mx-auto max-w-[680px] px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-stone-950">
          Billing
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your Tandaan subscription.
        </p>
      </div>

      <StatusBanner />

      {/* Current plan card */}
      <div className="mb-6 overflow-hidden rounded-[1.75rem] border border-[#ebe9e6] bg-white">
        <div className="flex items-center justify-between border-b border-[#f1efeb] px-6 py-4">
          <div className="flex items-center gap-3">
            {isPro ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                <Zap className="h-4 w-4" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-stone-950">
                {isLoading ? "Loading…" : isPro ? "Pro Plan" : "Free Plan"}
              </p>
              <p className="text-xs text-stone-500">
                {isPro ? "₱299 / month" : "₱0 / month"}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isPro
                ? "bg-slate-950 text-white"
                : "border border-stone-200 bg-stone-50 text-stone-600"
            }`}
          >
            {isPro ? "Active" : "Free"}
          </span>
        </div>

        <ul className="divide-y divide-[#f7f6f3] px-6">
          {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f) => (
            <li key={f} className="flex items-center gap-3 py-3 text-sm text-stone-700">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              {f}
            </li>
          ))}
        </ul>

        <div className="px-6 py-4">
          {isPro ? (
            <Button
              className="h-10 rounded-full px-5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={isCancelling}
              onClick={handleCancel}
              variant="ghost"
            >
              {isCancelling ? "Cancelling…" : "Cancel subscription"}
            </Button>
          ) : (
            <Button
              className="h-10 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800"
              disabled={isCheckingOut}
              onClick={handleUpgrade}
            >
              {isCheckingOut ? "Redirecting…" : "Upgrade to Pro — ₱299/mo"}
            </Button>
          )}
        </div>
      </div>

      {/* Compare plans */}
      {!isPro && (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-6 py-5">
          <p className="text-sm font-semibold text-amber-900">
            Unlock Pro to remove limits
          </p>
          <p className="mt-1 text-xs leading-6 text-amber-700">
            Unlimited documents, full replay timelines, and AI session
            summaries — everything you need to ship with full context.
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-block text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900"
          >
            See full plan comparison →
          </Link>
        </div>
      )}
    </div>
  );
}
