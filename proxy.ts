import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccess, Feature } from '@/lib/permissions';
import { AdminRole } from '@/types';

// Map URL path ke feature name
const PATH_FEATURE_MAP: Record<string, Feature> = {
  '/overview':      'overview',
  '/registrations': 'registrations',
  '/billing':       'billing',
  '/packages':      'packages',
  '/tickets':       'tickets',
  '/schedule':      'schedule',
  '/settings':      'settings',
};

// 🔥 PERBAIKAN: Nama fungsi wajib diubah menjadi 'proxy' agar dikenali Next.js 16
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil cookie token sesi & role bawaan backend
  const session = request.cookies.get("sicakra_session")?.value;
  const roleRaw = request.cookies.get("sicakra_role")?.value;
  
  const role = (roleRaw?.toUpperCase() || "OPERASIONAL") as AdminRole;

  // Biarkan jika user mengakses halaman login dan belum punya sesi
  if (pathname.startsWith('/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
    return NextResponse.next();
  }

  // Gerbang Utama: Jika belum login, tendang ke /login
  if (!session) {
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