import { cn } from "@/lib/utils";
import type { BlogIllustration, LandingFeature } from "@/types/marketing";

type SketchPrimitiveProps = {
  className?: string;
};

const avatarClusterItems = [
  { bg: "#f4d9c5", label: "A" },
  { bg: "#d8e8ff", label: "J" },
  { bg: "#d7f0e7", label: "M" },
  { bg: "#f7d5df", label: "S" },
  { bg: "#fff1a8", label: "K" },
];

export function BrandWordmark({ className }: SketchPrimitiveProps) {
  return (
    <span
      className={cn(
        "font-hand text-[1.8rem] font-semibold leading-none text-[var(--color-sketch-ink)]",
        className,
      )}
    >
      Tandaan.AI
    </span>
  );
}

export function HandUnderline({ className }: SketchPrimitiveProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[var(--color-sketch-teal)] opacity-90",
        className,
      )}
    />
  );
}

export function SketchStar({ className }: SketchPrimitiveProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-6 text-[var(--color-sketch-ink)]", className)}
      fill="none"
      viewBox="0 0 48 48"
    >
      <path
        d="M23.5 3.8c1.8 8.8 5.7 14.8 15.3 17.2-8.8 1.9-14 6.1-16.3 16.8C20.3 28 15.5 23.7 6.3 21.6c9-2.5 14.5-8.2 17.2-17.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function PaperPlaneDoodle({ className }: SketchPrimitiveProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-20 text-[var(--color-sketch-ink)]", className)}
      fill="none"
      viewBox="0 0 96 72"
    >
      <path
        d="M8 45c12.5 0 23.5-2.5 33-7.5"
        stroke="currentColor"
        strokeDasharray="4 7"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="m45 33 39-17-16 37-9-16-14-4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="m59 37 25-21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function AvatarCluster({ className }: SketchPrimitiveProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {avatarClusterItems.map((avatar, index) => (
        <span
          aria-hidden="true"
          className="-ml-2 flex size-7 items-center justify-center rounded-full border border-[var(--color-sketch-ink)] text-[10px] font-bold first:ml-0"
          key={avatar.label}
          style={{
            backgroundColor: avatar.bg,
            zIndex: avatarClusterItems.length - index,
          }}
        >
          {avatar.label}
        </span>
      ))}
    </div>
  );
}

export function FeatureDoodle({
  className,
  type,
}: SketchPrimitiveProps & {
  type: LandingFeature["illustration"];
}) {
  if (type === "replay") {
    return (
      <svg
        aria-hidden="true"
        className={cn("h-24 w-full text-[var(--color-sketch-ink)]", className)}
        fill="none"
        viewBox="0 0 260 98"
      >
        <path
          d="M26 55h205"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M55 66V45m150 21V45"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <circle
          cx="130"
          cy="55"
          r="10"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M130 10v27"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M66 78c30-10 94-10 128 0"
          stroke="var(--color-sketch-blue)"
          strokeDasharray="4 5"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <text
          className="font-hand"
          fill="currentColor"
          fontSize="21"
          x="106"
          y="23"
        >
          10:24
        </text>
      </svg>
    );
  }

  if (type === "analytics") {
    return (
      <svg
        aria-hidden="true"
        className={cn("h-24 w-full text-[var(--color-sketch-ink)]", className)}
        fill="none"
        viewBox="0 0 260 98"
      >
        <path
          d="M45 79V24m0 55h72"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M58 70V50m18 20V35m18 35V43"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M129 72c24-6 42-24 53-49"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="m177 25 9-7 1 12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <circle
          cx="206"
          cy="56"
          r="24"
          fill="#d8f4f5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M206 32v24l19 14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={cn("h-24 w-full text-[var(--color-sketch-ink)]", className)}
      fill="none"
      viewBox="0 0 260 98"
    >
      <path
        d="M83 72c-12-2-23-12-23-27 0-12 8-21 20-21 9 0 16 5 20 12 4-7 11-12 20-12 12 0 20 9 20 21 0 15-11 25-23 27"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M101 55c13 0 24 8 29 20H72c5-12 16-20 29-20Z"
        fill="#fff"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M164 25h45v28h-45z"
        fill="#fff"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="m173 60-14 8 3-15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <text
        className="font-hand"
        fill="currentColor"
        fontSize="18"
        x="178"
        y="44"
      >
        You
      </text>
    </svg>
  );
}

export function BlogIllustrationDoodle({
  className,
  type,
}: SketchPrimitiveProps & {
  type: BlogIllustration;
}) {
  const highlight =
    type === "heart"
      ? "#f8dce8"
      : type === "folder"
        ? "#f7eec4"
        : type === "chart"
          ? "#d8f4f5"
          : "#eef0ff";

  return (
    <svg
      aria-hidden="true"
      className={cn("h-full w-full text-[var(--color-sketch-ink)]", className)}
      fill="none"
      viewBox="0 0 260 150"
    >
      <rect
        fill="transparent"
        height="118"
        rx="4"
        stroke="currentColor"
        strokeDasharray="5 7"
        strokeWidth="1.5"
        width="188"
        x="35"
        y="16"
      />
      {type === "heart" ? (
        <path
          d="M130 112c-28-17-43-32-43-52 0-13 9-23 22-23 10 0 17 6 21 13 4-7 11-13 21-13 13 0 22 10 22 23 0 20-15 35-43 52Z"
          fill={highlight}
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : type === "folder" ? (
        <path
          d="M66 104V48h50l9 11h69v45H66Z"
          fill={highlight}
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : type === "chart" ? (
        <g>
          <path
            d="M72 106V48m0 58h118"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M91 94V73m28 21V59m28 35V66m28 28V43"
            stroke="currentColor"
            strokeWidth="8"
          />
          <path
            d="M88 52c35 22 67 4 97-18"
            stroke="var(--color-sketch-blue)"
            strokeDasharray="5 6"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
      ) : type === "people" ? (
        <g>
          <circle
            cx="96"
            cy="62"
            fill={highlight}
            r="20"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="160"
            cy="62"
            fill="#fff"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M62 115c6-24 24-38 44-38s38 14 44 38M120 115c5-21 21-33 39-33 17 0 32 12 38 33"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
      ) : (
        <g>
          <rect
            fill={highlight}
            height="68"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
            width="95"
            x="82"
            y="41"
          />
          <path
            d="M99 62h57M99 78h34M99 94h47"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M189 30c13 7 20 16 20 27m-7-28 1 13 12-4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          {type === "spark" ? (
            <path
              d="M61 51c8 0 13-5 14-15 2 10 7 15 17 16-10 2-15 7-17 17-2-10-6-15-14-18Z"
              stroke="var(--color-sketch-teal)"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          ) : null}
        </g>
      )}
    </svg>
  );
}
