import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: "--font-comic-neue",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "StoryForge - Interactive Adventure Creator",
  description: "AI-powered interactive storytelling platform for children ages 7-16. Create, share, and experience amazing choose-your-own-adventure stories with child-safe AI assistance.",
  keywords: "children stories, interactive fiction, AI storytelling, kids creativity, safe AI, COPPA compliant",
  authors: [{ name: "StoryForge Team" }],

  robots: "index, follow",
  openGraph: {
    title: "StoryForge - Interactive Adventure Creator",
    description: "AI-powered storytelling platform for young creators",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryForge - Interactive Adventure Creator",
    description: "AI-powered storytelling platform for young creators",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="age-7-10">
      <body className={`${comicNeue.variable} min-h-screen flex flex-col bg-background text-foreground`}>
        <Header ageGroup="7-10" />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer ageGroup="7-10" />
      </body>
    </html>
  );
}
