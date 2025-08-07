'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ageGroup?: '7-10' | '11-16';
  variant?: 'default' | 'story' | 'character' | 'achievement';
  interactive?: boolean;
  selected?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export default function Card({
  ageGroup = '7-10',
  variant = 'default',
  interactive = false,
  selected = false,
  loading = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseClasses = 'card-child bg-white border-2 border-transparent transition-all duration-300';
  
  const variantClasses = {
    default: 'shadow-md',
    story: 'shadow-lg border-l-4 border-l-primary',
    character: 'shadow-lg border-l-4 border-l-fun',
    achievement: 'shadow-lg border-l-4 border-l-secondary bg-gradient-to-br from-white to-yellow-50'
  };

  const interactiveClasses = interactive 
    ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:border-primary focus:border-primary focus:shadow-xl focus:scale-105' 
    : '';

  const selectedClasses = selected 
    ? 'border-primary shadow-xl scale-105 bg-gradient-to-br from-white to-blue-50' 
    : '';

  const ageClasses = ageGroup === '7-10' 
    ? 'rounded-2xl p-6' 
    : 'rounded-xl p-5';

  const loadingClasses = loading ? 'opacity-70 pointer-events-none' : '';

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    interactiveClasses,
    selectedClasses,
    ageClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClasses}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-selected={selected}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {children}
    </div>
  );
}

// Card Header Component
interface CardHeaderProps {
  ageGroup?: '7-10' | '11-16';
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function CardHeader({ ageGroup = '7-10', icon, title, subtitle, actions }: CardHeaderProps) {
  const titleSize = ageGroup === '7-10' ? 'text-xl' : 'text-lg';
  const subtitleSize = ageGroup === '7-10' ? 'text-base' : 'text-sm';

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <div className="flex-shrink-0 text-2xl">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold text-primary ${titleSize} line-clamp-2`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-foreground-secondary ${subtitleSize} mt-1 line-clamp-1`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex-shrink-0 ml-3">
          {actions}
        </div>
      )}
    </div>
  );
}

// Card Content Component
interface CardContentProps {
  ageGroup?: '7-10' | '11-16';
  children: ReactNode;
}

export function CardContent({ ageGroup = '7-10', children }: CardContentProps) {
  const textSize = ageGroup === '7-10' ? 'text-base' : 'text-sm';
  
  return (
    <div className={`text-foreground-secondary ${textSize} leading-relaxed`}>
      {children}
    </div>
  );
}

// Card Footer Component
interface CardFooterProps {
  ageGroup?: '7-10' | '11-16';
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-background-accent flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  );
}

// Story Card Specific Component
interface StoryCardProps {
  ageGroup?: '7-10' | '11-16';
  title: string;
  description: string;
  author: string;
  readTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  image?: string;
  tags?: string[];
  onRead?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  interactive?: boolean;
}

export function StoryCard({
  ageGroup = '7-10',
  title,
  description,
  author,
  readTime,
  difficulty,
  image,
  tags = [],
  onRead,
  onFavorite,
  isFavorite = false,
  interactive = true
}: StoryCardProps) {
  const difficultyColors = {
    Easy: 'bg-secondary text-white',
    Medium: 'bg-accent text-white',
    Hard: 'bg-danger text-white'
  };

  return (
    <Card variant="story" ageGroup={ageGroup} interactive={interactive}>
      {image && (
        <div className="mb-4 rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt={`Cover for ${title}`}
            className="w-full h-32 object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <CardHeader 
        ageGroup={ageGroup}
        icon={<span role="img" aria-label="Story">📚</span>}
        title={title}
        subtitle={`by ${author}`}
        actions={
          <button
            onClick={onFavorite}
            className="p-2 rounded-lg hover:bg-background-accent transition-colors focus-ring"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="text-xl">
              {isFavorite ? '❤️' : '🤍'}
            </span>
          </button>
        }
      />
      
      <CardContent ageGroup={ageGroup}>
        <p className="line-clamp-3 mb-3">{description}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-background-accent text-primary text-xs rounded-lg font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter ageGroup={ageGroup}>
        <div className="flex items-center gap-3 text-sm text-foreground-light">
          {readTime && (
            <span className="flex items-center gap-1">
              <span role="img" aria-label="Time">⏱️</span>
              {readTime}
            </span>
          )}
          {difficulty && (
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          )}
        </div>
        
        {onRead && (
          <button
            onClick={onRead}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors focus-ring font-medium"
          >
            {ageGroup === '7-10' ? 'Read Now! 📖' : 'Read Story'}
          </button>
        )}
      </CardFooter>
    </Card>
  );
}