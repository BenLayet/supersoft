import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Supersoft',
  description: 'Specifying and planning an application, with the customer in the conversation.',
}

const nav = [
  { href: '/', label: 'Project' },
  { href: '/discovery', label: 'Discovery' },
  { href: '/domain', label: 'Domain' },
  { href: '/stories', label: 'Stories' },
  { href: '/versions', label: 'Versions' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="border-b border-rule bg-card">
          <div className="mx-auto flex max-w-3xl flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Supersoft
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ))}
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
