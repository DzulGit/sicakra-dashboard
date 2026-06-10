export type AdminRole = 'OPERASIONAL' | 'KEUANGAN' | 'TEKNIS';

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}