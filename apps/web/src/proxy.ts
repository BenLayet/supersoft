import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LAST_OPENED } from '@/prototype/cookie-names'

/**
 * Remembering where someone was, so they come back to the project they left.
 * A convenience: throw the cookie away and no project loses anything.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const opened = request.nextUrl.pathname.match(/^\/projects\/([^/]+)/)
  if (opened?.[1]) response.cookies.set(LAST_OPENED, opened[1], { path: '/' })
  return response
}

export const config = { matcher: '/projects/:path*' }
