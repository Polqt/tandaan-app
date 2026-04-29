"use client";

import { FilePlus2, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  type DocumentTemplateId,
  listDocumentTemplates,
} from "@/lib/docs/document-templates";
import { captureAnalyticsEvent } from "@/lib/telemetry/analytics";
import { createNewDocument } from "@/services/actions";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const documentTemplates = listDocumentTemplates();

export default function NewDocument({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const handleCreate = useCallback(
    (templateId: DocumentTemplateId = "blank") => {
      startTransition(async () => {
        const result = await createNewDocument(templateId);

        if ("error" in result && result.error === "upgrade_required") {
          captureAnalyticsEvent("document_create_blocked", {
            reason: "upgrade_required",
            source: compact ? "compact_button" : "sidebar_button",
          });
          setShowTemplatePicker(false);
          setShowUpgrade(true);
          return;
        }

        if ("docId" in result && result.docId) {
          captureAnalyticsEvent("document_created", {
            document_id: result.docId,
            template_id: templateId,
            source: compact ? "compact_button" : "sidebar_button",
          });
          setShowTemplatePicker(false);
          toast.success("Document created");
          router.push(`/documents/${result.docId}`);
        }
      });
    },
    [compact, router],
  );

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (
        event.key === "n" &&
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey
      ) {
        event.preventDefault();
        handleCreate("blank");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [handleCreate]);

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    try {
      captureAnalyticsEvent("billing_checkout_started", {
        source: "document_limit_dialog",
      });
      const response = await fetch("/api/billing/checkout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to create checkout");
      }

      const { checkoutUrl } = (await response.json()) as {
        checkoutUrl: string;
      };
      window.location.href = checkoutUrl;
    } catch {
      captureAnalyticsEvent("billing_checkout_failed", {
        source: "document_limit_dialog",
      });
      toast.error("Could not start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Dialog open={showTemplatePicker} onOpenChange={setShowTemplatePicker}>
        <Button asChild>
          <DialogTrigger
            className={
              compact
                ? "h-9 rounded-lg bg-es-ink px-4 text-sm font-medium text-white hover:bg-[#3d4239]"
                : "h-9 w-full justify-start rounded-lg bg-es-ink px-3 text-sm font-medium text-white hover:bg-[#3d4239] active:bg-es-ink"
            }
            disabled={isPending}
          >
            {compact ? (
              <>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                {isPending ? "Creating..." : "New Document"}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-3.5 w-3.5" />
                <span className="flex-1 text-left">
                  {isPending ? "Creating..." : "New Document"}
                </span>
              </>
            )}
          </DialogTrigger>
        </Button>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start with a document pattern</DialogTitle>
            <DialogDescription>
              Pick a starter template, or open a blank page and sketch from
              zero.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 md:grid-cols-2">
            {documentTemplates.map((template) => (
              <button
                className="rounded-3xl border border-[#ebe9e6] bg-[#fbfbfa] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#d8d3cb] hover:bg-white"
                key={template.id}
                onClick={() => handleCreate(template.id)}
                type="button"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ebe9e6] bg-white text-es-ink">
                  <FilePlus2 className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-es-ink">
                  {template.title}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-es-muted">
                  {template.subtitle}
                </p>
                <p className="mt-3 text-sm leading-6 text-es-primary">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
              <span className="text-sm font-medium text-slate-700">
                Pro Plan
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-950">
                  PHP 299
                </span>
                <span className="ml-1 text-xs text-slate-500">/month</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {[
                "Unlimited documents",
                "Full replay timeline",
                "AI session summaries",
                "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  {feature}
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
              {isCheckingOut ? "Redirecting..." : "Upgrade to Pro - PHP 299/mo"}
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
