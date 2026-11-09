import { NextRequest, NextResponse } from 'next/server';
import { sessionsCache } from '@/lib/sessionStore';
import { SUBTEST_CONFIG } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const session = sessionsCache.get(sessionId);

    if (!session || !session.result) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Hasil ujian tidak ditemukan' },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: session.result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal mengambil hasil ujian' },
      },
      { status: 500 }
    );
  }
}
