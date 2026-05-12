import type { LucideIcon } from "lucide-react";

export type AccentName = "blue" | "green" | "red" | "yellow";

export type PublicNavItem = {
  href: string;
  label: string;
  shortLabel?: string;
};

export type IconContent = {
  accent: AccentName;
  body: string;
  icon: LucideIcon;
  title: string;
};

export type ProductTabId =
  | "collaboration"
  | "replay"
  | "analytics"
  | "comments";

export type ProductTab = {
  body: string;
  bullets: string[];
  id: ProductTabId;
  title: string;
};

export type SolutionPersonaId =
  | "product-teams"
  | "designers"
  | "students"
  | "startups";

export type SolutionPersona = {
  challenge: string;
  features: string[];
  id: SolutionPersonaId;
  impact: Array<{
    label: string;
    value: string;
  }>;
  label: string;
  solution: string;
};

export type LandingFeature = {
  body: string;
  illustration: "collaboration" | "replay" | "analytics";
  title: string;
};

export type BlogCategory =
  | "Productivity"
  | "Collaboration"
  | "Knowledge Mgmt"
  | "Team Culture"
  | "Updates"
  | "Tutorials";

export type BlogIllustration =
  | "board"
  | "replay"
  | "folder"
  | "heart"
  | "spark"
  | "people"
  | "chart";

export type BlogPost = {
  author: string;
  category: BlogCategory;
  date: string;
  description: string;
  featured?: boolean;
  illustration: BlogIllustration;
  readTime: string;
  slug: string;
  tags: string[];
  title: string;
};

export type BlogPostDetail = {
  keyTakeaway: string;
  sections: Array<{
    body: string[];
    heading: string;
  }>;
};
