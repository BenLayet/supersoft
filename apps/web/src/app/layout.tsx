import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { currentLocale, dictionary, dictionaryOf, locales, speaksProjectLanguage } from '@/i18n'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { chooseLocale, leave, useProjectLanguage } from './arrival-actions'

export async function generateMetadata(): Promise<Metadata> {
  const t = await dictionary()
  return { title: 'Supersoft', description: t.description }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = await cookieArrivals.whoIsHere()
  const locale = await currentLocale()
  const t = dictionaryOf(locale)
  const follows = await speaksProjectLanguage()

  return (
    <html lang={locale} className="h-full antialiased">
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
                  {t.header.leave}
                </button>
              </form>
            ) : (
              <span className="text-sm text-muted">{t.header.notSignedIn}</span>
            )}
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule px-6 py-4 text-xs text-muted">
          <div className="mx-auto flex max-w-3xl flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <form action={chooseLocale} className="flex items-center gap-2">
                <span>{t.footer.language}</span>
                {locales.map((one) => (
                  <button
                    key={one}
                    type="submit"
                    name="locale"
                    value={one}
                    lang={one}
                    aria-pressed={one === locale}
                    className={one === locale ? 'font-medium text-ink' : 'hover:text-ink'}
                  >
                    {dictionaryOf(one).languageName}
                  </button>
                ))}
              </form>
              <form action={useProjectLanguage} className="flex items-center gap-2">
                <span>{t.footer.useProjectLanguage}</span>
                {[
                  { value: 'yes', label: t.footer.yes, taken: follows },
                  { value: 'no', label: t.footer.no, taken: !follows },
                ].map((one) => (
                  <button
                    key={one.value}
                    type="submit"
                    name="follow"
                    value={one.value}
                    aria-pressed={one.taken}
                    className={one.taken ? 'font-medium text-ink' : 'hover:text-ink'}
                  >
                    {one.label}
                  </button>
                ))}
              </form>
            </div>
            <span>{t.footer.note}</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
