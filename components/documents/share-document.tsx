"use client";

import { Link2, Copy, Check, Trash2, ExternalLink, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareLink {
  id: string;
  url: string;
  expiresAt: string;
  documentId: string;
  isExpired?: boolean;
}

interface ShareDocumentProps {
  documentId: string;
}

export function ShareDocument({ documentId }: ShareDocumentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchShareLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/share`);
      if (response.ok) {
        const data = await response.json();
        setShareLinks(data.shares || []);
      }
    } catch (error) {
      console.error("Error fetching share links:", error);
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  const handleOpen = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open && shareLinks.length === 0) {
        void fetchShareLinks();
      }
    },
    [fetchShareLinks, shareLinks.length],
  );

  const createShareLink = useCallback(
    async (expiryDays: number = 30) => {
      setIsCreating(true);
      try {
        const response = await fetch(`/api/documents/${documentId}/share`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expiryDays }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create share link");
        }

        const data = await response.json();
        setShareLinks((prev) => [data.share, ...prev]);
        toast.success("Share link created");
      } catch (error) {
        console.error("Error creating share link:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to create share link",
        );
      } finally {
        setIsCreating(false);
      }
    },
    [documentId],
  );

  const deleteShareLink = useCallback(
    async (shareId: string) => {
      try {
        const response = await fetch(
          `/api/documents/${documentId}/share?shareId=${shareId}`,
          { method: "DELETE" },
        );

        if (!response.ok) {
          throw new Error("Failed to delete share link");
        }

        setShareLinks((prev) => prev.filter((link) => link.id !== shareId));
        toast.success("Share link deleted");
      } catch (error) {
        console.error("Error deleting share link:", error);
        toast.error("Failed to delete share link");
      }
    },
    [documentId],
  );

  const copyToClipboard = useCallback(async (link: ShareLink) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, []);

  const formatExpiry = (expiresAt: string) => {
    const date = new Date(expiresAt);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Button
        className="h-8 rounded-lg px-2.5 text-xs text-es-primary hover:bg-[#eeede8]"
        onClick={() => handleOpen(true)}
        size="sm"
        variant="ghost"
      >
        <Link2 className="mr-1.5 h-3.5 w-3.5" />
        Share
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share document</DialogTitle>
            <DialogDescription>
              Create a link that anyone can use to view this document. They&apos;ll
              need to sign in first.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Create new link */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={isCreating}
                onClick={() => createShareLink(30)}
              >
                {isCreating ? "Creating..." : "Create 30-day link"}
              </Button>
              <Button
                disabled={isCreating}
                onClick={() => createShareLink(7)}
                variant="outline"
              >
                7 days
              </Button>
            </div>

            {/* Share links list */}
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {isLoading ? (
                <p className="py-4 text-center text-sm text-es-muted">
                  Loading...
                </p>
              ) : shareLinks.length === 0 ? (
                <p className="py-4 text-center text-sm text-es-muted">
                  No share links yet. Create one above.
                </p>
              ) : (
                shareLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 rounded-lg border border-[#e7e2d7] bg-[#fafaf7] p-3"
                  >
                    <Input
                      className="h-8 flex-1 text-xs"
                      readOnly
                      value={link.url}
                    />
                    <Button
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(link)}
                      size="icon"
                      variant="ghost"
                    >
                      {copiedId === link.id ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(link.url, "_blank")}
                      size="icon"
                      variant="ghost"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={() => deleteShareLink(link.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ShareDocument;
