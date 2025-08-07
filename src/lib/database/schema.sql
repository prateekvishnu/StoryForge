-- StoryForge Database Schema
-- SQLite database schema for the interactive story platform
-- COPPA compliant design for children ages 7-16

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Users table - stores basic user information (COPPA compliant)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    age_group TEXT NOT NULL CHECK (age_group IN ('7-10', '11-13', '14-16')),
    parent_email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Stories table - main story content
CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    author_id INTEGER NOT NULL,
    age_group TEXT NOT NULL CHECK (age_group IN ('7-10', '11-13', '14-16')),
    template_type TEXT DEFAULT 'custom' CHECK (template_type IN ('adventure', 'mystery', 'fantasy', 'friendship', 'learning', 'custom')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'rejected')),
    content TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Story segments - individual parts of interactive stories
CREATE TABLE IF NOT EXISTS story_segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    parent_segment_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    name TEXT NOT NULL,
    description TEXT,
    story_id INTEGER,
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
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

-- Reading progress - track user progress through stories
CREATE TABLE IF NOT EXISTS reading_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    current_segment_id INTEGER,
    progress_percentage REAL DEFAULT 0.0,
    last_read DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(story_id, user_id)
);

-- Safety audit log - track all content for safety compliance
CREATE TABLE IF NOT EXISTS safety_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content_type TEXT NOT NULL CHECK (content_type IN ('story', 'segment', 'choice', 'character')),
    content_id INTEGER NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'approve', 'reject')),
    content_snapshot TEXT, -- JSON snapshot of content at time of action
    safety_flags TEXT, -- JSON array of any safety concerns
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_author ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_story_segments_story ON story_segments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_choices_segment ON story_choices(segment_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_audit_content ON safety_audit_log(content_type, content_id);

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

CREATE TRIGGER IF NOT EXISTS update_story_segments_timestamp 
    AFTER UPDATE ON story_segments 
    BEGIN 
        UPDATE story_segments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END;

CREATE TRIGGER IF NOT EXISTS update_parental_approvals_timestamp 
    AFTER UPDATE ON parental_approvals 
    BEGIN 
        UPDATE parental_approvals SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
    END; 