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
