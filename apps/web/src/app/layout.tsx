import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { currentLocale, dictionary, dictionaryOf, locales } from '@/i18n'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { chooseLocale, leave } from './arrival-actions'

export async function generateMetadata(): Promise<Metadata> {
  const t = await dictionary()
  return { title: 'Supersoft', description: t.description }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = await cookieArrivals.whoIsHere()
  const locale = await currentLocale()
  const t = dictionaryOf(locale)

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="border-b border-rule bg-card">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Supersoft
            </Link>
            <div className="flex items-center gap-5">
              {account ? (
                <form action={leave} className="flex items-center gap-3">
                  <span className="text-sm text-muted">{account.name}</span>
                  <button type="submit" className="text-sm text-muted hover:text-ink">
                    {t.header.leave}
                  </button>
                </form>
              ) : (
                <span className="text-sm text-muted">{t.header.notSignedIn}</span>
              )}
              <form action={chooseLocale} className="flex gap-2">
                {locales.map((one) => (
                  <button
                    key={one}
                    type="submit"
                    name="locale"
                    value={one}
                    lang={one}
                    aria-pressed={one === locale}
                    className={`text-sm ${one === locale ? 'font-medium text-ink' : 'text-muted hover:text-ink'}`}
                  >
                    {dictionaryOf(one).languageName}
                  </button>
                ))}
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule px-6 py-4 text-center text-xs text-muted">
          {t.footer}
        </footer>
      </body>
    </html>
  )
}
