'use client';

import Link from 'next/link';
// import ThemeToggle from '@/components/ui/ThemeToggle';

interface FooterProps {
  ageGroup?: '7-10' | '11-16';
}

export default function Footer({ ageGroup = '7-10' }: FooterProps) {
  return (
    <footer className={`bg-color-background-secondary border-t-4 border-color-primary mt-auto age-${ageGroup}`}>
      <div className="container-child py-8">
        <div className="grid-child">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-color-primary to-color-fun rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl" role="img" aria-label="Story book">📚</span>
              </div>
              <span className={`font-bold ${ageGroup === '7-10' ? 'text-xl' : 'text-lg'} text-color-primary`}>
                StoryForge
              </span>
            </div>
            <p className={`text-color-foreground-secondary ${ageGroup === '7-10' ? 'text-lg' : 'text-base'} max-w-md mx-auto md:mx-0 leading-relaxed`}>
              {ageGroup === '7-10' 
                ? 'Create amazing stories with your imagination! 🌟'
                : 'AI-powered interactive storytelling for young creators.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-bold text-color-primary mb-4 ${ageGroup === '7-10' ? 'text-lg' : 'text-base'}`}>
              {ageGroup === '7-10' ? 'Fun Stuff!' : 'Quick Links'}
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/create" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Create">✨</span>
                    Create Story
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/read" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Read">📖</span>
                    Read Stories
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/characters" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Character">👤</span>
                    Characters
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/help" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Help">❓</span>
                    {ageGroup === '7-10' ? 'Need Help?' : 'Help & Support'}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Safety & Parents */}
          <div>
            <h3 className={`font-bold text-color-primary mb-4 ${ageGroup === '7-10' ? 'text-lg' : 'text-base'}`}>
              {ageGroup === '7-10' ? 'For Parents' : 'Safety & Support'}
            </h3>
            <nav aria-label="Safety navigation">
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/parent" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Parent">👨‍👩‍👧‍👦</span>
                    Parent Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/safety" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Safety">🛡️</span>
                    {ageGroup === '7-10' ? 'Stay Safe' : 'Safety Guidelines'}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Privacy">🔒</span>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/report" 
                    className="text-color-foreground-secondary hover:text-color-primary transition-colors focus-ring rounded-lg p-2 inline-flex items-center gap-2"
                  >
                    <span role="img" aria-label="Report">🚨</span>
                    {ageGroup === '7-10' ? 'Tell a Grown-up' : 'Report Content'}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Age-Appropriate Fun Section */}
          <div className="text-center">
            <h3 className={`font-bold text-color-primary mb-4 ${ageGroup === '7-10' ? 'text-lg' : 'text-base'}`}>
              {ageGroup === '7-10' ? 'Story Tips!' : 'Writing Tips'}
            </h3>
            <div className="space-y-3 text-color-foreground-secondary">
              {ageGroup === '7-10' ? (
                <>
                  <p className="flex items-center justify-center gap-2">
                    <span role="img" aria-label="Idea">💡</span>
                    Use your imagination!
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span role="img" aria-label="Friends">👥</span>
                    Ask friends for ideas!
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span role="img" aria-label="Fun">🎉</span>
                    Have fun creating!
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center justify-center gap-2">
                    <span role="img" aria-label="Write">✍️</span>
                    Practice makes perfect
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span role="img" aria-label="Read">📚</span>
                    Read to inspire writing
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span role="img" aria-label="Share">🤝</span>
                    Share and get feedback
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-color-background-accent mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-color-foreground-light text-sm text-center md:text-left">
              © 2024 StoryForge. Made with{' '}
              <span role="img" aria-label="love">💝</span>{' '}
              for young storytellers.
            </p>
            
            <div className="flex items-center gap-4">
              {/* Theme Toggle in Footer - Temporarily Disabled */}
              {/* <ThemeToggle size="sm" showLabel={false} ageGroup={ageGroup} /> */}
              
              <button
                className="text-color-foreground-light hover:text-color-primary transition-colors focus-ring rounded-lg p-2"
                aria-label="Toggle accessibility settings"
                title="Accessibility Settings"
              >
                <span role="img" aria-label="Accessibility">♿</span>
              </button>
              
              <div className="flex items-center gap-2 text-color-foreground-light text-sm">
                <span role="img" aria-label="Safe">🛡️</span>
                <span>COPPA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}