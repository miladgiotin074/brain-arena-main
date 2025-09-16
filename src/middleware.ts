import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip validation for auth-error page, static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/auth-error') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // For Telegram Web Apps, init data validation is handled client-side
  // using the Telegram SDK (retrieveRawInitData) and useAuthValidation hook
  // This middleware now only handles routing and doesn't validate init data
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth-error (auth error page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth-error).*)',
  ],
};