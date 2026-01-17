// User types
export interface User {
  id: string; // UUID from Supabase
  discord_id?: string; // Optional now
  discord_username?: string; // Optional now
  discord_avatar_url?: string; // Optional now
  username?: string; // New synthetic username
  display_name?: string; // Generic display name
  avatar_url?: string; // Generic avatar
  created_at: string;
}

// Flashcards
export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  icon_name: string;
  created_at: string;
  card_count?: number; // Computed field
}

export interface Flashcard {
  id: string;
  deck_id: string;
  front_content: string;
  back_content: string;
  order_index: number;
}

// Quiz types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  week_start_date: string;
  week_end_date: string;
  max_time_seconds: number; // Always 300 (5 minutes)
  is_active: boolean;
  created_at: string;
}

// Question types
export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  order_index: number;
}

// Quiz attempt types
export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  time_taken_seconds: number;
  correct_answers: number;
  total_questions: number;
  answers: Record<string, string>; // { question_id: selected_option }
  submitted_at: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  discord_username?: string;
  username?: string;
  display_name?: string;
  discord_avatar_url?: string;
  avatar_url?: string;
  score: number;
  time_taken_seconds: number;
  correct_answers: number;
}

// Enums
export type QuizStatus = 'active' | 'completed' | 'upcoming';
export type AttemptStatus = 'in_progress' | 'submitted';
export type QuestionType = 'multiple_choice';
export type RankBadge = 'gold' | 'silver' | 'bronze' | 'default' | 'mint' | 'outline';

// UI State
export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: number;
  timeRemaining: number;
}

// Past attempt with quiz info
export interface PastAttempt extends QuizAttempt {
  quiz_title: string;
  quiz_week_start: string;
}