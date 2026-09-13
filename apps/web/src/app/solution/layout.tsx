import { SubNav } from '../subnav'

export default function SolutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubNav
        links={[
          { href: '/solution/features', label: 'Features' },
          { href: '/solution/versions', label: 'Versions' },
        ]}
      />
      {children}
    </>
  )
}
