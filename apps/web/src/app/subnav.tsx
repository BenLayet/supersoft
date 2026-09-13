import { NavLink } from './nav-link'

/** The second level of navigation: the two halves of a section. */
export function SubNav({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="border-b border-rule bg-card/60">
      <nav className="mx-auto flex max-w-3xl gap-2 px-6 py-2">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} variant="sub">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
