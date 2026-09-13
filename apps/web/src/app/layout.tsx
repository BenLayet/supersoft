import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { leave } from './arrival-actions'

export const metadata: Metadata = {
  title: 'Supersoft',
  description: 'Specifying and planning an application, with the customer in the conversation.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = await cookieArrivals.whoIsHere()

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="border-b border-rule bg-card">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Supersoft
            </Link>
            {account ? (
              <form action={leave} className="flex items-center gap-3">
                <span className="text-sm text-muted">{account.name}</span>
                <button type="submit" className="text-sm text-muted hover:text-ink">
                  Leave
                </button>
              </form>
            ) : (
              <span className="text-sm text-muted">not signed in</span>
            )}
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule px-6 py-4 text-center text-xs text-muted">
          Prototype — fictional projects, held in memory, no outside service.
        </footer>
      </body>
    </html>
  )
}
