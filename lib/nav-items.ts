import { canAccess, Feature } from '@/lib/permissions';
import { AdminRole } from '@/types';
import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  Package,
  Ticket,
  Calendar,
  Settings
} from 'lucide-react';

// Daftar master menu seluruh aplikasi Sicakra
export const NAV_ITEMS = [
  { 
    label: 'Overview',       
    href: '/overview',       
    icon: LayoutDashboard, 
    feature: 'overview' as Feature 
  },
  { 
    label: 'Pendaftaran',    
    href: '/registrations',  
    icon: ClipboardList,   
    feature: 'registrations' as Feature 
  },
  { 
    label: 'Tagihan',        
    href: '/billing',         
    icon: CreditCard,      
    feature: 'billing' as Feature 
  },
  { 
    label: 'Paket',          
    href: '/packages',        
    icon: Package,         
    feature: 'packages' as Feature 
  },
  { 
    label: 'Tiket',          
    href: '/tickets',         
    icon: Ticket,          
    feature: 'tickets' as Feature 
  },
  { 
    label: 'Jadwal',         
    href: '/schedule',        
    icon: Calendar,        
    feature: 'schedule' as Feature 
  },
  { 
    label: 'Pengaturan',     
    href: '/settings',        
    icon: Settings,        
    feature: 'settings' as Feature 
  },
];

/**
 * Fungsi untuk mengambil menu yang hanya boleh dilihat oleh role tertentu
 */
export function getNavForRole(role: AdminRole) {
  return NAV_ITEMS.filter(item => canAccess(role, item.feature));
}