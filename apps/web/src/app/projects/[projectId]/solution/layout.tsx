import { SubNav } from '@/app/subnav'
import { dictionary } from '@/i18n'

export default async function SolutionLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const at = `/projects/${projectId}/solution`
  const t = await dictionary()

  return (
    <>
      <SubNav
        links={[
          { href: `${at}/features`, label: t.project.features },
          { href: `${at}/versions`, label: t.project.versions },
        ]}
      />
      {children}
    </>
  )
}
