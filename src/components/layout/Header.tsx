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
    <header className="bg-color-background/95 backdrop-blur-sm border-b border-color-background-accent sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          
          {/* Logo Section - Left Aligned */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center gap-3 text-color-primary hover:text-color-fun transition-colors duration-200 focus-ring rounded-lg p-2 -ml-2"
              aria-label="StoryForge Home"
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-color-primary to-color-fun rounded-xl flex items-center justify-center shadow-md">
                <span className="text-lg lg:text-xl" role="img" aria-label="Story book">📚</span>
              </div>
              <span className="font-bold text-lg lg:text-xl text-color-primary tracking-tight">
                StoryForge
              </span>
            </Link>
          </div>

          {/* Main Navigation - Center */}
          <nav className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-8" aria-label="Main navigation">
            <div className="flex items-center gap-2">
              <Link 
                href="/create" 
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-color-secondary text-white rounded-lg hover:bg-green-600 hover:shadow-md transition-all duration-200 focus-ring font-medium text-sm"
                aria-label="Create new story"
              >
                <span className="text-base" role="img" aria-label="Create">✨</span>
                Create
              </Link>
              <Link 
                href="/read" 
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-color-accent text-white rounded-lg hover:bg-orange-600 hover:shadow-md transition-all duration-200 focus-ring font-medium text-sm"
                aria-label="Read stories"
              >
                <span className="text-base" role="img" aria-label="Read">📖</span>
                Read
              </Link>
              <Link 
                href="/characters" 
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-color-fun text-white rounded-lg hover:bg-purple-600 hover:shadow-md transition-all duration-200 focus-ring font-medium text-sm"
                aria-label="Character builder"
              >
                <span className="text-base" role="img" aria-label="Character">👤</span>
                Characters
              </Link>
            </div>
          </nav>

          {/* User Actions - Right Aligned */}
          <div className="flex items-center gap-3">
            
            {/* User Greeting - Desktop Only */}
            {userName && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-color-background-secondary rounded-lg text-color-foreground-secondary">
                <span className="text-sm" role="img" aria-label="User">👋</span>
                <span className="font-medium text-sm">Hi, {userName}!</span>
              </div>
            )}
            
            {/* Action Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onAccessibilityToggle}
                className="w-9 h-9 bg-color-background-secondary border border-color-background-accent text-color-primary rounded-lg hover:bg-color-primary hover:text-white hover:border-color-primary transition-all duration-200 focus-ring flex items-center justify-center"
                aria-label="Open accessibility settings"
                title="Accessibility Settings"
              >
                <span className="text-sm" role="img" aria-label="Accessibility">♿</span>
              </button>
              
              <Link 
                href="/parent" 
                className="inline-flex items-center gap-2 px-3 py-2 bg-color-warning text-white rounded-lg hover:bg-orange-600 hover:shadow-md transition-all duration-200 focus-ring font-medium text-sm"
                aria-label="Parent dashboard"
              >
                <span className="text-sm" role="img" aria-label="Parent">👨‍👩‍👧‍👦</span>
                Parents
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden w-9 h-9 bg-color-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus-ring flex items-center justify-center"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="text-base transition-transform duration-200" role="img" aria-label="Menu">
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-label="Mobile navigation"
        >
          <div className="py-4 border-t border-color-background-accent">
            
            {/* User Greeting - Mobile */}
            {userName && (
              <div className="flex items-center justify-center gap-2 py-3 mb-4 bg-color-background-secondary rounded-lg mx-2 text-color-foreground-secondary">
                <span className="text-base" role="img" aria-label="User">👋</span>
                <span className="font-medium">Hi, {userName}!</span>
              </div>
            )}

            {/* Navigation Links - Mobile */}
            <div className="grid grid-cols-1 gap-2 px-2">
              <Link 
                href="/create" 
                className="flex items-center justify-center gap-3 py-3 bg-color-secondary text-white rounded-lg hover:bg-green-600 transition-all duration-200 focus-ring font-medium shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg" role="img" aria-label="Create">✨</span>
                Create Story
              </Link>
              <Link 
                href="/read" 
                className="flex items-center justify-center gap-3 py-3 bg-color-accent text-white rounded-lg hover:bg-orange-600 transition-all duration-200 focus-ring font-medium shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg" role="img" aria-label="Read">📖</span>
                Read Stories
              </Link>
              <Link 
                href="/characters" 
                className="flex items-center justify-center gap-3 py-3 bg-color-fun text-white rounded-lg hover:bg-purple-600 transition-all duration-200 focus-ring font-medium shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg" role="img" aria-label="Character">👤</span>
                Characters
              </Link>
              <Link 
                href="/parent" 
                className="flex items-center justify-center gap-3 py-3 bg-color-warning text-white rounded-lg hover:bg-orange-600 transition-all duration-200 focus-ring font-medium shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg" role="img" aria-label="Parent">👨‍👩‍👧‍👦</span>
                Parent Dashboard
              </Link>
              
              {/* Accessibility Button - Mobile */}
              <button
                onClick={() => {
                  onAccessibilityToggle?.();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-3 py-3 bg-color-background-secondary border border-color-background-accent text-color-primary rounded-lg hover:bg-color-primary hover:text-white hover:border-color-primary transition-all duration-200 focus-ring font-medium"
                aria-label="Open accessibility settings"
              >
                <span className="text-lg" role="img" aria-label="Accessibility">♿</span>
                Accessibility Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Link for Accessibility */}
      <Link href="#main-content" className="skip-link">
        Skip to main content
      </Link>
    </header>
  );
}