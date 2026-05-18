import {
  BarChart3,
  MessageCircle,
  PenLine,
  PlayCircle,
  UsersRound,
} from "lucide-react";
import type {
  BlogPost,
  BlogPostDetail,
  LandingFeature,
  PublicNavItem,
} from "@/types/marketing";

export const publicNavItems: PublicNavItem[] = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export const landingFeatures: LandingFeature[] = [
  {
    body: "Edit together in real time with cursors, comments, and mentions.",
    title: "Live Collaboration",
  },
  {
    body: "Rewind and replay the entire journey of your document.",
    title: "Session Replay",
  },
  {
    body: "Understand what matters with insights on activity, engagement, and more.",
    title: "Smart Analytics",
  },
];

export const workflowSteps = [
  {
    body: "Start a doc in seconds with notes, links, context, and tasks.",
    color: "#4f66f6",
    icon: PenLine,
    title: "Create",
  },
  {
    body: "Bring the right people in with permissions and shared spaces.",
    color: "#30a8b2",
    icon: UsersRound,
    title: "Invite",
  },
  {
    body: "Edit, comment, assign, and resolve decisions together.",
    color: "#ffd35a",
    icon: MessageCircle,
    title: "Collaborate",
  },
  {
    body: "See how ideas evolved, then use insights to improve the workflow.",
    color: "#7d63ef",
    icon: PlayCircle,
    title: "Replay",
  },
  {
    body: "Turn activity, comments, and outcomes into better decisions.",
    color: "#2ea7b0",
    icon: BarChart3,
    title: "Improve",
  },
] as const;

export const blogCategories = [
  "Productivity",
  "Collaboration",
  "Knowledge Mgmt",
  "Team Culture",
  "Updates",
  "Tutorials",
] as const;

export const popularTags = [
  "collaboration",
  "productivity",
  "remote work",
  "ai",
  "knowledge",
  "tandaan",
] as const;

export const blogPosts = [
  {
    author: "Jepoy Belo",
    category: "Collaboration",
    date: "May 10, 2026",
    description:
      "Why async collaboration tools are winning, and how Tandaan.AI is building for the future of work.",
    featured: true,
    illustration: "board",
    readTime: "6 min read",
    slug: "future-team-collaboration",
    tags: ["collaboration", "remote work", "knowledge"],
    title: "The Future of Team Collaboration is Human (and Asynchronous)",
  },
  {
    author: "Aira Valdez",
    category: "Tutorials",
    date: "May 1, 2026",
    description: "A behind-the-scenes look at our most requested feature.",
    illustration: "replay",
    readTime: "5 min read",
    slug: "narrative-replays",
    tags: ["collaboration", "tandaan"],
    title: "How We Built Session Replay in Tandaan.AI",
  },
  {
    author: "Miguel Santos",
    category: "Productivity",
    date: "Apr 20, 2026",
    description: "Simple frameworks to keep your docs useful and findable.",
    illustration: "folder",
    readTime: "4 min read",
    slug: "organize-team-knowledge",
    tags: ["productivity", "knowledge"],
    title: "10 Ways to Organize Your Team's Knowledge",
  },
  {
    author: "Tandaan Team",
    category: "Team Culture",
    date: "Apr 20, 2026",
    description: "Designing a workspace that feels personal and delightful.",
    illustration: "heart",
    readTime: "7 min read",
    slug: "notes-to-impact-design-philosophy",
    tags: ["tandaan", "collaboration"],
    title: "From Notes to Impact: Our Design Philosophy",
  },
  {
    author: "Jepoy Belo",
    category: "Updates",
    date: "Apr 15, 2026",
    description: "What we are building and why it matters.",
    illustration: "spark",
    readTime: "3 min read",
    slug: "introducing-tandaan-ai",
    tags: ["ai", "tandaan"],
    title: "Introducing Tandaan AI",
  },
  {
    author: "Aira Valdez",
    category: "Knowledge Mgmt",
    date: "Apr 8, 2026",
    description: "Capture, connect, and scale your team's collective brain.",
    illustration: "people",
    readTime: "6 min read",
    slug: "second-brain-for-team",
    tags: ["knowledge", "productivity"],
    title: "Building a Second Brain for Your Team",
  },
  {
    author: "Miguel Santos",
    category: "Collaboration",
    date: "Mar 30, 2026",
    description: "How async docs can save your team hours every week.",
    illustration: "chart",
    readTime: "4 min read",
    slug: "better-meetings-fewer-meetings",
    tags: ["remote work", "collaboration"],
    title: "Better Meetings, Fewer Meetings",
  },
] as const satisfies readonly BlogPost[];

export type BlogPostSlug = (typeof blogPosts)[number]["slug"];

