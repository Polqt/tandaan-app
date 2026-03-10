import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutShell from "@/components/layout-shell";
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
          <QueryProvider>
            <LayoutShell>{children}</LayoutShell>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
