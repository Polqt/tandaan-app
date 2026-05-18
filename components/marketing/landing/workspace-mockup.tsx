import {
  Check,
  Clock3,
  MessageCircle,
  MousePointer2,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WorkspaceMockupProps = {
  className?: string;
  compact?: boolean;
};

const replayRows = [
  { label: "Aira opened launch plan", time: "10:12" },
  { label: "Jepoy rewrote goals", time: "10:18" },
  { label: "Sam resolved pricing note", time: "10:31" },
] as const;

const tableRows = [
  ["Decision", "Owner", "Status"],
  ["Beta positioning", "Aira", "Approved"],
  ["Launch story", "Jepoy", "Review"],
  ["Pricing note", "Sam", "Done"],
] as const;

export function WorkspaceMockup({
  className,
  compact = false,
}: WorkspaceMockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[54rem]",
        compact ? "max-w-[48rem]" : "",
        className,
      )}
    >
      <div className="absolute -left-10 top-20 hidden h-[28rem] w-[34rem] rotate-[-12deg] rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:block" />
      <div className="absolute -right-8 top-14 hidden h-[27rem] w-[34rem] rotate-[9deg] rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:block" />

      <div className="relative overflow-hidden rounded-[8px] border border-slate-200 bg-white text-left shadow-[0_26px_70px_rgba(15,23,42,0.14)]">
        <div className="grid border-b border-slate-200 md:grid-cols-[1fr_0.8fr]">
          <section className="p-6 md:p-9">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Workspace
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#1e1e22]">
                  Launch Plan
                </h3>
              </div>
              <div className="flex -space-x-2">
                {["A", "J", "S"].map((item, index) => (
                  <span
                    className="flex size-9 items-center justify-center rounded-full border-2 border-white text-xs font-black text-[#1e1e22]"
                    key={item}
                    style={{
                      backgroundColor: ["#e4f2ff", "#fff1a8", "#ffd9cc"][index],
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3">
              <div className="h-3 w-11/12 rounded-full bg-slate-200" />
              <div className="h-3 w-8/12 rounded-full bg-slate-200" />
              <div className="h-3 w-10/12 rounded-full bg-slate-200" />
            </div>

            <div className="mt-10 overflow-hidden rounded-[8px] border border-slate-200">
              {tableRows.map((row, index) => (
                <div
                  className={cn(
                    "grid grid-cols-3 border-slate-200 px-4 py-3 text-sm",
                    index === 0
                      ? "bg-slate-50 font-black text-slate-400"
                      : "border-t font-bold text-[#1e1e22]",
                  )}
                  key={row.join("-")}
                >
                  {row.map((cell) => (
                    <span key={cell}>{cell}</span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <aside className="border-t border-slate-200 bg-[#fbfbfa] p-6 md:border-l md:border-t-0 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e4f2ff] px-3 py-1.5 text-sm font-black text-[#1688e8]">
              <Play className="size-4 fill-current" />
              Replay ready
            </div>
            <div className="mt-8 grid gap-4">
              {replayRows.map((row, index) => (
                <div className="flex gap-3" key={row.label}>
                  <span className="mt-1 flex size-7 items-center justify-center rounded-full bg-white text-[#1688e8] shadow-sm">
                    {index === 2 ? (
                      <Check className="size-4" />
                    ) : (
                      <Clock3 className="size-4" />
                    )}
                  </span>
                  <div>
                    <p className="font-black text-[#1e1e22]">{row.label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-400">
                      {row.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 rounded-[8px] border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#1e1e22]">
                <MessageCircle className="size-4 text-[#1688e8]" />
                Comment pinned to replay
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Keep the reasoning here so review does not restart in chat.
              </p>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between px-6 py-4 text-sm font-bold text-slate-400 md:px-9">
          <span>Autosaved 2 min ago</span>
          <span className="inline-flex items-center gap-2 text-[#1688e8]">
            <MousePointer2 className="size-4" />
            Sam is editing
          </span>
        </div>
      </div>
    </div>
  );
}
