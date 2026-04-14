import { Blocks, PenTool, Sparkles } from "lucide-react";

export const heroCards = [
  {
    id: "raw-thought",
    eyebrow: "Unfinished thought #042",
    lines: ["", "", ""],
    meta: "Drafted at 3:14 AM",
    tilt: "-rotate-[1.15deg]",
    type: "note" as const,
  },
  {
    id: "infinite-block",
    eyebrow: "The Infinite Block",
    quote: '"A thought is not a row in a spreadsheet. It\'s a living entity."',
    note: "No credit card, just vibes.",
    tilt: "rotate-[1.1deg]",
    type: "quote" as const,
  },
  {
    id: "midnight-ink",
    eyebrow: "Draft: The Midnight Ink",
    tilt: "-rotate-[0.8deg]",
    type: "photo" as const,
  },
];

export const featureCards = [
  {
    id: "sticky-blocks",
    title: "Sticky Blocks",
    body: "Snap ideas together like Lego bricks made of paper. Move 'em, stack 'em, love 'em.",
    icon: Blocks,
    tilt: "-rotate-[1.55deg]",
    note: ":)",
  },
  {
    id: "mood-tagging",
    title: "Mood-Tagging",
    body: 'Forget folders. Tag your snippets by vibe: "Midnight Epiphany," "Cold Brew Fueled," or "Absolute Rubbish."',
    icon: Sparkles,
    tilt: "rotate-[1.05deg]",
    note: "Find it by the feeling.",
  },
  {
    id: "ink-sync",
    title: "Ink-Sync",
    body: "Real-time collaboration that actually shows the stroke of your partner's digital pen.",
    icon: PenTool,
    tilt: "-rotate-[0.95deg]",
    note: "It's magic.",
  },
];

export const footerColumns = [
  {
    id: "manifesto",
    title: "Manifesto",
    links: [
      { id: "why-paper", label: "Why Paper?", href: "/" },
      { id: "chaos-theory", label: "The Chaos Theory", href: "/pricing" },
      { id: "anti-ai", label: "Anti-AI Writing", href: "/blog" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    links: [
      { id: "desktop-vault", label: "Desktop Vault", href: "/documents" },
      { id: "mobile-scraps", label: "Mobile Scraps", href: "/documents" },
      { id: "ink-plugin", label: "The Ink Plugin", href: "/docs" },
    ],
  },
  {
    id: "boring-stuff",
    title: "Boring Stuff",
    links: [
      { id: "privacy", label: "Privacy", href: "/docs" },
      { id: "legal", label: "Legal Scribbles", href: "/docs" },
    ],
  },
];

export const testimonial = {
  body: `"I used to spend more time customizing my workspace than actually writing. Tandaan fixed my brain. Now I just... scribble. It's dangerously fun."`,
  name: "Julian Vane",
  role: "Recovering Productivity Nerd",
};

export const focusTags = [
  "Type-writer sounds",
  "Zero-latency Ink",
  "Vellum Texture",
];
