import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutShell from "@/components/layout-shell";
import WebVitalsReporter from "@/components/analytics/web-vitals-reporter";
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
  description: "A simple note-taking AI app.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    description: "A simple note-taking AI app.",
    images: ["/og-image.png"],
    title: "Tandaan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    description: "A simple note-taking AI app.",
    images: ["/og-image.png"],
    title: "Tandaan",
  },
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
                <LayoutShell>{children}</LayoutShell>
              </QueryProvider>
            </AppPostHogProvider>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
