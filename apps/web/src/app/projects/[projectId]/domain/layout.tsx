import { SubNav } from '@/app/subnav'

export default async function DomainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const at = `/projects/${projectId}/domain`

  return (
    <>
      <SubNav
        links={[
          { href: `${at}/discovery`, label: 'Informal' },
          { href: `${at}/formalisation`, label: 'Formal' },
        ]}
      />
      {children}
    </>
  )
}
