import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  CalendarCheck,
  FileArchive,
  FileSearch,
  Layers3,
  MessageCircle,
  NotebookTabs,
  PenLine,
  PlayCircle,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export type PublicNavItem = {
  href: string;
  label: string;
};

export type IconContent = {
  accent: "blue" | "green" | "red" | "yellow";
  body: string;
  icon: LucideIcon;
  title: string;
};

export const publicNavItems: PublicNavItem[] = [
  { href: "/features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/billing", label: "Billing" },
];

export const landingFeatures: IconContent[] = [
  {
    accent: "blue",
    body: "Create spaces for projects, initiatives, or any topic. Keep work grouped without turning it into a rigid database.",
    icon: NotebookTabs,
    title: "Rooms for every thread",
  },
  {
    accent: "red",
    body: "Write freely, link context, mention teammates, and keep the important parts of a discussion close to the draft.",
    icon: PenLine,
    title: "Notes that stick",
  },
  {
    accent: "green",
    body: "Replay the path behind decisions so reviewers can understand what changed, who touched it, and why it matters.",
    icon: PlayCircle,
    title: "Decisions you can replay",
  },
  {
    accent: "yellow",
    body: "Attach, preview, and reference supporting work without losing the thread of the document itself.",
    icon: FileArchive,
    title: "Files without chaos",
  },
];

export const workflowSteps = [
  {
    body: "Jot thoughts, links, open questions, and source material before they disappear.",
    color: "#df3e2d",
    icon: PenLine,
    title: "Capture ideas",
  },
  {
    body: "Discuss, ask questions, and build shared understanding without pulling the draft apart.",
    color: "#2369c9",
    icon: MessageCircle,
    title: "Collaborate in real time",
  },
  {
    body: "Record decisions with confidence. Add owners, dates, and next steps while context is fresh.",
    color: "#dba91f",
    icon: CalendarCheck,
    title: "Make decisions",
  },
  {
    body: "Revisit decisions, learn from the sequence, and move forward without rewriting history.",
    color: "#4f9a63",
    icon: PlayCircle,
    title: "Replay and move forward",
  },
] as const;

export const featurePillars: IconContent[] = [
  {
    accent: "blue",
    body: "A room contains the document, collaborators, replay, file references, and comments that belong together.",
    icon: Layers3,
    title: "Room-first organization",
  },
  {
    accent: "red",
    body: "Every meaningful edit can become a replay frame, giving async teams a way to review the story behind the output.",
    icon: BookOpenCheck,
    title: "Narrative replays",
  },
  {
    accent: "green",
    body: "Mention teammates, inspect participants, and keep document ownership legible across shared workspaces.",
    icon: UsersRound,
    title: "Collaborative presence",
  },
  {
    accent: "yellow",
    body: "Version snapshots, share links, and provenance metadata help teams trust the work they did not see live.",
    icon: ShieldCheck,
    title: "Trust traces",
  },
];

export const featureDeepDives = [
  {
    detail:
      "Block-based writing stays lightweight, but each room can carry comments, participants, files, and a replayable timeline.",
    label: "01",
    title: "Write without turning everything into a database",
  },
  {
    detail:
      "When the draft changes, Tandaan keeps enough context for teammates to inspect the reasoning rather than only the diff.",
    label: "02",
    title: "Review the path, not just the final paragraph",
  },
  {
    detail:
      "Shared replay links let stakeholders understand a decision without needing full workspace access.",
    label: "03",
    title: "Share the useful part of history",
  },
];

export const blogPosts = [
  {
    category: "Replay",
    date: "May 8, 2025",
    description:
      "Teams need sequence, rationale, and chapter context, not only diffs.",
    readTime: "6 min read",
    slug: "narrative-replays",
    title: "Why narrative replays beat static changelogs",
  },
  {
    category: "Trust",
    date: "Apr 24, 2025",
    description:
      "How provenance metadata creates confidence in shared replay artifacts.",
    readTime: "7 min read",
    slug: "trust-trace",
    title: "Designing trust traces for async teams",
  },
  {
    category: "Workflow",
    date: "Apr 10, 2025",
    description:
      "A field guide for turning loose notes into decisions your team can act on.",
    readTime: "5 min read",
    slug: "notes-into-action",
    title: "5 ways to turn notes into action",
  },
] as const;

