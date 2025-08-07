'use client';

import { useState } from 'react';
import Link from 'next/link';
// import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderProps {
  ageGroup?: '7-10' | '11-16';
  userName?: string;
  onAccessibilityToggle?: () => void;
}

export default function Header({ ageGroup = '7-10', userName, onAccessibilityToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`bg-color-background shadow-lg border-b-4 border-color-primary sticky top-0 z-50 age-${ageGroup}`}>
      <div className="container-child">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-3 text-color-primary hover:text-color-fun transition-colors focus-ring rounded-lg p-1"
              aria-label="StoryForge Home"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-color-primary to-color-fun rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl md:text-2xl" role="img" aria-label="Story book">📚</span>
              </div>
              <span className={`font-bold ${ageGroup === '7-10' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'} text-color-primary`}>
                StoryForge
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-4" aria-label="Main navigation">
            <Link 
              href="/create" 
              className="touch-target bg-color-secondary text-white rounded-xl hover:bg-green-600 hover:shadow-lg transition-all focus-ring px-4 py-2"
              aria-label="Create new story"
            >
              <span className="mr-2" role="img" aria-label="Create">✨</span>
              Create Story
            </Link>
            <Link 
              href="/read" 
              className="touch-target bg-color-accent text-white rounded-xl hover:bg-orange-600 hover:shadow-lg transition-all focus-ring px-4 py-2"
              aria-label="Read stories"
            >
              <span className="mr-2" role="img" aria-label="Read">📖</span>
              Read Stories
            </Link>
            <Link 
              href="/characters" 
              className="touch-target bg-color-fun text-white rounded-xl hover:bg-purple-600 hover:shadow-lg transition-all focus-ring px-4 py-2"
              aria-label="Character builder"
            >
              <span className="mr-2" role="img" aria-label="Character">👤</span>
              Characters
            </Link>
          </nav>

          {/* User Section - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {userName && (
              <div className="flex items-center gap-2 text-color-foreground-secondary bg-color-background-secondary px-3 py-2 rounded-lg">
                <span className="text-lg" role="img" aria-label="User">👋</span>
                <span className={`font-medium ${ageGroup === '7-10' ? 'text-base' : 'text-sm'}`}>
                  Hi, {userName}!
                </span>
              </div>
            )}
            
            {/* Theme Toggle - Temporarily Disabled */}
            {/* <ThemeToggle size="md" ageGroup={ageGroup} /> */}
            
            {/* Accessibility Toggle */}
            <button
              onClick={onAccessibilityToggle}
              className="w-10 h-10 bg-color-background-secondary border-2 border-color-primary text-color-primary rounded-xl hover:bg-color-primary hover:text-color-background hover:shadow-lg transition-all focus-ring flex items-center justify-center"
              aria-label="Open accessibility settings"
              title="Accessibility Settings"
            >
              <span className="text-lg" role="img" aria-label="Accessibility">♿</span>
            </button>

            {/* Parent Dashboard Link */}
            <Link 
              href="/parent" 
              className="touch-target bg-color-warning text-white rounded-xl hover:bg-orange-600 hover:shadow-lg transition-all focus-ring px-4 py-2"
              aria-label="Parent dashboard"
            >
              <span className="mr-2" role="img" aria-label="Parent">👨‍👩‍👧‍👦</span>
              {ageGroup === '7-10' ? 'Parents' : 'Parent Dashboard'}
            </Link>
          </div>

          {/* Mobile/Tablet Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme Toggle - Mobile - Temporarily Disabled */}
            {/* <ThemeToggle size="sm" ageGroup={ageGroup} /> */}
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="w-10 h-10 bg-color-primary text-white rounded-xl focus-ring flex items-center justify-center hover:bg-blue-600 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="text-lg transition-transform duration-200" role="img" aria-label="Menu">
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="lg:hidden mt-4 pb-4 border-t-2 border-color-background-accent animate-in slide-in-from-top duration-200"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-3 pt-4">
              {/* User Greeting - Mobile */}
              {userName && (
                <div className="text-center py-3 bg-color-background-secondary rounded-lg text-color-foreground-secondary">
                  <span className="text-lg" role="img" aria-label="User">👋</span>
                  <span className="ml-2 font-medium">Hi, {userName}!</span>
                </div>
              )}

              {/* Navigation Links */}
              <Link 
                href="/create" 
                className="touch-target bg-color-secondary text-white rounded-xl hover:bg-green-600 transition-all focus-ring text-center py-3 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Create">✨</span>
                Create Story
              </Link>
              <Link 
                href="/read" 
                className="touch-target bg-color-accent text-white rounded-xl hover:bg-orange-600 transition-all focus-ring text-center py-3 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Read">📖</span>
                Read Stories
              </Link>
              <Link 
                href="/characters" 
                className="touch-target bg-color-fun text-white rounded-xl hover:bg-purple-600 transition-all focus-ring text-center py-3 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Character">👤</span>
                Characters
              </Link>
              <Link 
                href="/parent" 
                className="touch-target bg-color-warning text-white rounded-xl hover:bg-orange-600 transition-all focus-ring text-center py-3 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Parent">👨‍👩‍👧‍👦</span>
                Parent Dashboard
              </Link>
              
              {/* Accessibility Button - Mobile */}
              <button
                onClick={() => {
                  onAccessibilityToggle?.();
                  setIsMenuOpen(false);
                }}
                className="touch-target bg-color-background-secondary border-2 border-color-primary text-color-primary rounded-xl hover:bg-color-primary hover:text-color-background transition-all focus-ring text-center py-3"
                aria-label="Open accessibility settings"
              >
                <span className="mr-2" role="img" aria-label="Accessibility">♿</span>
                Accessibility Settings
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Skip Link for Accessibility */}
      <Link href="#main-content" className="skip-link">
        Skip to main content
      </Link>
    </header>
  );
}