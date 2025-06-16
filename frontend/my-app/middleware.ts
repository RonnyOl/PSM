import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('✅ Middleware ejecutado');

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/chat/:path*'],
};
