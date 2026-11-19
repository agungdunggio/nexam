import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { toClientQuestion } from '@/lib/seedLoader';
import { sessionsCache, StoredSession } from '@/lib/sessionStore';
import { fetchQuestionsForSubtest } from '@/lib/supabaseSimulation';
import { saveTestSessionToSupabase } from '@/lib/supabaseTest';
import { QuestionVersion, TestType } from '@/types/test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      test_type,
      subtest,
      version = 'v2',
    } = body as { test_type: TestType; subtest: string; version?: QuestionVersion };

    const normalizedVersion: QuestionVersion = version === 'v1' ? 'v1' : 'v2';

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

    const questions = await fetchQuestionsForSubtest(subtest, normalizedVersion);
    if (!questions || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Bank soal untuk subtes ini belum tersedia' },
        },
        { status: 404 }
      );
    }

    const sessionId = crypto.randomUUID();
    const timeLimitSec =
      questions.length === config.questionCount
        ? config.timeLimitSec
        : Math.max(60, Math.round((config.timeLimitSec * questions.length) / config.questionCount));
    const startedAt = new Date().toISOString();

    const clientQuestions = questions.map((q, idx) => toClientQuestion(q, idx + 1, 'id'));

    const storedSession: StoredSession = {
      id: sessionId,
      user_id: userId,
      test_type,
      subtest,
      version: normalizedVersion,
      time_limit_sec: timeLimitSec,
      started_at: startedAt,
      finished_at: null,
      status: 'in_progress',
      question_ids: questions.map((q) => q.id),
      saved_answers: {},
    };

    sessionsCache.set(sessionId, storedSession);
    await saveTestSessionToSupabase(storedSession);

    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        test_type,
        subtest,
        version: normalizedVersion,
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