export type BlogPostSlug = (typeof blogPosts)[number]["slug"];

export const blogPostDetails: Record<
  BlogPostSlug,
  {
    sections: Array<{
      body: string[];
      heading: string;
    }>;
  }
> = {
  "narrative-replays": {
    sections: [
      {
        body: [
          "Static changelogs tell you what changed. Narrative replays explain how and why it changed.",
          "A replay lets reviewers watch the edit unfold chapter by chapter, with rationale attached to the moments that actually mattered.",
        ],
        heading: "The problem with diffs",
      },
      {
        body: [
          "New teammates can watch a short replay and understand the current document, the abandoned alternatives, and the reasoning behind the final structure.",
          "That makes async review sharper because reviewers can respond to the decision path instead of guessing from the final copy.",
        ],
        heading: "Why sequence matters",
      },
      {
        body: [
          "Use narrative replay for cross-functional specs, launch plans, policy drafts, and any document where context is more important than the final wording alone.",
        ],
        heading: "When to use it",
      },
    ],
  },
  "notes-into-action": {
    sections: [
      {
        body: [
          "Loose notes become useful when they have ownership, timing, source context, and a visible next step.",
          "Tandaan keeps those signals close to the writing surface so the team can move without a separate tracking ritual.",
        ],
        heading: "Start with one decision",
      },
      {
        body: [
          "A good room keeps supporting files, comments, replay frames, and decisions in one place. The goal is not more structure. The goal is less hunting.",
        ],
        heading: "Keep context nearby",
      },
      {
        body: [
          "When a decision changes, replay the old path before replacing it. Teams build trust faster when they can see why momentum shifted.",
        ],
        heading: "Replay before rewriting",
      },
    ],
  },
  "trust-trace": {
    sections: [
      {
        body: [
          "Trust traces attach provenance directly to replay frames. They show who made the change, when it happened, what informed the decision, and why the team chose that direction.",
          "This is not transparency theater. It solves the async trust gap that appears when teammates receive work they did not see being created.",
        ],
        heading: "The async trust gap",
      },
      {
        body: [
          "Author identity and timestamp are automatic. Source references and decision notes are optional, but they are one click away when a change deserves explanation.",
        ],
        heading: "Low-friction capture",
      },
      {
        body: [
          "Context belongs on the replay frame, not in a separate audit log. Reviewers should see the evidence at the same moment they inspect the change.",
        ],
        heading: "Inline, not separate",
      },
    ],
  },
};

export const landingFaqs = [
  {
    answer:
      "Tandaan is a collaborative document workspace for notes, rooms, and replayable decisions.",
    question: "What is Tandaan?",
  },
  {
    answer:
      "Most tools show final documents and technical history. Tandaan focuses on the living context: comments, replay frames, and decision traces.",
    question: "How is it different from other tools?",
  },
  {
    answer:
      "Yes. The free plan is enough to try the workflow with real documents before upgrading.",
    question: "Can I try Tandaan for free?",
  },
  {
    answer:
      "Your workspace uses Clerk authentication, API route protections, and replay links that can be shared deliberately.",
    question: "Is my data secure?",
  },
];

export const footerColumns = [
  {
    links: [
      { href: "/features", label: "Features" },
      { href: "/billing", label: "Billing" },
      { href: "/documents", label: "Workspace" },
    ],
    title: "Product",
  },
  {
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/docs", label: "Docs" },
      { href: "mailto:hello@tandaan.app", label: "Contact" },
    ],
    title: "Resources",
  },
  {
    links: [
      { href: "/sign-in", label: "Sign in" },
      { href: "/billing", label: "Plans" },
      { href: "/blog/trust-trace", label: "Trust" },
    ],
    title: "Company",
  },
];

export const accentClassNames = {
  blue: "text-paper-blue bg-[#dfe9fb] border-paper-blue",
  green: "text-[#35784a] bg-[#e0efdf] border-paper-green",
  red: "text-[#b53024] bg-[#f8ded8] border-paper-red",
  yellow: "text-[#8a6815] bg-[#fff1b8] border-[#dba91f]",
} as const;

export const postIllustrationIcons = [FileSearch, UsersRound, BookOpenCheck];
