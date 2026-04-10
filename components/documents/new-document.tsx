"use client";

import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

export default function NewDocument() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
      <Button
        className="h-11 w-full justify-start rounded-xl border border-transparent px-3 text-stone-700 hover:border-[#e8e6e1] hover:bg-white"
        disabled={isPending}
        onClick={handleCreate}
        variant="ghost"
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">
          {isPending ? "Creating..." : "New Document"}
        </span>
      </Button>

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
