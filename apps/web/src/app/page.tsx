import Link from 'next/link'
import { mayOpen } from '@supersoft/domain'
import type { Account, AvailableProject } from '@supersoft/domain'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { arrive, openByName } from './arrival-actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from './ui'

function ProjectRow({ project, account }: { project: AvailableProject; account?: Account }) {
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
                ? 'Open to everyone — read without saying who you are.'
                : 'Only the people it recognises.'
              : 'Not written in the form Supersoft reads.'}
          </p>
        </div>
        <Pill tone={project.inTheForm ? 'accent' : 'warn'}>
          {project.inTheForm ? 'readable' : 'unreadable'}
        </Pill>
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
  const account = await cookieArrivals.whoIsHere()
  const last = await cookieArrivals.lastOpened()
  const projects = await inMemoryProjectStore.available(account)
  const lastProject = projects.find((project) => project.id === last)

  return (
    <Page title={account ? 'Your projects' : 'Arrive'}>
      {!account && (
        <Section title="Say who you are">
          <Card>
            <p className="text-sm text-muted">
              Supersoft never creates a project. It opens one that already exists where you keep it,
              and it can only act where you could already act without it.
            </p>
            <form action={arrive} className="mt-3">
              <Button>Sign in where my projects live</Button>
            </form>
          </Card>
        </Section>
      )}

      {account && lastProject && mayOpen(lastProject, account) && (
        <Section title="Where you left off">
          <Card>
            <Link
              href={`/projects/${lastProject.id}`}
              className="text-sm font-medium hover:text-accent"
            >
              {lastProject.name} →
            </Link>
            <p className="mt-1 text-sm text-muted">
              Remembered as a convenience. Forget it and no project loses anything.
            </p>
          </Card>
        </Section>
      )}

      <Section title={account ? `Found for you — ${projects.length}` : 'Open to everyone'}>
        {projects.length === 0 && <Empty>Nothing found.</Empty>}
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} account={account} />
        ))}
      </Section>

      <Section title="Or name one that is open to everyone">
        <Card>
          <form action={openByName} className="flex flex-col gap-2 sm:flex-row">
            <Input name="name" placeholder="supersoft" />
            <Button quiet>Open it</Button>
          </form>
          {unknown && (
            <p className="mt-2 text-sm text-warn">
              Nothing open to everyone is called “{unknown}”.
            </p>
          )}
        </Card>
      </Section>
    </Page>
  )
}
