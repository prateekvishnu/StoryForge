import type { Metadata, Viewport } from "next";
import { Comic_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/contexts/ThemeContext";
import ClientLayout from "./ClientLayout";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "StoryForge - Interactive Adventure Creator",
  description: "AI-powered storytelling platform for young creators ages 7-16",
  keywords: ["storytelling", "children", "AI", "interactive", "adventure", "creativity"],
  authors: [{ name: "StoryForge Team" }],
  creator: "StoryForge",
  publisher: "StoryForge",
  openGraph: {
    title: "StoryForge - Interactive Adventure Creator",
    description: "AI-powered storytelling platform for young creators",
    url: "https://storyforge.app",
    siteName: "StoryForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryForge - Interactive Adventure Creator",
    description: "AI-powered storytelling platform for young creators",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="age-7-10" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${comicNeue.variable} min-h-screen flex flex-col bg-color-background text-color-foreground`}>
        <ThemeProvider defaultTheme="system">
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}