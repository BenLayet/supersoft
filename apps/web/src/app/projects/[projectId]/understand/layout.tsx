import { SubNav } from '@/app/subnav'
import { dictionary } from '@/i18n'

export default async function UnderstandLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const at = `/projects/${projectId}/understand`
  const t = await dictionary()

  return (
    <>
      <SubNav
        links={[
          { href: `${at}/scope`, label: t.nav.scope },
          { href: `${at}/sources`, label: t.nav.sources },
          { href: `${at}/features`, label: t.nav.features },
        ]}
      />
      {children}
    </>
  )
}
