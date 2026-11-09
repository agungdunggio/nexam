import { NextRequest, NextResponse } from 'next/server';
import { sessionsCache } from '@/lib/sessionStore';
import { UserStats } from '@/types/results';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testTypeFilter = searchParams.get('test_type');

    // Aggregate sessions from cache
    const completedSessions = Array.from(sessionsCache.values()).filter(
      (s) => (s.status === 'completed' || s.status === 'timed_out') && s.result
    );

    const filtered = testTypeFilter
      ? completedSessions.filter((s) => s.test_type === testTypeFilter)
      : completedSessions;

    const recentTests = filtered
      .map((s) => ({
        session_id: s.id,
        test_type: s.test_type,
        subtest: s.subtest,
        score: s.result?.score || 0,
        date: s.finished_at ? s.finished_at.split('T')[0] : '2026-10-20',
      }))
      .reverse()
      .slice(0, 10);

    const totalTests = filtered.length;
    const scores = filtered.map((s) => s.result?.score || 0);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const stats: UserStats = {
      total_tests_taken: totalTests,
      average_score: avgScore,
      highest_score: highestScore,
      subtests: [
        {
          subtest: 'penalaran_umum',
          total_attempts: 3,
          avg_score: 74.5,
          best_score: 86.7,
          worst_score: 60.0,
          avg_accuracy: 74.2,
          avg_time_spent_sec: 1750,
          trend: [
            { attempt: 1, score: 60.0, date: '2026-10-01' },
            { attempt: 2, score: 68.0, date: '2026-10-08' },
            { attempt: 3, score: 86.7, date: '2026-10-20' },
          ],
        },
        {
          subtest: 'penalaran_matematika',
          total_attempts: 2,
          avg_score: 72.0,
          best_score: 80.0,
          worst_score: 64.0,
          avg_accuracy: 70.0,
          avg_time_spent_sec: 1600,
          trend: [
            { attempt: 1, score: 64.0, date: '2026-10-05' },
            { attempt: 2, score: 80.0, date: '2026-10-15' },
          ],
        },
      ],
      recent_tests: recentTests.length > 0 ? recentTests : [
        {
          session_id: 'demo-sample-1',
          test_type: 'utbk',
          subtest: 'penalaran_umum',
          score: 86.7,
          date: '2026-10-20',
        },
        {
          session_id: 'demo-sample-2',
          test_type: 'utbk',
          subtest: 'penalaran_matematika',
          score: 80.0,
          date: '2026-10-15',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal mengambil statistik' },
      },
      { status: 500 }
    );
  }
}
