import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import PostHogUserIdentity from "@/components/analytics/posthog-user-identity";
import WebVitalsReporter from "@/components/analytics/web-vitals-reporter";
import AppToaster from "@/components/shell/app-toaster";
import AppPostHogProvider from "@/providers/PostHogProvider";
import QueryProvider from "@/providers/QueryProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Tandaan",
  description:
    "Collaborative documents with replay, comments, and a calm sketchbook interface for teams.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${manrope.variable} ${sora.variable} bg-background font-sans antialiased`}
        >
          <Suspense fallback={null}>
            <AppPostHogProvider>
              <WebVitalsReporter />
              <QueryProvider>
                <PostHogUserIdentity />
                {children}
                <AppToaster />
              </QueryProvider>
            </AppPostHogProvider>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
