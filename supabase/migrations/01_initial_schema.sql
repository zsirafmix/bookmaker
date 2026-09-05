-- Supabase Migration: StoryForge AI Database Schema
-- Includes support for both Standard and 18+ / Adult / Horror-porn genres, Story Bible, and Long-Term Memory

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. BOOKS
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  title TEXT NOT NULL,
  subtitle TEXT,
  language VARCHAR(10) DEFAULT 'hu',
  genre TEXT NOT NULL,
  subgenre TEXT,
  tone TEXT,
  target_audience TEXT,
  pov TEXT DEFAULT 'third_person_limited',
  tense TEXT DEFAULT 'past',
  target_words INT DEFAULT 50000,
  target_chapters INT DEFAULT 20,
  status VARCHAR(30) DEFAULT 'planning', -- draft, planning, outline_ready, writing, completed, archived
  story_premise TEXT,
  theme TEXT,
  age_rating VARCHAR(20) DEFAULT 'PG-13', -- 'EVERYONE', 'TEEN', '18_PLUS'
  heat_level VARCHAR(30) DEFAULT 'none',  -- 'none', 'mild', 'steamy', 'explicit', 'hardcore'
  content_warnings TEXT[] DEFAULT '{}',
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHARACTERS
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'supporting', -- 'protagonist', 'antagonist', 'supporting', 'minor'
  age INT,
  gender TEXT,
  appearance TEXT,
  personality TEXT,
  occupation TEXT,
  motivation TEXT,
  goal TEXT,
  fear TEXT,
  weakness TEXT,
  strength TEXT,
  background TEXT,
  relationships JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  is_protagonist BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  geography TEXT,
  culture TEXT,
  history TEXT,
  atmosphere TEXT,
  rules TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STORY BIBLE (Source of Truth)
CREATE TABLE IF NOT EXISTS story_bible (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE UNIQUE,
  world_rules JSONB DEFAULT '[]'::jsonb,
  character_rules JSONB DEFAULT '[]'::jsonb,
  timeline JSONB DEFAULT '[]'::jsonb,
  relationships JSONB DEFAULT '[]'::jsonb,
  themes JSONB DEFAULT '[]'::jsonb,
  important_objects JSONB DEFAULT '[]'::jsonb,
  open_mysteries JSONB DEFAULT '[]'::jsonb,
  plot_threads JSONB DEFAULT '[]'::jsonb,
  forbidden_contradictions JSONB DEFAULT '[]'::jsonb,
  content_boundaries JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CHAPTERS
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'planned', -- 'planned', 'queued', 'generating', 'generated', 'editing', 'approved'
  outline TEXT,
  chapter_goal TEXT,
  conflict TEXT,
  turning_point TEXT,
  ending_hook TEXT,
  target_words INT DEFAULT 3000,
  content TEXT DEFAULT '',
  summary TEXT,
  word_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CHAPTER VERSIONS
CREATE TABLE IF NOT EXISTS chapter_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  content TEXT NOT NULL,
  created_by VARCHAR(50) DEFAULT 'ai', -- 'ai', 'user', 'ai_rewrite'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEMORIES (RAG / Semantic Memory)
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- 'event', 'reveal', 'relationship_change', 'character_trait'
  content TEXT NOT NULL,
  importance INT DEFAULT 1,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PLOT THREADS
CREATE TABLE IF NOT EXISTS plot_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status VARCHAR(30) DEFAULT 'OPEN', -- 'OPEN', 'RESOLVED', 'ABANDONED'
  introduced_chapter INT,
  resolved_chapter INT,
  importance VARCHAR(20) DEFAULT 'HIGH'
);

-- 9. GENERATION JOBS
CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(30) DEFAULT 'queued', -- 'queued', 'running', 'cancel_requested', 'cancelled', 'completed', 'failed'
  model VARCHAR(100),
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);
