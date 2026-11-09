import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { getSeedQuestions, toClientQuestion } from '@/lib/seedLoader';
import { sessionsCache, StoredSession } from '@/lib/sessionStore';
import { TestType } from '@/types/test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { test_type, subtest } = body as { test_type: TestType; subtest: string };

    if (!test_type || !subtest) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'test_type dan subtest wajib diisi' },
        },
        { status: 400 }
      );
    }

    const config = SUBTEST_CONFIG[test_type]?.[subtest];
    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Konfigurasi subtes tidak ditemukan' },
        },
        { status: 404 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('nexam_session');
    const userId = sessionCookie?.value || 'anonymous_user';

    const questions = getSeedQuestions(subtest);
    if (!questions || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Bank soal untuk subtes ini belum tersedia' },
        },
        { status: 404 }
      );
    }

    const sessionId = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeLimitSec = config.timeLimitSec;
    const startedAt = new Date().toISOString();

    const clientQuestions = questions.map((q, idx) => toClientQuestion(q, idx + 1, 'id'));

    const storedSession: StoredSession = {
      id: sessionId,
      user_id: userId,
      test_type,
      subtest,
      time_limit_sec: timeLimitSec,
      started_at: startedAt,
      finished_at: null,
      status: 'in_progress',
      question_ids: questions.map((q) => q.id),
      saved_answers: {},
    };

    sessionsCache.set(sessionId, storedSession);

    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        test_type,
        subtest,
        time_limit_sec: timeLimitSec,
        started_at: startedAt,
        questions: clientQuestions,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal memulai sesi tes' },
      },
      { status: 500 }
    );
  }
}
