import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0] ?? request.nextUrl.hostname
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/favicon.ico') return NextResponse.next()

  if (hostname === 'admin.localhost' && pathname === '/') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  if (hostname === 'warga.localhost' && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
