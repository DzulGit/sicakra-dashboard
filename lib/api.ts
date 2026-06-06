const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Email atau password salah');
  }

  return data as {
    accessToken: string;
    admin: {
      id: string;
      name: string;
      email: string;
      role: 'OPERASIONAL' | 'KEUANGAN' | 'TEKNIS';
    };
  };
}