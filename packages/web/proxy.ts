import { NextResponse, type NextRequest } from 'next/server'

// Next.js 16 route guard (formerly middleware.ts). The app keeps its token in browser
// storage, so this checks the sign-in flag cookie that lib/kpily.ts sets alongside it;
// the dashboard still verifies the token with the API on load.
const SESSION_COOKIE = 'kpily_signed_in'

export function proxy(req: NextRequest) {
  const signedIn = req.cookies.get(SESSION_COOKIE)?.value === '1'
  const { pathname, search } = req.nextUrl

  if (pathname.startsWith('/dashboard') && !signedIn) {
    const url = new URL('/login', req.url)
    url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }
  if (pathname === '/login' && signedIn && !req.nextUrl.searchParams.has('next')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*', '/login'] }
