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
