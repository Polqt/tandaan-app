export type PublicNavItem = {
  href: string;
  label: string;
  shortLabel?: string;
};

export type LandingFeature = {
  body: string;
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
