export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          locale: 'id' | 'en';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          locale?: 'id' | 'en';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          locale?: 'id' | 'en';
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          test_type: 'utbk' | 'tpa';
          subtest: string;
          question_type: 'multiple_choice' | 'short_answer';
          content_id: string;
          content_en: string | null;
          options_id: Json | null;
          options_en: Json | null;
          correct_answer: string;
          explanation_id: string | null;
          explanation_en: string | null;
          difficulty: 'easy' | 'medium' | 'hard';
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          test_type: 'utbk' | 'tpa';
          subtest: string;
          question_type?: 'multiple_choice' | 'short_answer';
          content_id: string;
          content_en?: string | null;
          options_id?: Json | null;
          options_en?: Json | null;
          correct_answer: string;
          explanation_id?: string | null;
          explanation_en?: string | null;
          difficulty?: 'easy' | 'medium' | 'hard';
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          test_type?: 'utbk' | 'tpa';
          subtest?: string;
          question_type?: 'multiple_choice' | 'short_answer';
          content_id?: string;
          content_en?: string | null;
          options_id?: Json | null;
          options_en?: Json | null;
          correct_answer?: string;
          explanation_id?: string | null;
          explanation_en?: string | null;
          difficulty?: 'easy' | 'medium' | 'hard';
          image_url?: string | null;
          created_at?: string;
        };
      };
      test_sessions: {
        Row: {
          id: string;
          user_id: string;
          test_type: 'utbk' | 'tpa';
          subtest: string;
          status: 'in_progress' | 'completed' | 'timed_out';
          started_at: string;
          finished_at: string | null;
          time_limit_sec: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_type: 'utbk' | 'tpa';
          subtest: string;
          status?: 'in_progress' | 'completed' | 'timed_out';
          started_at?: string;
          finished_at?: string | null;
          time_limit_sec: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_type?: 'utbk' | 'tpa';
          subtest?: string;
          status?: 'in_progress' | 'completed' | 'timed_out';
          started_at?: string;
          finished_at?: string | null;
          time_limit_sec?: number;
          created_at?: string;
        };
      };
      answers: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          user_answer: string | null;
          is_correct: boolean;
          answered_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          user_answer?: string | null;
          is_correct: boolean;
          answered_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_id?: string;
          user_answer?: string | null;
          is_correct?: boolean;
          answered_at?: string;
        };
      };
      results: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          test_type: 'utbk' | 'tpa';
          subtest: string;
          total_questions: number;
          correct_count: number;
          wrong_count: number;
          unanswered_count: number;
          score: number;
          percentile: number;
          time_spent_sec: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          test_type: 'utbk' | 'tpa';
          subtest: string;
          total_questions: number;
          correct_count: number;
          wrong_count: number;
          unanswered_count: number;
          score: number;
          percentile?: number;
          time_spent_sec: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          test_type?: 'utbk' | 'tpa';
          subtest?: string;
          total_questions?: number;
          correct_count?: number;
          wrong_count?: number;
          unanswered_count?: number;
          score?: number;
          percentile?: number;
          time_spent_sec?: number;
          created_at?: string;
        };
      };
    };
  };
}
