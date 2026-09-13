import Link from 'next/link'
import { countByState, nextStory, openQuestions, versionInUse } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { Card, Page, Pill, Section } from './ui'

export default async function ProjectPage() {
  const project = await inMemoryProjectStore.load()
  const { domain, features, stories, versions } = project
  const open = openQuestions(domain.questions)
  const agreed = domain.rules.filter((rule) => rule.state === 'agreed')
  const counts = countByState(stories)
  const next = nextStory(stories)
  const live = versionInUse(versions)

  return (
    <Page title={project.name}>
      <Section title="Who takes part">
        <Card>
          <ul className="space-y-1 text-sm">
            {project.participants.map((participant) => (
              <li key={participant.name} className="flex items-center gap-2">
                <span>{participant.name}</span>
                <Pill>{participant.role}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title="The domain">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Link href="/domain/discovery" className="text-sm font-medium hover:text-accent">
              Informal
            </Link>
            <p className="mt-1 text-sm text-muted">
              {domain.sources.length} sources kept, {open.length} question
              {open.length === 1 ? '' : 's'} still open.
            </p>
          </Card>
          <Card>
            <Link href="/domain/formalisation" className="text-sm font-medium hover:text-accent">
              Formal
            </Link>
            <p className="mt-1 text-sm text-muted">
              {domain.terms.length} terms in the lexicon, {agreed.length} of {domain.rules.length}{' '}
              rules agreed.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="The solution">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Link href="/solution/features" className="text-sm font-medium hover:text-accent">
              Features
            </Link>
            <p className="mt-1 text-sm text-muted">
              {features.length} features, {counts.done} stories done, {counts.in_progress} in
              progress, {counts.to_do} to do.
            </p>
          </Card>
          <Card>
            <Link href="/solution/versions" className="text-sm font-medium hover:text-accent">
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
