import Cookies from 'js-cookie';

const ADMIN_KEY = 'sicakra_admin';
const ROLE_KEY = 'sicakra_role';
const NAME_KEY = 'sicakra_name';

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: 'OPERASIONAL' | 'KEUANGAN' | 'TEKNIS';
}

export function saveAuth(admin: AdminInfo) {
  // Do NOT store session token here — backend sets HttpOnly `sicakra_session`.
  // Save non-sensitive profile info for client use.
  try {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    Cookies.set(ROLE_KEY, admin.role.toLowerCase(), { expires: 7, sameSite: 'lax' });
    Cookies.set(NAME_KEY, admin.name, { expires: 7, sameSite: 'lax' });
  } catch (e) {
    // noop
  }
}

export function getToken(): string | null {
  // Session token is HttpOnly and not accessible from JS
  return null;
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
  Cookies.remove(ROLE_KEY);
  Cookies.remove(NAME_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function isAuthenticated(): boolean {
  // best-effort client-side check: presence of role cookie
  if (typeof window === 'undefined') return false;
  return !!Cookies.get(ROLE_KEY);
}