import { AdminRole } from '@/types';

export type Feature =  
  | 'overview'  
  | 'registrations'  
  | 'billing'  
  | 'packages'
  | 'tasks'  
  | 'tickets'  
  | 'schedule'  
  | 'installations'
  | 'settings';

// Central mapping: Siapa boleh akses apa
export const PERMISSIONS: Record<Feature, AdminRole[]> = {  
  overview:      ['OPERASIONAL', 'KEUANGAN', 'TEKNIS'],  
  registrations: ['OPERASIONAL'],  
  billing:       ['KEUANGAN'],  
  packages:      ['OPERASIONAL', 'KEUANGAN'],  
  tasks:         ['TEKNIS'],  
  tickets:       ['TEKNIS'],  
  schedule:      ['TEKNIS'],  
  settings:      ['OPERASIONAL', 'KEUANGAN', 'TEKNIS'],
  installations: ['TEKNIS'],
};

// Fungsi sakti pengecek izin akses
export function canAccess(role: AdminRole, feature: Feature): boolean {  
  return PERMISSIONS[feature]?.includes(role) || false;
}