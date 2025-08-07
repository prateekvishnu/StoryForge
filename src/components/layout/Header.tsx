'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <header className={`nav-child bg-white shadow-lg border-b-4 border-primary age-${ageGroup}`}>
      <div className="container-child">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-primary hover:text-fun transition-colors focus-ring"
              aria-label="StoryForge Home"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-fun rounded-xl flex items-center justify-center">
                <span className="text-2xl" role="img" aria-label="Story book">📚</span>
              </div>
              <span className={`font-bold ${ageGroup === '7-10' ? 'text-2xl' : 'text-xl'} text-primary`}>
                StoryForge
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link 
              href="/create" 
              className="touch-target bg-secondary text-white rounded-xl hover:bg-primary transition-all focus-ring"
              aria-label="Create new story"
            >
              <span className="mr-2" role="img" aria-label="Create">✨</span>
              Create Story
            </Link>
            <Link 
              href="/read" 
              className="touch-target bg-accent text-white rounded-xl hover:bg-primary transition-all focus-ring"
              aria-label="Read stories"
            >
              <span className="mr-2" role="img" aria-label="Read">📖</span>
              Read Stories
            </Link>
            <Link 
              href="/characters" 
              className="touch-target bg-fun text-white rounded-xl hover:bg-primary transition-all focus-ring"
              aria-label="Character builder"
            >
              <span className="mr-2" role="img" aria-label="Character">👤</span>
              Characters
            </Link>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {userName && (
              <div className="flex items-center gap-2 text-foreground-secondary">
                <span className="text-lg" role="img" aria-label="User">👋</span>
                <span className={`font-medium ${ageGroup === '7-10' ? 'text-lg' : 'text-base'}`}>
                  Hi, {userName}!
                </span>
              </div>
            )}
            
            {/* Accessibility Toggle */}
            <button
              onClick={onAccessibilityToggle}
              className="touch-target bg-background-secondary border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all focus-ring"
              aria-label="Open accessibility settings"
              title="Accessibility Settings"
            >
              <span className="text-lg" role="img" aria-label="Accessibility">♿</span>
            </button>

            {/* Parent Dashboard Link */}
            <Link 
              href="/parent" 
              className="touch-target bg-warning text-white rounded-xl hover:bg-primary transition-all focus-ring"
              aria-label="Parent dashboard"
            >
              <span className="mr-2" role="img" aria-label="Parent">👨‍👩‍👧‍👦</span>
              {ageGroup === '7-10' ? 'Parents' : 'Parent Dashboard'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden touch-target bg-primary text-white rounded-xl focus-ring"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-xl" role="img" aria-label="Menu">
              {isMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden mt-4 py-4 border-t-2 border-background-accent"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-3">
              <Link 
                href="/create" 
                className="touch-target bg-secondary text-white rounded-xl hover:bg-primary transition-all focus-ring text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Create">✨</span>
                Create Story
              </Link>
              <Link 
                href="/read" 
                className="touch-target bg-accent text-white rounded-xl hover:bg-primary transition-all focus-ring text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Read">📖</span>
                Read Stories
              </Link>
              <Link 
                href="/characters" 
                className="touch-target bg-fun text-white rounded-xl hover:bg-primary transition-all focus-ring text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Character">👤</span>
                Characters
              </Link>
              <Link 
                href="/parent" 
                className="touch-target bg-warning text-white rounded-xl hover:bg-primary transition-all focus-ring text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2" role="img" aria-label="Parent">👨‍👩‍👧‍👦</span>
                Parent Dashboard
              </Link>
              
              {userName && (
                <div className="text-center py-2 text-foreground-secondary">
                  <span className="text-lg" role="img" aria-label="User">👋</span>
                  <span className="ml-2 font-medium">Hi, {userName}!</span>
                </div>
              )}
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