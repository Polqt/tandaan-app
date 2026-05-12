import {
  BarChart3,
  BookOpenCheck,
  FileClock,
  Layers3,
  MessageCircle,
  PenLine,
  PlayCircle,
  PlugZap,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UsersRound,
} from "lucide-react";
import type {
  BlogPost,
  BlogPostDetail,
  IconContent,
  LandingFeature,
  ProductTab,
  PublicNavItem,
  SolutionPersona,
} from "@/types/marketing";

export const publicNavItems: PublicNavItem[] = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export const landingFeatures: LandingFeature[] = [
  {
    body: "Edit together in real time with cursors, comments, and mentions.",
    illustration: "collaboration",
    title: "Live Collaboration",
  },
  {
    body: "Rewind and replay the entire journey of your document.",
    illustration: "replay",
    title: "Session Replay",
  },
  {
    body: "Understand what matters with insights on activity, engagement, and more.",
    illustration: "analytics",
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

export const productTabs: ProductTab[] = [
  {
    body: "Live cursors, typed edits, comment threads, and lightweight assignments keep collaboration visible without turning the document into a busy chat room.",
    bullets: [
      "Live cursors",
      "Instant edits",
      "Comments and threads",
      "Mentions and tasks",
    ],
    id: "collaboration",
    title: "Live Collaboration",
  },
  {
    body: "Replay turns edits into a readable timeline so teammates can understand how the document changed and why a decision landed.",
    bullets: [
      "Chapter markers",
      "Playback controls",
      "Decision highlights",
      "Shareable replay links",
    ],
    id: "replay",
    title: "Session Replay",
  },
  {
    body: "Team analytics surface activity, engagement, bottlenecks, and review patterns without forcing managers into another dashboard.",
    bullets: [
      "Activity trends",
      "Review velocity",
      "Meeting reduction",
      "Team alignment",
    ],
    id: "analytics",
    title: "Analytics",
  },
  {
    body: "Comments stay anchored to the work, with resolved context, ownership, and follow-ups preserved for async teammates.",
    bullets: [
      "Inline comments",
      "Decision notes",
      "Owner mentions",
      "Resolved history",
    ],
    id: "comments",
    title: "Comments",
  },
];

export const productFeatureGrid: IconContent[] = [
  {
    accent: "blue",
    body: "Compose structured plans, specs, notes, and checklists in a calm document surface.",
    icon: PenLine,
    title: "Rich Editor",
  },
  {
    accent: "green",
    body: "Control who can view, comment, edit, or share across rooms and documents.",
    icon: UserCheck,
    title: "Permissions",
  },
  {
    accent: "yellow",
    body: "Restore prior snapshots and compare how important sections evolved.",
    icon: FileClock,
    title: "Version History",
  },
  {
    accent: "red",
    body: "Connect the tools your team already uses without adding a heavy workflow layer.",
    icon: PlugZap,
    title: "Integrations",
  },
];

export const productUseCases = [
  {
    body: "Plan, document, and ship better products.",
    title: "Product Teams",
  },
  {
    body: "Organize docs, feedback, and assets.",
    title: "Design Teams",
  },
  {
    body: "Move fast and keep everyone aligned.",
    title: "Startups",
  },
  {
    body: "Collaborate on projects and research.",
    title: "Students",
  },
] as const;

export const solutionPersonas: SolutionPersona[] = [
  {
    challenge:
      "Scattered ideas, endless meetings, and decision history spread across chat, docs, and task tools.",
    features: [
      "Session Replay",
      "Tasks and Checklists",
      "Analytics",
      "Comments and Mentions",
    ],
    id: "product-teams",
    impact: [
      { label: "Fewer Meetings", value: "40%" },
      { label: "Faster Decisions", value: "60%" },
      { label: "More Clarity", value: "80%" },
    ],
    label: "Product Teams",
    solution:
      "Centralize product thinking in one workspace. Capture context, collaborate async, replay every step, and turn decisions into action.",
  },
  {
    challenge:
      "Feedback lives in design files, screenshots, docs, and meetings, making creative decisions hard to trace.",
    features: [
      "Visual Comments",
      "Replayable Feedback",
      "Shared Briefs",
      "Decision Notes",
    ],
    id: "designers",
    impact: [
      { label: "Faster Reviews", value: "45%" },
      { label: "Less Rework", value: "50%" },
      { label: "Clearer Handoffs", value: "70%" },
    ],
    label: "Designers",
    solution:
      "Keep briefs, references, comments, and rationale together so everyone can understand the creative path without another review call.",
  },
  {
    challenge:
      "Group projects lose momentum when research, draft edits, responsibilities, and professor feedback are split up.",
    features: [
      "Shared Notes",
      "Task Owners",
      "Revision History",
      "Study Replays",
    ],
    id: "students",
    impact: [
      { label: "Better Alignment", value: "55%" },
      { label: "Fewer Missed Tasks", value: "35%" },
      { label: "Cleaner Drafts", value: "65%" },
    ],
    label: "Students",
    solution:
      "Create one collaborative notebook where research, writing, comments, and version history stay attached to the project.",
  },
  {
    challenge:
      "Small teams move quickly, but decisions disappear when everyone is switching between sales, product, support, and planning.",
    features: [
      "Startup Wiki",
      "Async Decisions",
      "Founder Replay",
      "Team Analytics",
    ],
    id: "startups",
    impact: [
      { label: "Faster Onboarding", value: "50%" },
      { label: "Less Context Loss", value: "70%" },
      { label: "More Focus", value: "30%" },
    ],
    label: "Startups",
    solution:
      "Give the team one lightweight place to write, decide, replay, and improve without managing a complex operating system.",
  },
];

export const solutionWorkflow = [
  { icon: Sparkles, title: "Identify Problem" },
  { icon: PenLine, title: "Use Tandaan.AI" },
  { icon: UsersRound, title: "Collaborate" },
  { icon: BarChart3, title: "Get Results" },
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
      { href: "/product", label: "Features" },
      { href: "/product#replay", label: "Session Replay" },
      { href: "/product#analytics", label: "Analytics" },
      { href: "/product#integrations", label: "Integrations" },
      { href: "/billing", label: "Pricing" },
    ],
    title: "Product",
  },
  {
    links: [
      { href: "/solutions", label: "Teams" },
      { href: "/solutions#students", label: "Students" },
      { href: "/solutions#startups", label: "Startups" },
      { href: "/solutions#designers", label: "Designers" },
    ],
    title: "Solutions",
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

export const accentClassNames = {
  blue: "text-paper-blue bg-[#dfe9fb] border-paper-blue",
  green: "text-[#35784a] bg-[#e0efdf] border-paper-green",
  red: "text-[#b53024] bg-[#f8ded8] border-paper-red",
  yellow: "text-[#8a6815] bg-[#fff1b8] border-[#dba91f]",
} as const;
