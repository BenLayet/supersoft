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
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            <NavLink href={at} exact>
              {t.nav.overview}
            </NavLink>
            <NavLink href={`${at}/business/sources`} activeOn={`${at}/business`}>
              {t.nav.business}
            </NavLink>
            <NavLink href={`${at}/features`}>{t.nav.features}</NavLink>
            <NavLink href={`${at}/versions`}>{t.nav.versions}</NavLink>
          </nav>
          <span className="ml-auto flex gap-1">
            <Pill>{t.writtenIn(languageName(project.language, locale))}</Pill>
            {!writable && <Pill>{t.overview.readingOnly}</Pill>}
          </span>
        </div>
      </div>
      {children}
    </>
  )
}
