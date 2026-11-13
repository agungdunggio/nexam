-- supabase/migrations/00008_create_simulations_table.sql

CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'in_progress' NOT NULL,
    total_score DECIMAL(6,2),
    percentile DECIMAL(5,2),
    subtest_scores JSONB DEFAULT '[]'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_simulations_user ON public.simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_simulations_status ON public.simulations(status);
CREATE INDEX IF NOT EXISTS idx_simulations_score ON public.simulations(total_score DESC);

ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Simulations readable by all" ON public.simulations;
CREATE POLICY "Simulations readable by all"
    ON public.simulations FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Simulations insertable" ON public.simulations;
CREATE POLICY "Simulations insertable"
    ON public.simulations FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Simulations updatable" ON public.simulations;
CREATE POLICY "Simulations updatable"
    ON public.simulations FOR UPDATE
    USING (true);
