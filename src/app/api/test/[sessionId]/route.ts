import { NextRequest, NextResponse } from 'next/server';
import { getSeedQuestions, toClientQuestion } from '@/lib/seedLoader';
import { sessionsCache } from '@/lib/sessionStore';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const session = sessionsCache.get(sessionId);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Sesi tes tidak ditemukan' },
        },
        { status: 404 }
      );
    }

    const questions = getSeedQuestions(session.subtest);
    const clientQuestions = questions.map((q, idx) => toClientQuestion(q, idx + 1, 'id'));

    const startedTime = new Date(session.started_at).getTime();
    const now = Date.now();
    const elapsedSec = Math.max(0, Math.floor((now - startedTime) / 1000));

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        test_type: session.test_type,
        subtest: session.subtest,
        status: session.status,
        time_limit_sec: session.time_limit_sec,
        started_at: session.started_at,
        elapsed_sec: elapsedSec,
        questions: clientQuestions,
        saved_answers: session.saved_answers || {},
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal mengambil data sesi tes' },
      },
      { status: 500 }
    );
  }
}
