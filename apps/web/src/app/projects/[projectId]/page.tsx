import Link from 'next/link'
import { countByState, nextStory, openQuestions, versionInUse } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { StorySentence, storyHref } from '@/app/story-line'
import { Card, Page, Pill, Section } from '@/app/ui'

function StepCard({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <Link href={href} className="text-sm font-medium hover:text-accent">
        {title}
      </Link>
      <div className="mt-1 text-sm text-muted">{children}</div>
    </Card>
  )
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, found } = await open(projectId)
  const t = await dictionary()
  const { domain, features, stories, prototypes, versions } = project
  const at = `/projects/${project.id}`
  const openQ = openQuestions(domain.questions)
  const agreed = domain.rules.filter((rule) => rule.state === 'agreed')
  const counts = countByState(stories)
  const validated = prototypes.filter((prototype) => prototype.state === 'validated')
  const next = nextStory(stories)
  const live = versionInUse(versions)

  return (
    <Page title={project.name}>
      <Section title={t.overview.whoTakesPart}>
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
            {t.overview.keptBy(found.owner)}{' '}
            {found.openToEveryone ? t.overview.openToEveryone : t.overview.openToRecognised}
          </p>
        </Card>
      </Section>

      <Section title={`1 — ${t.steps.understand}`}>
        <StepCard href={`${at}/understand/scope`} title={t.nav.scope}>
          <p lang={project.language}>{project.scope || t.scope.noScope}</p>
        </StepCard>
        <div className="grid gap-3 sm:grid-cols-2">
          <StepCard href={`${at}/understand/sources`} title={t.nav.sources}>
            {t.overview.sourcesSummary(domain.sources.length, openQ.length)}
          </StepCard>
          <StepCard href={`${at}/understand/features`} title={t.nav.features}>
            {t.overview.featuresSummary(features.length, counts.done, counts.in_progress, counts.to_do)}
          </StepCard>
        </div>
      </Section>

      <Section title={`2 — ${t.steps.describe}`}>
        <StepCard href={`${at}/describe`} title={t.overview.partsOfTheBusiness}>
          {t.overview.describeSummary(
            domain.subdomains.length,
            domain.terms.length,
            agreed.length,
            domain.rules.length,
          )}
        </StepCard>
      </Section>

      <Section title={`3 — ${t.steps.prototype}`}>
        <StepCard href={`${at}/prototype`} title={t.prototypes.title}>
          {t.overview.prototypesSummary(prototypes.length - validated.length, validated.length)}
        </StepCard>
      </Section>

      <Section title={`4 — ${t.steps.versions}`}>
        <StepCard href={`${at}/versions`} title={t.versions.title}>
          {live ? t.overview.inUse(live.name) : t.overview.nothingInUse}
        </StepCard>
      </Section>

      <Section title={t.overview.whatComesNext}>
        <Card>
          {next ? (
            <Link href={storyHref(project.id, next)} className="text-sm hover:text-accent">
              <StorySentence story={next} language={project.language} />
            </Link>
          ) : (
            <p className="text-sm italic text-muted">{t.overview.nothingWaiting}</p>
          )}
        </Card>
      </Section>
    </Page>
  )
}
