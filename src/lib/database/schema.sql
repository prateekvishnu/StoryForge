-- StoryForge Database Schema
-- SQLite database schema for the interactive story platform

-- Users table - stores basic user information (COPPA compliant)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    age_group TEXT NOT NULL CHECK (age_group IN ('7-10', '11-16')),
    parent_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stories table - stores story metadata
CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    age_group TEXT NOT NULL CHECK (age_group IN ('7-10', '11-16')),
    template_type TEXT DEFAULT 'custom' CHECK (template_type IN ('adventure', 'mystery', 'fantasy', 'friendship', 'learning', 'custom')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'rejected')),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Story segments - individual parts of interactive stories
CREATE TABLE IF NOT EXISTS story_segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    parent_segment_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_segment_id) REFERENCES story_segments(id) ON DELETE CASCADE
);

-- Story choices - decision points in interactive stories
CREATE TABLE IF NOT EXISTS story_choices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    segment_id INTEGER NOT NULL,
    choice_text TEXT NOT NULL,
    next_segment_id INTEGER,
    position INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (segment_id) REFERENCES story_segments(id) ON DELETE CASCADE,
    FOREIGN KEY (next_segment_id) REFERENCES story_segments(id) ON DELETE SET NULL
);

-- Characters table - reusable characters for stories
CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER,
    name TEXT NOT NULL,
    attributes TEXT, -- JSON string with character attributes
    image_url TEXT,
    is_template BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE SET NULL
);

-- Parental approvals - COPPA compliance for story publishing
CREATE TABLE IF NOT EXISTS parental_approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    parent_email TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    approval_date DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

-- Reading progress - track user progress through stories
CREATE TABLE IF NOT EXISTS reading_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    current_segment_id INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    last_read DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (current_segment_id) REFERENCES story_segments(id) ON DELETE SET NULL,
    UNIQUE(user_id, story_id)
);

-- Story ratings - simple age-appropriate rating system
CREATE TABLE IF NOT EXISTS story_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(story_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_age_group ON stories(age_group);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_story_segments_story_id ON story_segments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_segments_parent_id ON story_segments(parent_segment_id);
CREATE INDEX IF NOT EXISTS idx_story_choices_segment_id ON story_choices(segment_id);
CREATE INDEX IF NOT EXISTS idx_characters_story_id ON characters(story_id);
CREATE INDEX IF NOT EXISTS idx_characters_is_template ON characters(is_template);
CREATE INDEX IF NOT EXISTS idx_parental_approvals_story_id ON parental_approvals(story_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_story_id ON reading_progress(story_id);
CREATE INDEX IF NOT EXISTS idx_story_ratings_story_id ON story_ratings(story_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users 
    BEGIN 
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;

CREATE TRIGGER IF NOT EXISTS update_stories_timestamp 
    AFTER UPDATE ON stories 
    BEGIN 
        UPDATE stories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;

CREATE TRIGGER IF NOT EXISTS update_characters_timestamp 
    AFTER UPDATE ON characters 
    BEGIN 
        UPDATE characters SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;