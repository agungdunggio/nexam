-- supabase/migrations/00009_add_question_version.sql

ALTER TABLE public.questions
    ADD COLUMN IF NOT EXISTS version VARCHAR(16) NOT NULL DEFAULT 'v1';

CREATE INDEX IF NOT EXISTS idx_questions_version
    ON public.questions(version);

CREATE INDEX IF NOT EXISTS idx_questions_subtest_version
    ON public.questions(subtest, version);

ALTER TABLE public.test_sessions
    ADD COLUMN IF NOT EXISTS version VARCHAR(16) NOT NULL DEFAULT 'v1';
