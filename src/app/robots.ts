import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexam-test.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/test', '/test/utbk', '/test/tpa', '/simulation'],
        disallow: [
          '/api/',
          '/test/utbk/*',
          '/test/tpa/*',
          '/results/*',
          '/simulation/session/*',
          '/simulation/results/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
