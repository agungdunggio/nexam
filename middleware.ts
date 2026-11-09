import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/test', '/results'];
const authPaths = ['/login'];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('nexam_session');
  const hasSession = Boolean(sessionCookie?.value && sessionCookie.value.trim() !== '');
  const { pathname } = request.nextUrl;

  // Root redirect: directly to login (or directly to test if already logged in)
  if (pathname === '/') {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      return NextResponse.redirect(new URL('/test', request.url));
    }
  }

  // Redirect to login if accessing protected route without valid session
  if (protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to test if accessing auth pages while already logged in
  if (authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/test', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/test',
    '/test/:path*',
    '/results',
    '/results/:path*',
    '/login',
    '/login/:path*',
  ],
};
