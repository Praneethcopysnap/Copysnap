import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import React from 'react'
import { WorkspacesProvider } from './context/workspaces'
import { Analytics } from '@vercel/analytics/react'

const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata = {
  title: 'CopySnap - Context-Aware UX Copy Generator',
  description: 'Generate better UX copy for your product interfaces using real context from your designs and brand guidelines.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#3B82F6',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return (
    <html lang="en">
      <body className={notoSans.className}>
        <WorkspacesProvider>
          {children}
        </WorkspacesProvider>
        <Analytics />
      </body>
    </html>
  )
} 