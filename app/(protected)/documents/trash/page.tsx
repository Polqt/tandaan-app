import { auth } from "@clerk/nextjs/server";
import { Timestamp } from "firebase-admin/firestore";
import { Archive, Clock3, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import RestoreDocument from "@/components/documents/restore-document";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { adminDB } from "@/firebase-admin";

type TrashItem = {
  deleteAt: string | null;
  expiresAt: string | null;
  roomId: string;
  title: string;
};

function toIsoTimestamp(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return typeof value === "string" ? value : null;
}

export default async function TrashPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const snapshot = await adminDB
    .collection("trash")
    .where("userId", "==", userId)
    .get();

  const items = snapshot.docs
    .map<TrashItem>((doc) => {
      const data = doc.data() as Record<string, unknown>;
      return {
        deleteAt: toIsoTimestamp(data.deleteAt),
        expiresAt: toIsoTimestamp(data.expiresAt),
        roomId:
          typeof data.roomId === "string" && data.roomId.length > 0
            ? data.roomId
            : doc.id,
        title:
          typeof data.title === "string" && data.title.trim().length > 0
            ? data.title
            : "Untitled",
      };
    })
    .sort((a, b) => {
      const aTime = a.deleteAt ? new Date(a.deleteAt).getTime() : 0;
      const bTime = b.deleteAt ? new Date(b.deleteAt).getTime() : 0;
      return bTime - aTime;
    });

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbPage className="text-es-muted">
                  Workspace
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-es-muted">
                  Documents
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-es-ink">Trash</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-2 font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.045em] text-es-ink md:text-[3rem]">
            Trash
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-es-muted">
            Recently deleted documents stay here for 30 days before permanent
            removal. Restore anything you still need.
          </p>
        </div>

        <Button
          asChild
          className="h-10 rounded-full px-4 text-sm"
          variant="outline"
        >
          <Link href="/documents">Back to documents</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.75rem] border border-[#e7e1d5] bg-white/85 px-6 py-16 text-center shadow-[0_18px_48px_rgba(47,52,48,0.04)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f1eb] text-es-muted">
            <Archive className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-es-ink">Trash is empty</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-es-muted">
            Deleted sketches will show up here, so restore can be tested and
            managed without guessing a URL.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <article
              key={item.roomId}
              className="rounded-3xl border border-[#e7e1d5] bg-white/90 px-4 py-4 shadow-[0_14px_32px_rgba(47,52,48,0.04)] sm:px-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ece7dd] bg-[#f7f5ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-es-muted">
                    <Trash2 className="h-3 w-3" />
                    In trash
                  </div>
                  <h2 className="mt-3 truncate text-lg font-semibold text-es-ink sm:text-xl">
                    {item.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-es-muted">
                    {item.deleteAt ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        Deleted{" "}
                        {new Date(item.deleteAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : null}
                    {item.expiresAt ? (
                      <span>
                        Auto-removes{" "}
                        {new Date(item.expiresAt).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <RestoreDocument roomId={item.roomId} showLabel />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
