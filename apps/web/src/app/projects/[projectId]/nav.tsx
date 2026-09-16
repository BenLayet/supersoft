'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** The one client component: it only needs to know which part is being read. */
export function NavLink({
  href,
  activeOn,
  exact = false,
  variant = 'top',
  children,
}: {
  href: string
  activeOn?: string
  exact?: boolean
  variant?: 'top' | 'sub'
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const match = activeOn ?? href
  const active = exact ? pathname === match : pathname.startsWith(match)

  const styles =
    variant === 'top'
      ? active
        ? 'text-ink font-medium'
        : 'text-muted hover:text-ink'
      : active
        ? 'rounded-full bg-accent-soft px-3 py-1 text-accent'
        : 'rounded-full px-3 py-1 text-muted hover:text-ink'

  return (
    <Link href={href} className={`text-sm ${styles}`}>
      {children}
    </Link>
  )
}
