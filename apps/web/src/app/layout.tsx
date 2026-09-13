import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { NavLink } from './nav-link'

export const metadata: Metadata = {
  title: 'Supersoft',
  description: 'Specifying and planning an application, with the customer in the conversation.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="border-b border-rule bg-card">
          <div className="mx-auto flex max-w-3xl flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Supersoft
            </Link>
            <nav className="flex gap-5">
              <NavLink href="/" activeOn="/">
                Project
              </NavLink>
              <NavLink href="/domain/discovery" activeOn="/domain">
                Domain
              </NavLink>
              <NavLink href="/solution/features" activeOn="/solution">
                Solution
              </NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule px-6 py-4 text-center text-xs text-muted">
          Prototype — one fictional project, held in memory, no outside service.
        </footer>
      </body>
    </html>
  )
}
