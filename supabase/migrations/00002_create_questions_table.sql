-- supabase/migrations/00002_create_questions_table.sql

DO $$ BEGIN
    CREATE TYPE test_type AS ENUM ('utbk', 'tpa');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('multiple_choice', 'short_answer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_type test_type NOT NULL,
    subtest VARCHAR(50) NOT NULL,
    question_type question_type NOT NULL DEFAULT 'multiple_choice',

    content_id TEXT NOT NULL,
    content_en TEXT,

    options_id JSONB,
    options_en JSONB,

    correct_answer VARCHAR(50) NOT NULL,

    explanation_id TEXT,
    explanation_en TEXT,

    difficulty difficulty_level DEFAULT 'medium',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_test_type ON public.questions(test_type);
CREATE INDEX IF NOT EXISTS idx_questions_subtest ON public.questions(subtest);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions are readable by all" ON public.questions;
CREATE POLICY "Questions are readable by all"
    ON public.questions FOR SELECT
    USING (true);
