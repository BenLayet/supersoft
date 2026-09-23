'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface NavItem {
  href: string
  label: string
  exact?: boolean
}

/** A part of a project, and the pages it is made of. A part with no label is a single page. */
export interface NavGroup {
  label?: string
  items: NavItem[]
}

/**
 * The one client component: it only needs to know which page is being read,
 * and whether the menu is open on a narrow screen.
 */
export function ProjectNav({
  title,
  badge,
  groups,
  menu,
  closeMenu,
}: {
  title: string
  badge?: React.ReactNode
  groups: NavGroup[]
  menu: string
  closeMenu: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <>
      <div className="border-b border-rule bg-card md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="project-nav"
          className="flex w-full items-center gap-3 px-6 py-3 text-left text-sm"
        >
          <span aria-hidden className="text-muted">
            ☰
          </span>
          <span className="font-semibold tracking-tight">{title}</span>
          <span className="sr-only">{menu}</span>
        </button>
      </div>

      {open && (
        <button
          type="button"
          aria-label={closeMenu}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/20 md:hidden"
        />
      )}

      <aside
        id="project-nav"
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-rule bg-card px-4 py-6 transition-transform md:sticky md:top-0 md:z-auto md:h-screen md:w-56 md:shrink-0 md:translate-x-0 md:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-2 px-2">
          <span className="text-sm font-semibold tracking-tight">{title}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeMenu}
            className="text-sm text-muted hover:text-ink md:hidden"
          >
            ✕
          </button>
        </div>
        {badge && <div className="mt-2 px-2">{badge}</div>}

        <nav className="mt-6 space-y-5">
          {groups.map((group, index) => (
            <div key={group.label ?? index}>
              {group.label && (
                <p className="px-2 pb-1 text-xs font-medium tracking-wide text-muted uppercase">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded px-2 py-1.5 text-sm ${
                          active ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:text-ink'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
