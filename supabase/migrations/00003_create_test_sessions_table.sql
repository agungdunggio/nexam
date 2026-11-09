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
