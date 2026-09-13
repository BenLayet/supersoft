import { open } from '@/session'
import { NavLink } from './nav'
import { Pill } from '@/app/ui'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const at = `/projects/${project.id}`

  return (
    <>
      <div className="border-b border-rule bg-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3">
          <span className="text-sm font-semibold tracking-tight">{project.name}</span>
          <nav className="flex gap-5">
            <NavLink href={at} exact>
              Project
            </NavLink>
            <NavLink href={`${at}/domain/discovery`} activeOn={`${at}/domain`}>
              Domain
            </NavLink>
            <NavLink href={`${at}/solution/features`} activeOn={`${at}/solution`}>
              Solution
            </NavLink>
          </nav>
          {!writable && (
            <span className="ml-auto">
              <Pill>reading only</Pill>
            </span>
          )}
        </div>
      </div>
      {children}
    </>
  )
}
