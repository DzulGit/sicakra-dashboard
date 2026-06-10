import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccess, Feature } from '@/lib/permissions';
import { AdminRole } from '@/types';

// Map URL path ke feature name sesuai blueprint baru
const PATH_FEATURE_MAP: Record<string, Feature> = {
  '/overview':      'overview',
  '/registrations': 'registrations',
  '/billing':       'billing',
  '/packages':      'packages',
  '/tickets':       'tickets',
  '/schedule':      'schedule',
  '/settings':      'settings',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ambil cookie token sesi & role bawaan backend lu yang sekarang
  const session = request.cookies.get("sicakra_session")?.value;
  const roleRaw = request.cookies.get("sicakra_role")?.value;
  
  // Pastikan formatnya UPPERCASE sesuai tipe AdminRole kita ('OPERASIONAL' | 'KEUANGAN' | 'TEKNIS')
  const role = (roleRaw?.toUpperCase() || "OPERASIONAL") as AdminRole;

  // 2. Biarkan jika user mengakses halaman login dan belum punya sesi
  if (pathname.startsWith('/login')) {
    if (session) {
      // Kalo udah login tapi maksa buka /login, lempar ke /overview
      return NextResponse.redirect(new URL('/overview', request.url));
    }
    return NextResponse.next();
  }

  // 3. Gerbang Utama: Jika belum login, tendang mutlak ke /login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Auto-Redirect: Jika user mengetik URL utama '/' saja, langsung arahkan ke /overview
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // 5. Cek Hak Akses Fitur (Enterprise RBAC Control)
  const feature = PATH_FEATURE_MAP[pathname];
  if (feature && !canAccess(role, feature)) {
    // Jika role-nya gak berhak akses halaman ini, selamatkan ke halaman /overview
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  return NextResponse.next();
}

// Menjaga seluruh halaman kecuali file statis, gambar, dan jalur API internal
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};