import { NextResponse, type NextRequest } from 'next/server'

// payload-totp needs the current path in the admin panel (server components can't read it);
// without this header the code page redirects in a loop.
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.append('x-pathname', request.nextUrl.pathname)
  return response
}

export const config = { matcher: ['/admin/:path*'] }
