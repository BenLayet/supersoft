import Link from 'next/link'
import { countByState, nextStory, openQuestions, versionInUse } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { Card, Page, Pill, Section } from './ui'

const roleLabels = { customer: 'customer', maker: 'maker', domainExpert: 'domain expert' }

export default async function ProjectPage() {
  const project = await inMemoryProjectStore.load()
  const { specification, stories, versions } = project
  const open = openQuestions(specification.questions)
  const agreed = specification.rules.filter((rule) => rule.state === 'agreed')
  const counts = countByState(stories)
  const next = nextStory(stories)
  const live = versionInUse(versions)

  return (
    <Page
      title={project.name}
      lead="One application, for one customer. Everything below is written in the words of the people who commissioned it."
    >
      <Section title="Who takes part">
        <Card>
          <ul className="space-y-1 text-sm">
            {project.participants.map((participant) => (
              <li key={participant.name} className="flex items-center gap-2">
                <span>{participant.name}</span>
                <Pill>{roleLabels[participant.role]}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title="Where it stands">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Link href="/discovery" className="text-sm font-medium hover:text-accent">
              Discovery
            </Link>
            <p className="mt-1 text-sm text-muted">
              {open.length} open question{open.length === 1 ? '' : 's'} out of{' '}
              {specification.questions.length}.
            </p>
          </Card>
          <Card>
            <Link href="/domain" className="text-sm font-medium hover:text-accent">
              Domain
            </Link>
            <p className="mt-1 text-sm text-muted">
              {specification.terms.length} terms, {agreed.length} of {specification.rules.length}{' '}
              rules agreed.
            </p>
          </Card>
          <Card>
            <Link href="/stories" className="text-sm font-medium hover:text-accent">
              Stories
            </Link>
            <p className="mt-1 text-sm text-muted">
              {counts.done} done, {counts.in_progress} in progress, {counts.to_do} to do.
            </p>
          </Card>
          <Card>
            <Link href="/versions" className="text-sm font-medium hover:text-accent">
              Versions
            </Link>
            <p className="mt-1 text-sm text-muted">
              {live ? `Real people are using ${live.name}.` : 'Nothing has reached real people yet.'}
            </p>
          </Card>
        </div>
      </Section>

      <Section title="What comes next">
        <Card>
          {next ? (
            <p className="text-sm">
              As a <strong>{next.role}</strong>, I want to {next.intention}, so that {next.reason}.
            </p>
          ) : (
            <p className="text-sm italic text-muted">
              Nothing is waiting. Every story is under way or done.
            </p>
          )}
        </Card>
      </Section>
    </Page>
  )
}
