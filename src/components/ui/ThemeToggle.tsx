'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  ageGroup?: '7-10' | '11-16';
}

export default function ThemeToggle({ 
  size = 'md', 
  showLabel = false,
  ageGroup = '7-10'
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`theme-toggle ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}`}>
        <span className="sr-only">Loading theme toggle</span>
      </div>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '🌓';
      default:
        return resolvedTheme === 'dark' ? '🌙' : '☀️';
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return ageGroup === '7-10' ? 'Light Mode' : 'Light';
      case 'dark':
        return ageGroup === '7-10' ? 'Dark Mode' : 'Dark';
      case 'system':
        return ageGroup === '7-10' ? 'Auto Mode' : 'System';
      default:
        return 'Theme';
    }
  };

  const getAriaLabel = () => {
    const current = theme === 'system' ? `System (${resolvedTheme})` : theme;
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    return `Current theme: ${current}. Click to switch to ${next} theme.`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`flex items-center gap-2 ${showLabel ? 'flex-row' : ''}`}>
      <button
        onClick={toggleTheme}
        className={`theme-toggle ${sizeClasses[size]} flex items-center justify-center transition-all duration-300`}
        aria-label={getAriaLabel()}
        title={getLabel()}
      >
        <span role="img" aria-hidden="true" className="transition-transform duration-300">
          {getIcon()}
        </span>
      </button>
      
      {showLabel && (
        <span className={`text-foreground-secondary font-medium ${
          ageGroup === '7-10' ? 'text-base' : 'text-sm'
        }`}>
          {getLabel()}
        </span>
      )}
    </div>
  );
} 