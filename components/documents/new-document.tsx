"use client";

import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { createNewDocument } from "@/services/actions";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function NewDocument({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        handleCreate();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createNewDocument();

      if ("error" in result && result.error === "upgrade_required") {
        setShowUpgrade(true);
        return;
      }

      if ("docId" in result && result.docId) {
        toast.success("Document created");
        router.push(`/documents/${result.docId}`);
      }
    });
  };

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create checkout");
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Could not start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {compact ? (
        <Button
          className="h-9 rounded-lg bg-[#2f3430] px-4 text-sm font-medium text-white hover:bg-[#3d4239]"
          disabled={isPending}
          onClick={handleCreate}
          variant="default"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          {isPending ? "Creating..." : "New Document"}
        </Button>
      ) : (
        <Button
          className="h-9 w-full justify-start rounded-lg bg-[#2f3430] px-3 text-sm font-medium text-white hover:bg-[#3d4239] active:bg-[#2f3430]"
          disabled={isPending}
          onClick={handleCreate}
          variant="default"
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          <span className="flex-1 text-left">
            {isPending ? "Creating..." : "New Document"}
          </span>
        </Button>
      )}

      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              You've reached the free limit
            </DialogTitle>
            <DialogDescription className="text-center text-sm leading-6">
              Free plan allows up to <strong>3 documents</strong>. Upgrade to
              Pro for unlimited documents, replay chapters, and AI summaries.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-slate-700">Pro Plan</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-950">₱299</span>
                <span className="ml-1 text-xs text-slate-500">/month</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {[
                "Unlimited documents",
                "Full replay timeline",
                "AI session summaries",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <Button
              className="h-11 w-full rounded-full font-semibold"
              disabled={isCheckingOut}
              onClick={handleUpgrade}
            >
              {isCheckingOut ? "Redirecting..." : "Upgrade to Pro — ₱299/mo"}
            </Button>
            <Button
              className="h-10 w-full rounded-full text-sm"
              onClick={() => setShowUpgrade(false)}
              variant="ghost"
            >
              Maybe later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
