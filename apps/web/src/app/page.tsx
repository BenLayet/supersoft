import Link from 'next/link'
import { mayOpen } from '@supersoft/domain'
import type { Account, AvailableProject } from '@supersoft/domain'
import { currentLocale, dictionaryOf, languageName } from '@/i18n'
import type { Dictionary, Locale } from '@/i18n'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { arrive, openByName } from './arrival-actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from './ui'

function ProjectRow({
  project,
  account,
  language,
  locale,
  t,
}: {
  project: AvailableProject
  account?: Account
  /** Known only once the project has been read. */
  language?: string
  locale: Locale
  t: Dictionary
}) {
  const open = mayOpen(project, account)
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          {open ? (
            <Link
              href={`/projects/${project.id}`}
              className="text-sm font-medium hover:text-accent"
            >
              {project.name}
            </Link>
          ) : (
            <p className="text-sm font-medium text-muted">{project.name}</p>
          )}
          <p className="mt-1 text-sm text-muted">
            {project.inTheForm
              ? project.openToEveryone
                ? t.arrival.readWithoutSaying
                : t.arrival.onlyRecognised
              : t.arrival.notInTheForm}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {language && <Pill>{t.writtenIn(languageName(language, locale))}</Pill>}
          <Pill tone={project.inTheForm ? 'accent' : 'warn'}>
            {project.inTheForm ? t.arrival.readable : t.arrival.unreadable}
          </Pill>
        </div>
      </div>
    </Card>
  )
}

export default async function ArrivalPage({
  searchParams,
}: {
  searchParams: Promise<{ unknown?: string }>
}) {
  const { unknown } = await searchParams
  const locale = await currentLocale()
  const t = dictionaryOf(locale)
  const account = await cookieArrivals.whoIsHere()
  const last = await cookieArrivals.lastOpened()
  const projects = await inMemoryProjectStore.available(account)
  const lastProject = projects.find((project) => project.id === last)
  const languages = new Map(
    await Promise.all(
      projects
        .filter((project) => mayOpen(project, account))
        .map(async (project) => [project.id, (await inMemoryProjectStore.load(project.id))?.language] as const),
    ),
  )

  return (
    <Page title={account ? t.arrival.yourProjects : t.arrival.arrive}>
      {!account && (
        <Section title={t.arrival.sayWhoYouAre}>
          <Card>
            <p className="text-sm text-muted">{t.arrival.neverCreates}</p>
            <form action={arrive} className="mt-3">
              <Button>{t.arrival.signIn}</Button>
            </form>
          </Card>
        </Section>
      )}

      {account && lastProject && mayOpen(lastProject, account) && (
        <Section title={t.arrival.whereYouLeftOff}>
          <Card>
            <Link
              href={`/projects/${lastProject.id}`}
              className="text-sm font-medium hover:text-accent"
            >
              {lastProject.name} →
            </Link>
            <p className="mt-1 text-sm text-muted">{t.arrival.remembered}</p>
          </Card>
        </Section>
      )}

      <Section
        title={account ? t.arrival.foundForYou(projects.length) : t.arrival.openToEveryone}
      >
        {projects.length === 0 && <Empty>{t.arrival.nothingFound}</Empty>}
        {projects.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            account={account}
            language={languages.get(project.id)}
            locale={locale}
            t={t}
          />
        ))}
      </Section>

      <Section title={t.arrival.nameOne}>
        <Card>
          <form action={openByName} className="flex flex-col gap-2 sm:flex-row">
            <Input name="name" placeholder="supersoft" />
            <Button quiet>{t.arrival.openIt}</Button>
          </form>
          {unknown && <p className="mt-2 text-sm text-warn">{t.arrival.unknown(unknown)}</p>}
        </Card>
      </Section>
    </Page>
  )
}
