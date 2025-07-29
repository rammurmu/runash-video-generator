import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only check for API key on proxy routes
  if (request.nextUrl.pathname.startsWith('/api/fal/proxy')) {
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: 'FAL_KEY environment variable is not set' },
        { status: 500 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/fal/proxy/:path*',
}; 