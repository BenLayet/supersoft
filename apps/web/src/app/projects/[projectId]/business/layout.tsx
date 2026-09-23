import { SubNav } from '@/app/subnav'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const at = `/projects/${projectId}/business`
  const { project } = await open(projectId)
  const t = await dictionaryIn(project.language)

  return (
    <>
      <SubNav
        links={[
          { href: `${at}/sources`, label: t.nav.sources },
          { href: `${at}/domains`, label: t.nav.domains },
        ]}
      />
      {children}
    </>
  )
}
