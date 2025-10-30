import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

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
        <body className="antialiased">
          <Header />
          <div className="flex min-h-screen">
            <Sidebar />
          </div>
          <div className="flex-1 p-4 bg-slate-100 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
