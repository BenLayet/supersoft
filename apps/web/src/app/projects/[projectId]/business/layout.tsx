import { SubNav } from '@/app/subnav'
import { dictionary } from '@/i18n'

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const at = `/projects/${projectId}/business`
  const t = await dictionary()

  return (
    <>
      <SubNav
        links={[
          { href: `${at}/sources`, label: t.nav.sources },
          { href: `${at}/subdomains`, label: t.nav.subdomains },
        ]}
      />
      {children}
    </>
  )
}
