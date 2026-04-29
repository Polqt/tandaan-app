import { Check, Star } from "lucide-react";

type PaperStackIllustrationProps = {
  compact?: boolean;
  showRoomCard?: boolean;
};

const ringKeys = ["top", "upper", "middle", "lower", "base", "bottom", "tail"];

export default function PaperStackIllustration({
  compact = false,
  showRoomCard = true,
}: PaperStackIllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className={`paper-stack-illustration ${compact ? "is-compact" : ""}`}
    >
      <div className="paper-stack-board" />
      <div className="paper-stack-tabs">
        <span className="bg-[#ff563f]" />
        <span className="bg-[#2f72c7]" />
        <span className="bg-[#f4cf3f]" />
        <span className="bg-[#72bf70]" />
      </div>
      <div className="paper-stack-sheet">
        <span />
        <span />
        <span />
        <span />
        <div className="paper-stack-note" />
      </div>
      <div className="paper-stack-rings">
        {ringKeys.map((key) => (
          <span key={key} />
        ))}
      </div>
      <Star className="paper-stack-star" strokeWidth={1.8} />
      <div className="paper-tab paper-stack-tab-label paper-stack-tab-label-rooms bg-[#df4b36] text-white">
        Rooms
      </div>
      <div className="paper-tab paper-stack-tab-label paper-stack-tab-label-notes bg-[#2f72c7] text-white">
        Notes
      </div>
      <div className="paper-tab paper-stack-tab-label paper-stack-tab-label-decisions bg-paper-yellow text-[#342b12]">
        Decisions
      </div>

      {showRoomCard ? (
        <div className="paper-panel paper-stack-room-card p-4 shadow-paper">
          <div className="flex items-center justify-between border-b border-(--color-paper-line) pb-2">
            <p className="font-hand text-2xl text-(--color-paper-ink)">
              Product Room
            </p>
            <span className="text-xs font-bold text-(--color-paper-soft)">
              6
            </span>
          </div>
          <div className="mt-3 space-y-2 text-xs text-(--color-paper-muted)">
            {[
              "Discuss launch timing",
              "Review proposal v2",
              "Decision on pricing",
            ].map((item, index) => (
              <div className="flex items-center gap-2" key={item}>
                <span className="flex size-4 items-center justify-center border border-(--color-paper-ink)">
                  {index === 1 ? <Check className="size-3" /> : null}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-paper-blue">
            replay
          </span>
        </div>
      ) : null}
    </div>
  );
}
