import { open } from '@/session'
import { currentLocale, dictionaryOf, languageName } from '@/i18n'
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
  const locale = await currentLocale()
  const t = dictionaryOf(locale)
  const at = `/projects/${project.id}`

  return (
    <>
      <div className="border-b border-rule bg-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3">
          <span className="text-sm font-semibold tracking-tight">{project.name}</span>
          <nav className="flex gap-5">
            <NavLink href={at} exact>
              {t.project.project}
            </NavLink>
            <NavLink href={`${at}/domain/discovery`} activeOn={`${at}/domain`}>
              {t.project.domain}
            </NavLink>
            <NavLink href={`${at}/solution/features`} activeOn={`${at}/solution`}>
              {t.project.solution}
            </NavLink>
          </nav>
          <span className="ml-auto flex gap-1">
            <Pill>{t.writtenIn(languageName(project.language, locale))}</Pill>
            {!writable && <Pill>{t.project.readingOnly}</Pill>}
          </span>
        </div>
      </div>
      {children}
    </>
  )
}
