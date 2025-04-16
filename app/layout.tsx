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