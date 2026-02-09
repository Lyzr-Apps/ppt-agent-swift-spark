import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { IframeLoggerInit } from '@/components/IframeLoggerInit'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SalesDeck AI - Sales Presentation Generator',
  description: 'Generate professional sales presentations in minutes with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <IframeLoggerInit />
        {children}
      </body>
    </html>
  )
}
