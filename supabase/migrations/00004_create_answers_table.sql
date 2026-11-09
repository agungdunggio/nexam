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
