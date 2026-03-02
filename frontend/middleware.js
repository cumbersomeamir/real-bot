import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/brokers') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/ai-agents') ||
    pathname.startsWith('/automation') ||
    pathname.startsWith('/communications') ||
    pathname.startsWith('/future') ||
    pathname.startsWith('/projects')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)']
};
