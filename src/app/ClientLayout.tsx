'use client';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header ageGroup="7-10" />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer ageGroup="7-10" />
    </>
  );
} 