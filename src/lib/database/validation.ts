/**
 * Data validation utilities for StoryForge
 * Ensures age-appropriate content and data integrity
 */

import { AgeGroup, User, Story, Character } from '@/types/database';

// Age group validation
export const AGE_GROUPS: AgeGroup[] = ['7-10', '11-16'];

// Content filtering keywords (basic implementation)
const INAPPROPRIATE_KEYWORDS = [
  'violence', 'scary', 'death', 'kill', 'murder', 'blood',
  'weapon', 'gun', 'knife', 'fight', 'war', 'hate',
  'stupid', 'dumb', 'ugly', 'fat', 'loser'
];

// Validation errors
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// User validation
export function validateUser(userData: Partial<User>): void {
  if (!userData.username || userData.username.trim().length < 3) {
    throw new ValidationError('Username must be at least 3 characters long', 'username');
  }

  if (userData.username.length > 20) {
    throw new ValidationError('Username must be less than 20 characters', 'username');
  }

  // Username should only contain letters, numbers, and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
    throw new ValidationError('Username can only contain letters, numbers, and underscores', 'username');
  }

  if (!userData.age_group || !AGE_GROUPS.includes(userData.age_group)) {
    throw new ValidationError('Invalid age group. Must be 7-10 or 11-16', 'age_group');
  }

  // Basic email validation for parent_email
  if (userData.parent_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.parent_email)) {
      throw new ValidationError('Invalid parent email format', 'parent_email');
    }
  }
}

// Story validation
export function validateStory(storyData: Partial<Story>): void {
  if (!storyData.title || storyData.title.trim().length < 3) {
    throw new ValidationError('Story title must be at least 3 characters long', 'title');
  }

  if (storyData.title.length > 100) {
    throw new ValidationError('Story title must be less than 100 characters', 'title');
  }

  if (!storyData.age_group || !AGE_GROUPS.includes(storyData.age_group)) {
    throw new ValidationError('Invalid age group for story', 'age_group');
  }

  // Check for inappropriate content in title
  if (containsInappropriateContent(storyData.title)) {
    throw new ValidationError('Story title contains inappropriate content', 'title');
  }

  // Validate template type
  const validTemplates = ['adventure', 'mystery', 'fantasy', 'friendship', 'learning', 'custom'];
  if (storyData.template_type && !validTemplates.includes(storyData.template_type)) {
    throw new ValidationError('Invalid template type', 'template_type');
  }

  // Validate status
  const validStatuses = ['draft', 'pending_approval', 'published', 'rejected'];
  if (storyData.status && !validStatuses.includes(storyData.status)) {
    throw new ValidationError('Invalid story status', 'status');
  }
}

// Character validation
export function validateCharacter(characterData: Partial<Character>): void {
  if (!characterData.name || characterData.name.trim().length < 2) {
    throw new ValidationError('Character name must be at least 2 characters long', 'name');
  }

  if (characterData.name.length > 50) {
    throw new ValidationError('Character name must be less than 50 characters', 'name');
  }

  // Check for inappropriate content in character name
  if (containsInappropriateContent(characterData.name)) {
    throw new ValidationError('Character name contains inappropriate content', 'name');
  }

  // Validate attributes if provided
  if (characterData.attributes) {
    try {
      const attributes = typeof characterData.attributes === 'string' 
        ? JSON.parse(characterData.attributes) 
        : characterData.attributes;
      
      validateCharacterAttributes(attributes);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Invalid character attributes format', 'attributes');
    }
  }
}

// Character attributes validation
function validateCharacterAttributes(attributes: unknown): void {
  if (typeof attributes !== 'object' || attributes === null) {
    throw new ValidationError('Character attributes must be an object', 'attributes');
  }

  // Check for inappropriate content in attribute values
  const checkValue = (value: unknown, path: string) => {
    if (typeof value === 'string' && containsInappropriateContent(value)) {
      throw new ValidationError(`Inappropriate content in character ${path}`, 'attributes');
    }
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([key, val]) => {
        checkValue(val, `${path}.${key}`);
      });
    }
  };

  Object.entries(attributes).forEach(([key, value]) => {
    checkValue(value, key);
  });
}

// Content filtering
export function containsInappropriateContent(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  return INAPPROPRIATE_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Age-appropriate content validation
export function validateContentForAge(content: string, ageGroup: AgeGroup): void {
  if (containsInappropriateContent(content)) {
    throw new ValidationError(`Content not appropriate for age group ${ageGroup}`, 'content');
  }

  // Additional age-specific validations
  if (ageGroup === '7-10') {
    // Stricter validation for younger children
    const complexWords = ['sophisticated', 'complicated', 'extraordinary', 'magnificent'];
    const lowerContent = content.toLowerCase();
    
    if (complexWords.some(word => lowerContent.includes(word))) {
      // This is just a warning, not an error - content might still be appropriate
      console.warn(`Content may be too complex for age group ${ageGroup}`);
    }
  }
}

// Sanitization utilities
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
}

export function sanitizeUsername(username: string): string {
  if (!username) return '';
  
  return username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, ''); // Keep only letters, numbers, underscores
}

// Validation middleware for API endpoints
export function validateAndSanitizeUser(userData: Record<string, unknown>): User {
  const sanitized = {
    ...userData,
    username: sanitizeUsername(userData.username as string),
    parent_email: (userData.parent_email as string)?.trim().toLowerCase(),
  };
  
  validateUser(sanitized);
  return sanitized as User;
}

export function validateAndSanitizeStory(storyData: Record<string, unknown>): Story {
  const sanitized = {
    ...storyData,
    title: sanitizeText(storyData.title as string),
  };
  
  validateStory(sanitized);
  return sanitized as Story;
}

export function validateAndSanitizeCharacter(characterData: Record<string, unknown>): Character {
  const sanitized = {
    ...characterData,
    name: sanitizeText(characterData.name as string),
  };
  
  validateCharacter(sanitized);
  return sanitized as Character;
}

// Batch validation utilities
export function validateBatch<T>(
  items: T[],
  validator: (item: T) => void
): { valid: T[]; errors: Array<{ item: T; error: ValidationError }> } {
  const valid: T[] = [];
  const errors: Array<{ item: T; error: ValidationError }> = [];
  
  items.forEach(item => {
    try {
      validator(item);
      valid.push(item);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push({ item, error });
      } else {
        errors.push({ item, error: new ValidationError('Unknown validation error') });
      }
    }
  });
  
  return { valid, errors };
}