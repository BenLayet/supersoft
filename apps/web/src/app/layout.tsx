import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { en as t } from '@/i18n/en'
import { productName } from '@/product'

export const metadata: Metadata = { title: productName, description: t.description }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="border-b border-rule bg-card">
          <div className="mx-auto max-w-3xl px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              {productName}
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
