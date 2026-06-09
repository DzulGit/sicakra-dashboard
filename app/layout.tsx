import React from "react"
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Providers from './providers'

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: 'Sicakra Workspace',
  description: 'Pusat kendali operasional terpadu PT Sinergi Cakra Buana.',
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
      <body className={dmSans.className}>
        
        {/* Bungkus dengan Providers untuk Theme (Dark/Light mode) */}
        <Providers>
          {children}
        </Providers>

        {/* Analytics dari Vercel tetep dibiarin kalau lu mau pantau trafik */}
        <Analytics />
      </body>
    </html>
  );
}