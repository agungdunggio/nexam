-- supabase/migrations/00001_create_users_table.sql

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    locale VARCHAR(5) DEFAULT 'id' CHECK (locale IN ('id', 'en')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index untuk login lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Trigger auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data"
    ON public.users FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data"
    ON public.users FOR UPDATE
    USING (true);
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
-- supabase/migrations/00003_create_test_sessions_table.sql

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'timed_out', 'abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.test_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    test_type test_type NOT NULL,
    subtest VARCHAR(50) NOT NULL,
    status session_status DEFAULT 'in_progress' NOT NULL,

    question_ids JSONB NOT NULL DEFAULT '[]',

    time_limit_sec INTEGER NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    finished_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_test_sessions_user ON public.test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON public.test_sessions(status);

ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sessions readable by all" ON public.test_sessions;
CREATE POLICY "Sessions readable by all"
    ON public.test_sessions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Sessions insertable" ON public.test_sessions;
CREATE POLICY "Sessions insertable"
    ON public.test_sessions FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Sessions updatable" ON public.test_sessions;
CREATE POLICY "Sessions updatable"
    ON public.test_sessions FOR UPDATE
    USING (true);
-- supabase/migrations/00004_create_answers_table.sql

CREATE TABLE IF NOT EXISTS public.answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_answer VARCHAR(50),
    is_correct BOOLEAN,
    answered_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_session ON public.answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON public.answers(question_id);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Answers readable by all" ON public.answers;
CREATE POLICY "Answers readable by all"
    ON public.answers FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Answers insertable" ON public.answers;
CREATE POLICY "Answers insertable"
    ON public.answers FOR INSERT
    WITH CHECK (true);
-- supabase/migrations/00005_create_results_table.sql

CREATE TABLE IF NOT EXISTS public.results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE UNIQUE,
    test_type test_type NOT NULL,
    subtest VARCHAR(50) NOT NULL,

    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0,
    wrong_count INTEGER NOT NULL DEFAULT 0,
    unanswered_count INTEGER NOT NULL DEFAULT 0,
    score DECIMAL(6,2) NOT NULL DEFAULT 0,
    percentile DECIMAL(5,2),
    time_spent_sec INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_results_user ON public.results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_test_type ON public.results(test_type);
CREATE INDEX IF NOT EXISTS idx_results_score ON public.results(score DESC);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Results are readable by all" ON public.results;
CREATE POLICY "Results are readable by all"
    ON public.results FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Results insertable" ON public.results;
CREATE POLICY "Results insertable"
    ON public.results FOR INSERT
    WITH CHECK (true);
-- supabase/migrations/00006_create_views.sql

CREATE OR REPLACE VIEW public.user_stats AS
SELECT
    r.user_id,
    r.test_type,
    r.subtest,
    COUNT(*) as total_attempts,
    AVG(r.score) as avg_score,
    MAX(r.score) as best_score,
    MIN(r.score) as worst_score,
    AVG(r.time_spent_sec) as avg_time_spent,
    AVG(r.correct_count::decimal / NULLIF(r.total_questions, 0) * 100) as avg_accuracy
FROM public.results r
GROUP BY r.user_id, r.test_type, r.subtest;

CREATE OR REPLACE VIEW public.score_distribution AS
SELECT
    test_type,
    subtest,
    COUNT(*) as total_attempts,
    AVG(score) as avg_score,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY score) as p25,
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY score) as median,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY score) as p75,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY score) as p90
FROM public.results
GROUP BY test_type, subtest;

CREATE OR REPLACE VIEW public.recent_tests AS
SELECT
    ts.id as session_id,
    ts.user_id,
    ts.test_type,
    ts.subtest,
    ts.status,
    ts.started_at,
    ts.finished_at,
    r.score,
    r.correct_count,
    r.total_questions,
    r.percentile
FROM public.test_sessions ts
LEFT JOIN public.results r ON r.session_id = ts.id
ORDER BY ts.started_at DESC;
