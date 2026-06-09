import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Providers from './providers'

const _dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SalesOps Dashboard',
  description: 'Sales Operations Dashboard - Analytics & Pipeline Management',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      {/* 1. Tempelkan font kelas _dmSans ke body agar tampilan teks dashboard lu estetik */}
      <body className={_dmSans.className}>
        
        {/* 2. DISINI KUNCINYA: Bungkus dengan <Providers> agar Clerk & Theme aktif secara global */}
        <Providers>
          {children}
        </Providers>

        {/* 3. Sekalian gua pasang Analytics vercel-nya karena sayang udah lu import */}
        <Analytics />
      </body>
    </html>
  );
}