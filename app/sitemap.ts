import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tandaan.app";
  const now = new Date();

  return [
    {
      changeFrequency: "daily",
      lastModified: now,
      priority: 1,
      url: `${siteUrl}/`,
    },
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 0.8,
      url: `${siteUrl}/features`,
    },
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 0.8,
      url: `${siteUrl}/billing`,
    },
    {
      changeFrequency: "daily",
      lastModified: now,
      priority: 0.8,
      url: `${siteUrl}/blog`,
    },
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 0.8,
      url: `${siteUrl}/docs`,
    },
  ];
}
