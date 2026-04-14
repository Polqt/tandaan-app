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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https: wss:; frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com; worker-src 'self' blob:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
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

  // Transpile BlockNote and its yjs-dependent packages so both webpack and
  // Turbopack can resolve them on Windows without absolute-path aliases.
  transpilePackages: [
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/shadcn",
    "@blocknote/ariakit",
    "@liveblocks/react-blocknote",
  ],

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
