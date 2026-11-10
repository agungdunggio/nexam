import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Nexam — Platform Simulasi UTBK SNBT & Tes Potensi Akademik';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#090D1A',
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.35) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
          padding: '64px 80px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#FFFFFF',
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#6366F1',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              fontSize: '30px',
            }}
          >
            🦉
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              Nexam
            </span>
            <span style={{ fontSize: '15px', color: '#818CF8', fontWeight: 700 }}>
              Platform Simulasi Ujian Masuk PTN
            </span>
          </div>
        </div>

        {/* Center Main Pitch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '980px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#F8FAFC',
            }}
          >
            Simulasi UTBK SNBT & Tes Potensi Akademik
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#94A3B8',
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            Timer realistis, evaluasi nilai instan, analisis performa mendalam, dan pembahasan soal lengkap.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '2px solid rgba(99, 102, 241, 0.4)',
              fontSize: '18px',
              fontWeight: 700,
              color: '#A5B4FC',
            }}
          >
            🎯 UTBK SNBT 2026
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              fontSize: '18px',
              fontWeight: 700,
              color: '#C4B5FD',
            }}
          >
            🧠 Tes Potensi Akademik (TPA)
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              fontSize: '18px',
              fontWeight: 700,
              color: '#6EE7B7',
            }}
          >
            ⚡ Gratis & Siap Pakai
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
