import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccess, Feature } from '@/lib/permissions';
import { AdminRole } from '@/types';

const PATH_FEATURE_MAP: Record<string, Feature> = {
  '/overview':      'overview',
  '/registrations': 'registrations',
  '/billing':       'billing',
  '/packages':      'packages',
  '/tickets':       'tickets',
  '/schedule':      'schedule',
  '/settings':      'settings',
};

// 🔥 PERBAIKAN 1: Namanya WAJIB 'middleware' bos!
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔥 PERBAIKAN 2: Frontend gak bisa baca sicakra_session! 
  // Kita cek keberadaan cookie 'sicakra_role' buatan frontend sebagai bukti otentikasi.
  const roleRaw = request.cookies.get("sicakra_role")?.value;
  const isAuthenticated = !!roleRaw; 
  
  const role = (roleRaw?.toUpperCase() || "OPERASIONAL") as AdminRole;

  // Kalo lagi di halaman login tapi udah punya tiket, langsung lempar ke overview
  if (pathname.startsWith('/login')) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
    return NextResponse.next();
  }

  // Gerbang Utama: Kalo belum login (gak ada cookie role), tendang ke /login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Auto-Redirect root ke /overview
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // Cek Hak Akses Fitur (Enterprise RBAC Control)
  const feature = PATH_FEATURE_MAP[pathname];
  if (feature && !canAccess(role, feature)) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};