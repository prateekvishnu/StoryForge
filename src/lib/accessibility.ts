/**
 * Accessibility utilities for child-friendly interface
 * Supports ages 7-16 with various learning needs and abilities
 */

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'comic' | 'dyslexic' | 'readable';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  colorBlindSupport: boolean;
  ageGroup: '7-10' | '11-16';
}

export const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: 'medium',
  fontFamily: 'comic',
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  colorBlindSupport: false,
  ageGroup: '7-10'
};

/**
 * Apply accessibility settings to the document
 */
export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  const root = document.documentElement;
  
  // Font size adjustments
  const fontSizeMap = {
    'small': '14px',
    'medium': '16px',
    'large': '20px',
    'extra-large': '24px'
  };
  root.style.fontSize = fontSizeMap[settings.fontSize];
  
  // Font family selection
  const fontFamilyMap = {
    'comic': 'var(--font-primary)',
    'dyslexic': 'var(--font-dyslexic)',
    'readable': 'var(--font-readable)'
  };
  root.style.setProperty('--active-font', fontFamilyMap[settings.fontFamily]);
  
  // High contrast mode
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }
  
  // Color blind support
  if (settings.colorBlindSupport) {
    root.classList.add('color-blind-support');
  } else {
    root.classList.remove('color-blind-support');
  }
  
  // Age group specific adjustments
  root.classList.remove('age-7-10', 'age-11-16');
  root.classList.add(`age-${settings.ageGroup}`);
}

/**
 * Announce text to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Focus management for child-friendly navigation
 */
export class FocusManager {
  private focusableElements: string = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: Element): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableElements)) as HTMLElement[];
  }
  
  /**
   * Create a focus trap for modals and overlays
   */
  trapFocus(container: Element): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: Event) => {
      if (!(e instanceof KeyboardEvent)) return;
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
  
  /**
   * Set focus to element with announcement
   */
  setFocusWithAnnouncement(element: HTMLElement, announcement?: string): void {
    element.focus();
    if (announcement) {
      announceToScreenReader(announcement);
    }
  }
}

/**
 * Keyboard navigation helper for child-friendly interfaces
 */
export class KeyboardNavigation {
  /**
   * Handle arrow key navigation in a grid
   */
  handleGridNavigation(
    event: KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    columnsPerRow: number,
    onNavigate: (newIndex: number) => void
  ): void {
    const { key } = event;
    let newIndex = currentIndex;
    
    switch (key) {
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, totalItems - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + columnsPerRow, totalItems - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - columnsPerRow, 0);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = totalItems - 1;
        break;
      default:
        return;
    }
    
    if (newIndex !== currentIndex) {
      event.preventDefault();
      onNavigate(newIndex);
    }
  }
  
  /**
   * Handle list navigation with arrow keys
   */
  handleListNavigation(
    event: KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onNavigate: (newIndex: number) => void
  ): void {
    const { key } = event;
    let newIndex = currentIndex;
    
    switch (key) {
      case 'ArrowDown':
        newIndex = (currentIndex + 1) % totalItems;
        break;
      case 'ArrowUp':
        newIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = totalItems - 1;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    onNavigate(newIndex);
  }
}

/**
 * Age-appropriate error and success messaging
 */
export function getChildFriendlyMessage(type: 'error' | 'success' | 'info', ageGroup: '7-10' | '11-16'): {
  error: string;
  success: string;
  info: string;
} {
  const messages = {
    '7-10': {
      error: 'Oops! Something went wrong. Let\'s try again! 🤔',
      success: 'Awesome job! You did it! 🎉',
      info: 'Here\'s something cool to know! 💡'
    },
    '11-16': {
      error: 'Something didn\'t work as expected. Please try again.',
      success: 'Great work! Task completed successfully! ✓',
      info: 'Here\'s some helpful information:'
    }
  };
  
  return messages[ageGroup];
}

/**
 * Create accessible tooltips for child-friendly UI
 */
export function createAccessibleTooltip(
  trigger: HTMLElement,
  content: string,
  ageGroup: '7-10' | '11-16'
): void {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.id = tooltipId;
  tooltip.className = `tooltip tooltip-${ageGroup}`;
  tooltip.textContent = content;
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-hidden', 'true');
  
  // Set up trigger
  trigger.setAttribute('aria-describedby', tooltipId);
  
  // Event listeners
  const showTooltip = () => {
    tooltip.setAttribute('aria-hidden', 'false');
    announceToScreenReader(content, 'polite');
  };
  
  const hideTooltip = () => {
    tooltip.setAttribute('aria-hidden', 'true');
  };
  
  trigger.addEventListener('mouseenter', showTooltip);
  trigger.addEventListener('mouseleave', hideTooltip);
  trigger.addEventListener('focus', showTooltip);
  trigger.addEventListener('blur', hideTooltip);
  
  // Add to DOM
  document.body.appendChild(tooltip);
}

export const focusManager = new FocusManager();
export const keyboardNavigation = new KeyboardNavigation();