import { NextResponse } from 'next/server';

export function middleware() {
  // Let the API routes handle their own authentication
  // Remove middleware authentication for now
  return NextResponse.next();
}

export const config = {
  matcher: '/api/admin/:path*'
};