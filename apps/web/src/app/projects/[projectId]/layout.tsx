import { open } from '@/session'
import { dictionaryOf, localeIn } from '@/i18n'
import { ProjectNav } from './nav'
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
    <div lang={locale} className="md:flex">
      <ProjectNav
        title={project.name}
        badge={writable ? undefined : <Pill>{t.overview.readingOnly}</Pill>}
        menu={t.nav.menu}
        closeMenu={t.nav.closeMenu}
        groups={[
          { items: [{ href: at, label: t.nav.overview, exact: true }] },
          {
            label: t.nav.business,
            items: [
              { href: `${at}/business/workshops`, label: t.nav.workshops },
              { href: `${at}/business/domains`, label: t.nav.domains },
            ],
          },
          {
            items: [
              { href: `${at}/features`, label: t.nav.features },
              { href: `${at}/versions`, label: t.nav.versions },
            ],
          },
        ]}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
