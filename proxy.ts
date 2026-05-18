import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Next.js 16+: `middleware` → `proxy` (same edge behaviour, clearer naming). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never run admin UI auth on API routes (avoids breaking /api/backoffice/*)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow the login page itself (otherwise infinite redirect loop)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = request.cookies.get('vcs_admin_session');

  if (!session?.value) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/dashboard/:path*',
    '/admin/leads/:path*',
    '/admin/blogs/:path*',
    '/admin/services/:path*',
    '/admin/testimonials/:path*',
  ],
};
