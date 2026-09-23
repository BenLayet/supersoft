import { open } from '@/session'
import { dictionaryOf, localeIn } from '@/i18n'
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
  const locale = await localeIn(project.language)
  const t = dictionaryOf(locale)
  const at = `/projects/${project.id}`

  return (
    // What Supersoft says here may not be what it says elsewhere: inside a
    // project, it speaks that project's language until the person chooses.
    <div lang={locale}>
      <div className="border-b border-rule bg-card">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3">
          <span className="text-sm font-semibold tracking-tight">{project.name}</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            <NavLink href={at} exact>
              {t.nav.overview}
            </NavLink>
            <NavLink href={`${at}/business/workshops`} activeOn={`${at}/business`}>
              {t.nav.business}
            </NavLink>
            <NavLink href={`${at}/features`}>{t.nav.features}</NavLink>
            <NavLink href={`${at}/versions`}>{t.nav.versions}</NavLink>
          </nav>
          {!writable && (
            <span className="ml-auto">
              <Pill>{t.overview.readingOnly}</Pill>
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
