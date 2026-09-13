import { SubNav } from '@/app/subnav'

export default async function SolutionLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const at = `/projects/${projectId}/solution`

  return (
    <>
      <SubNav
        links={[
          { href: `${at}/features`, label: 'Features' },
          { href: `${at}/versions`, label: 'Versions' },
        ]}
      />
      {children}
    </>
  )
}
