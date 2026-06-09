import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Ambil cookie token sesi kustom kita
  const session = request.cookies.get("sicakra_session")?.value;
  
  // 2. Ambil cookie role untuk auto-redirect (default ke operasional jika kosong)
  const role = request.cookies.get("sicakra_role")?.value || "OPERASIONAL";

  // Jalur Proteksi: Jika mencoba masuk ke area dashboard tanpa sesi login
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jalur Proteksi: Jika sudah login tapi mencoba akses halaman login lagi
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

// ⚠️ CUKUP SATU DEKLARASI CONFIG MATCHERS DI SINI
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};