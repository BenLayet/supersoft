import Link from 'next/link'
import { countByState, nextStory, openQuestions, versionInUse } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { StorySentence, storyHref } from '@/app/story-line'
import { Card, Page, Pill, Section } from '@/app/ui'

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, found } = await open(projectId)
  const t = await dictionary()
  const { domain, features, stories, versions } = project
  const at = `/projects/${project.id}`
  const openQ = openQuestions(domain.questions)
  const agreed = domain.rules.filter((rule) => rule.state === 'agreed')
  const counts = countByState(stories)
  const next = nextStory(stories)
  const live = versionInUse(versions)

  return (
    <Page title={project.name}>
      <Section title={t.project.whoTakesPart}>
        <Card>
          <ul className="space-y-1 text-sm">
            {project.participants.map((participant) => (
              <li key={participant.role} className="flex items-center gap-2">
                <span lang={project.language}>{participant.name}</span>
                <Pill>{t.roles[participant.role]}</Pill>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            {t.project.keptBy(found.owner)}{' '}
            {found.openToEveryone ? t.project.openToEveryone : t.project.openToRecognised}
          </p>
        </Card>
      </Section>

      <Section title={t.project.theDomain}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Link href={`${at}/domain/discovery`} className="text-sm font-medium hover:text-accent">
              {t.project.informal}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {t.project.informalSummary(domain.sources.length, openQ.length)}
            </p>
          </Card>
          <Card>
            <Link
              href={`${at}/domain/formalisation`}
              className="text-sm font-medium hover:text-accent"
            >
              {t.project.formal}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {t.project.formalSummary(
                domain.subdomains.length,
                domain.terms.length,
                agreed.length,
                domain.rules.length,
              )}
            </p>
          </Card>
        </div>
      </Section>

      <Section title={t.project.theSolution}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Link href={`${at}/solution/features`} className="text-sm font-medium hover:text-accent">
              {t.project.features}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {t.project.featuresSummary(features.length, counts.done, counts.in_progress, counts.to_do)}
            </p>
          </Card>
          <Card>
            <Link href={`${at}/solution/versions`} className="text-sm font-medium hover:text-accent">
              {t.project.versions}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {live ? t.project.inUse(live.name) : t.project.nothingInUse}
            </p>
          </Card>
        </div>
      </Section>

      <Section title={t.project.whatComesNext}>
        <Card>
          {next ? (
            <Link href={storyHref(project.id, next)} className="text-sm hover:text-accent">
              <StorySentence story={next} language={project.language} />
            </Link>
          ) : (
            <p className="text-sm italic text-muted">{t.project.nothingWaiting}</p>
          )}
        </Card>
      </Section>
    </Page>
  )
}
