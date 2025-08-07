/**
 * Database type definitions for StoryForge
 */

export type AgeGroup = '7-10' | '11-16';
export type StoryStatus = 'draft' | 'pending_approval' | 'published' | 'rejected';
export type TemplateType = 'adventure' | 'mystery' | 'fantasy' | 'friendship' | 'learning' | 'custom';

// User interface
export interface User {
  id?: number;
  username: string;
  age_group: AgeGroup;
  parent_email?: string;
  created_at?: string;
  updated_at?: string;
}

// Story interface
export interface Story {
  id?: number;
  title: string;
  author_id: number;
  age_group: AgeGroup;
  template_type?: TemplateType;
  status?: StoryStatus;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Story segment interface
export interface StorySegment {
  id?: number;
  story_id: number;
  content: string;
  image_url?: string;
  position?: number;
  parent_segment_id?: number;
  created_at?: string;
}

// Story choice interface
export interface StoryChoice {
  id?: number;
  segment_id: number;
  choice_text: string;
  next_segment_id?: number;
  position?: number;
  created_at?: string;
}

// Character interface
export interface Character {
  id?: number;
  story_id?: number;
  name: string;
  attributes?: string | Record<string, unknown>; // JSON string or parsed object
  image_url?: string;
  is_template?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Parental approval interface
export interface ParentalApproval {
  id?: number;
  story_id: number;
  parent_email: string;
  approved?: boolean;
  approval_date?: string;
  notes?: string;
  created_at?: string;
}

// Reading progress interface
export interface ReadingProgress {
  id?: number;
  user_id: number;
  story_id: number;
  current_segment_id?: number;
  completed?: boolean;
  last_read?: string;
  created_at?: string;
}

// Story rating interface
export interface StoryRating {
  id?: number;
  story_id: number;
  user_id: number;
  rating: number; // 1-5
  created_at?: string;
}

// Database pagination interface
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

// Database query result with pagination
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Database filter options
export interface FilterOptions {
  age_group?: AgeGroup;
  status?: StoryStatus;
  template_type?: TemplateType;
  author_id?: number;
  is_template?: boolean;
}

// Database sort options
export interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
}