export type Genre =
  | "fantasy"
  | "thriller"
  | "romance"
  | "scifi"
  | "horror"
  | "crime"
  | "adventure"
  | "historical"
  | "erotica_adult"       // Pornó / Erotika (18+)
  | "horror_erotica_adult" // Horror-pornó / Splatterpunk (18+)
  | "other";

export type AgeRating = "EVERYONE" | "TEEN" | "PG-13" | "18_PLUS";

export type HeatLevel = "none" | "mild" | "steamy" | "explicit" | "hardcore";

export type BookStatus =
  | "draft"
  | "planning"
  | "outline_ready"
  | "writing"
  | "completed"
  | "archived";

export interface Book {
  id: string;
  user_id?: string;
  title: string;
  subtitle?: string;
  language: string;
  genre: Genre;
  subgenre?: string;
  tone: string;
  target_audience: string;
  pov: "first_person" | "third_person_limited" | "third_person_omniscient";
  tense: "past" | "present";
  target_words: number;
  target_chapters: number;
  status: BookStatus;
  story_premise: string;
  theme?: string;
  age_rating: AgeRating;
  heat_level: HeatLevel;
  content_warnings: string[];
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  book_id: string;
  name: string;
  role: "protagonist" | "antagonist" | "supporting" | "minor";
  age?: number;
  gender?: string;
  appearance?: string;
  personality?: string;
  occupation?: string;
  motivation?: string;
  goal?: string;
  fear?: string;
  weakness?: string;
  strength?: string;
  background?: string;
  relationships: Array<{
    target_name: string;
    relationship_type: string;
    status: string;
  }>;
  notes?: string;
  is_protagonist: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  book_id: string;
  name: string;
  type?: string;
  description?: string;
  geography?: string;
  culture?: string;
  history?: string;
  atmosphere?: string;
  rules?: string;
  notes?: string;
}

export interface StoryBible {
  id: string;
  book_id: string;
  world_rules: string[];
  character_rules: string[];
  timeline: Array<{
    chapter_num?: number;
    timeframe: string;
    event: string;
  }>;
  relationships: Array<{
    char_a: string;
    char_b: string;
    dynamic: string;
  }>;
  themes: string[];
  important_objects: Array<{
    name: string;
    significance: string;
  }>;
  open_mysteries: Array<{
    mystery: string;
    status: "unrevealed" | "hinted" | "revealed";
  }>;
  plot_threads: Array<{
    id: string;
    name: string;
    status: "OPEN" | "RESOLVED";
  }>;
  forbidden_contradictions: string[];
  content_boundaries?: {
    kinks_included?: string[];
    hard_limits?: string[];
    tone?: string;
  };
  updated_at: string;
}

export type ChapterStatus =
  | "planned"
  | "queued"
  | "writing"
  | "generating"
  | "generated"
  | "editing"
  | "approved";

export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  status: ChapterStatus;
  outline?: string;
  chapter_goal?: string;
  conflict?: string;
  turning_point?: string;
  ending_hook?: string;
  target_words: number;
  content: string;
  summary?: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChapterVersion {
  id: string;
  chapter_id: string;
  version_number: number;
  content: string;
  created_by: "ai" | "user" | "ai_rewrite";
  created_at: string;
}

export interface Memory {
  id: string;
  book_id: string;
  chapter_id?: string;
  type: "event" | "reveal" | "relationship_change" | "character_trait";
  content: string;
  importance: number;
  created_at: string;
}

export interface GenerationJob {
  id: string;
  book_id: string;
  chapter_id?: string;
  type:
    | "CREATE_STORY_BIBLE"
    | "CREATE_CHARACTERS"
    | "CREATE_OUTLINE"
    | "CREATE_CHAPTER_PLAN"
    | "GENERATE_CHAPTER"
    | "REWRITE_CHAPTER"
    | "CHECK_CONTINUITY"
    | "SUMMARIZE_CHAPTER";
  status: "queued" | "running" | "cancel_requested" | "cancelled" | "completed" | "failed";
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
  error?: string;
  created_at: string;
  started_at?: string;
  finished_at?: string;
}
