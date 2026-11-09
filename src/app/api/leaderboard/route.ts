import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('test_type') || 'utbk';
    const subtest = searchParams.get('subtest') || 'penalaran_umum';

    const entries = [
      { rank: 1, user_name: 'Andi Pratama', best_score: 96.7, total_attempts: 8 },
      { rank: 2, user_name: 'Sari Wulandari', best_score: 93.3, total_attempts: 5 },
      { rank: 3, user_name: 'Dimas Setiawan', best_score: 90.0, total_attempts: 7 },
      { rank: 4, user_name: 'Nurul Hidayah', best_score: 88.5, total_attempts: 4 },
      { rank: 5, user_name: 'Fikri Ramadhan', best_score: 86.7, total_attempts: 6 },
      { rank: 6, user_name: 'Aulia Rahma', best_score: 85.0, total_attempts: 3 },
      { rank: 7, user_name: 'Bagus Wicaksono', best_score: 83.3, total_attempts: 5 },
      { rank: 8, user_name: 'Citra Dewi', best_score: 81.5, total_attempts: 4 },
      { rank: 9, user_name: 'Eko Prasetyo', best_score: 80.0, total_attempts: 6 },
      { rank: 10, user_name: 'Gita Maharani', best_score: 78.5, total_attempts: 3 },
    ];

    const scoreDistribution = {
      buckets: [
        { range: '0-10', count: 5 },
        { range: '11-20', count: 12 },
        { range: '21-30', count: 28 },
        { range: '31-40', count: 45 },
        { range: '41-50', count: 67 },
        { range: '51-60', count: 89 },
        { range: '61-70', count: 78 },
        { range: '71-80', count: 65 },
        { range: '81-90', count: 42 },
        { range: '91-100', count: 19 },
      ],
    };

    return NextResponse.json({
      success: true,
      leaderboard: {
        test_type: testType,
        subtest,
        your_position: 12,
        total_participants: 450,
        entries,
        score_distribution: scoreDistribution,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal mengambil data leaderboard' },
      },
      { status: 500 }
    );
  }
}
