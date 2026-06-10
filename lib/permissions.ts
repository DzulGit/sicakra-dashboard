import { AdminRole } from '@/types';

export type Feature =  
  | 'overview'  
  | 'registrations'  
  | 'billing'  
  | 'packages'  
  | 'tickets'  
  | 'schedule'  
  | 'settings';

// Central mapping: Siapa boleh akses apa
export const PERMISSIONS: Record<Feature, AdminRole[]> = {  
  overview:      ['OPERASIONAL', 'KEUANGAN', 'TEKNIS'],  
  registrations: ['OPERASIONAL'],  
  billing:       ['KEUANGAN'],  
  packages:      ['OPERASIONAL', 'KEUANGAN'],  
  tickets:       ['TEKNIS'],  
  schedule:      ['TEKNIS'],  
  settings:      ['OPERASIONAL', 'KEUANGAN', 'TEKNIS'],
};

// Fungsi sakti pengecek izin akses
export function canAccess(role: AdminRole, feature: Feature): boolean {  
  return PERMISSIONS[feature]?.includes(role) || false;
}