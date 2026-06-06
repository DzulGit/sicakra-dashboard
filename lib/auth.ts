import Cookies from 'js-cookie';

const TOKEN_KEY = 'sicakra_token';
const ADMIN_KEY = 'sicakra_admin';

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: 'OPERASIONAL' | 'KEUANGAN' | 'TEKNIS';
}

export function saveAuth(token: string, admin: AdminInfo) {
  // Cookie untuk middleware (proteksi route)
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'strict' });
  // localStorage untuk akses data admin di client
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return Cookies.get(TOKEN_KEY) || null;
}

export function getAdmin(): AdminInfo | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}