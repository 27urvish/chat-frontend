import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-up')
  console.log(token , "token")
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }
  if (!isAuthPage && !token) {
    // return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/'],
}
