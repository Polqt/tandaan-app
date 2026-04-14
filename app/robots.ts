import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tandaan.app";

  return {
    host: siteUrl,
    rules: {
      allow: ["/", "/blog", "/docs", "/pricing"],
      disallow: ["/api/", "/documents/", "/billing/", "/sign-in", "/sign-up"],
      userAgent: "*",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
