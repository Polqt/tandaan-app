import { withSentryConfig } from "@sentry/nextjs";
import { createRequire } from "node:module";
import type { NextConfig } from "next";
import nextra from "nextra";

const require = createRequire(import.meta.url);
const yjsPath = require.resolve("yjs");

const withNextra = nextra({
  defaultShowCopyCode: true,
  readingTime: true,
  search: { codeblocks: false },
});

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake heavy editor packages at compile time
    optimizePackageImports: [
      "@blocknote/react",
      "@blocknote/shadcn",
      "@blocknote/core",
      "@liveblocks/react",
      "@liveblocks/react-ui",
      "lucide-react",
      "framer-motion",
    ],
  },

  // Webpack alias for yjs deduplication (needed by BlockNote + Liveblocks)
  // Turbopack handles this natively — no alias needed there
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      yjs: yjsPath,
    };
    return config;
  },
};

const nextraConfig = withNextra(nextConfig);

export default withSentryConfig(nextraConfig, {
  org: "usls-40",
  project: "tandaan",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: process.env.NODE_ENV === "production" ? "/monitoring" : undefined,
  disableLogger: true,
  automaticVercelMonitors: true,
});