const defaultArticleSections = [
  {
    body: [
      "Real-time tools are useful, but they often reward speed over understanding. Teams still need space to think, revisit context, and make decisions that survive after the call.",
      "Tandaan treats the document as a living surface. Comments, replay, and decisions stay attached to the work so teammates can catch up without asking everyone to repeat the meeting.",
    ],
    heading: "Why async wins",
  },
  {
    body: [
      "The best collaboration pattern is not faster chat. It is a shared artifact that shows what changed, why it changed, and what the team decided to do next.",
      "That means the product needs to preserve sequence, authorship, and small pieces of rationale without making people manage a separate audit trail.",
    ],
    heading: "The problem with real-time",
  },
  {
    body: [
      "We are designing Tandaan around calm capture, clear replay, and lightweight knowledge organization. The goal is a workspace that keeps momentum visible without adding more meetings.",
    ],
    heading: "How we think about it",
  },
  {
    body: [
      "The next wave of team tools will feel more human because they respect attention. They will help teammates understand the story of the work, not just the final state.",
    ],
    heading: "What's next",
  },
  {
    body: [
      "Start with one shared document, keep decisions close to the draft, and use replay when the reasoning matters. Small habits make async work easier to trust.",
    ],
    heading: "Key takeaways",
  },
];

export const blogPostDetails: Record<BlogPostSlug, BlogPostDetail> = {
  "better-meetings-fewer-meetings": {
    keyTakeaway:
      "A meeting is useful only when it creates durable context. Async docs should carry the context forward.",
    sections: defaultArticleSections,
  },
  "future-team-collaboration": {
    keyTakeaway:
      "Async is not about slowing down. It is about making progress that sticks.",
    sections: defaultArticleSections,
  },
  "introducing-tandaan-ai": {
    keyTakeaway:
      "AI should help teams remember, summarize, and connect decisions without replacing the human judgment behind them.",
    sections: defaultArticleSections,
  },
  "narrative-replays": {
    keyTakeaway:
      "Session replay works when it turns edits into a readable story instead of a noisy event log.",
    sections: [
      {
        body: [
          "Static changelogs tell you what changed. Narrative replays explain how and why it changed.",
          "A replay lets reviewers watch the edit unfold chapter by chapter, with rationale attached to the moments that actually mattered.",
        ],
        heading: "Why replay matters",
      },
      {
        body: [
          "New teammates can watch a short replay and understand the current document, the abandoned alternatives, and the reasoning behind the final structure.",
          "That makes async review sharper because reviewers can respond to the decision path instead of guessing from the final copy.",
        ],
        heading: "Designing the timeline",
      },
      {
        body: [
          "We keep the controls familiar: timestamps, chapters, cursors, comments, and lightweight highlights. The replay should feel like reading the document with memory turned on.",
        ],
        heading: "What stays visible",
      },
      {
        body: [
          "Use session replay for launch plans, product specs, policy drafts, and any document where the reasoning is more important than the final wording alone.",
        ],
        heading: "Key takeaways",
      },
    ],
  },
  "notes-to-impact-design-philosophy": {
    keyTakeaway:
      "A workspace feels personal when the product lets people leave useful traces without turning the UI into bureaucracy.",
    sections: defaultArticleSections,
  },
  "organize-team-knowledge": {
    keyTakeaway:
      "Useful knowledge systems are simple enough for everyone to maintain during real work.",
    sections: defaultArticleSections,
  },
  "second-brain-for-team": {
    keyTakeaway:
      "A team second brain should connect documents, decisions, and people without becoming another place to babysit.",
    sections: defaultArticleSections,
  },
};

export const footerColumns = [
  {
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#workflow", label: "Workflow" },
      { href: "/#replay", label: "Session Replay" },
      { href: "/billing", label: "Pricing" },
    ],
    title: "Tandaan",
  },
  {
    links: [
      { href: "/blog/future-team-collaboration", label: "Async Teams" },
      { href: "/blog/narrative-replays", label: "Narrative Replays" },
      { href: "/blog/organize-team-knowledge", label: "Knowledge" },
    ],
    title: "Resources",
  },
  {
    links: [
      { href: "mailto:hello@tandaan.app", label: "About Us" },
      { href: "mailto:hello@tandaan.app", label: "Careers" },
      { href: "mailto:hello@tandaan.app", label: "Contact" },
      { href: "/blog", label: "Press" },
    ],
    title: "Company",
  },
  {
    links: [
      { href: "mailto:privacy@tandaan.app", label: "Privacy" },
      { href: "mailto:legal@tandaan.app", label: "Terms" },
      { href: "mailto:security@tandaan.app", label: "Security" },
    ],
    title: "Legal",
  },
];
