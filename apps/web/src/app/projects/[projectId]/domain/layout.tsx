import { SubNav } from '@/app/subnav'
import { dictionary } from '@/i18n'

export default async function DomainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const at = `/projects/${projectId}/domain`
  const t = await dictionary()

  return (
    <>
      <SubNav
        links={[
          { href: `${at}/discovery`, label: t.project.informal },
          { href: `${at}/formalisation`, label: t.project.formal },
        ]}
      />
      {children}
    </>
  )
}
