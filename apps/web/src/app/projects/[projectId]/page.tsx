import Link from 'next/link'
import { countByState, nextStory, openQuestions, versionInUse } from '@supersoft/domain'
import { open } from '@/session'
import { storyHref } from '@/app/story-line'
import { Card, Page, Pill, Section } from '@/app/ui'

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, found } = await open(projectId)
  const { domain, features, stories, versions } = project
  const at = `/projects/${project.id}`
  const openQ = openQuestions(domain.questions)
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
              <li key={participant.role} className="flex items-center gap-2">
                <span>{participant.name}</span>
                <Pill>{participant.role}</Pill>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            Kept by {found.owner}.{' '}
            {found.openToEveryone
              ? 'Open to everyone — read without saying who you are.'
              : 'Open to the people it recognises.'}
          </p>
        </Card>
      </Section>

      <Section title="The domain">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Link href={`${at}/domain/discovery`} className="text-sm font-medium hover:text-accent">
              Informal
            </Link>
            <p className="mt-1 text-sm text-muted">
              {domain.sources.length} sources kept, {openQ.length} question
              {openQ.length === 1 ? '' : 's'} still open.
            </p>
          </Card>
          <Card>
            <Link
              href={`${at}/domain/formalisation`}
              className="text-sm font-medium hover:text-accent"
            >
              Formal
            </Link>
            <p className="mt-1 text-sm text-muted">
              {domain.subdomains.length} subdomains, {domain.terms.length} terms, {agreed.length} of{' '}
              {domain.rules.length} rules agreed.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="The solution">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Link href={`${at}/solution/features`} className="text-sm font-medium hover:text-accent">
              Features
            </Link>
            <p className="mt-1 text-sm text-muted">
              {features.length} features, {counts.done} stories done, {counts.in_progress} in
              progress, {counts.to_do} to do.
            </p>
          </Card>
          <Card>
            <Link href={`${at}/solution/versions`} className="text-sm font-medium hover:text-accent">
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
            <Link href={storyHref(project.id, next)} className="text-sm hover:text-accent">
              As a <strong>{next.role}</strong>, I want to {next.intention}, so that {next.reason}.
            </Link>
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
