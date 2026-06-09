import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Read cookies
  const session = req.cookies.get('sicakra_session')?.value
  const role = req.cookies.get('sicakra_role')?.value

  // If user is trying to access dashboard but has no session -> redirect to /login
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // If authenticated user visits /login, redirect them to role-specific dashboard
  if (pathname === '/login' || pathname.startsWith('/login')) {
    if (session) {
      const targetRole = role ? role.toLowerCase() : 'operasional'
      const redirectUrl = new URL(`/dashboard/${targetRole}`, req.url)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("sicakra_session")?.value;
  const role = request.cookies.get("sicakra_role")?.value || "OPERASIONAL";
  const pathname = request.nextUrl.pathname;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      // Redirect to login if no session cookie exists
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from /login
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
