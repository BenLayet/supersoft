import { SubNav } from '../subnav'

export default function DomainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubNav
        links={[
          { href: '/domain/discovery', label: 'Informal' },
          { href: '/domain/formalisation', label: 'Formal' },
        ]}
      />
      {children}
    </>
  )
}
