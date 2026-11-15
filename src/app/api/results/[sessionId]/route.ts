import { NextRequest, NextResponse } from 'next/server';
import { loadTestResult } from '@/lib/supabaseTest';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const result = await loadTestResult(sessionId);

    if (!result) {
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
      result,
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
