import Link from 'next/link'
import { countByState, nextStory, openQuestions, versionInUse } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { rewriteScope } from '@/app/actions'
import { StorySentence, storyHref } from '@/app/story-line'
import { Button, Card, Empty, Page, Pill, Section, Textarea } from '@/app/ui'

function PartCard({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <Link href={href} className="text-sm font-medium hover:text-accent">
        {title}
      </Link>
      <div className="mt-1 space-y-1 text-sm text-muted">{children}</div>
    </Card>
  )
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, found, writable } = await open(projectId)
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
      <Section title={t.scope.title}>
        <Card>
          {project.scope ? (
            <p className="whitespace-pre-line text-sm" lang={project.language}>
              {project.scope}
            </p>
          ) : (
            <Empty>{t.scope.noScope}</Empty>
          )}
          {writable && (
            <details className="mt-3 border-t border-rule pt-3">
              <summary className="cursor-pointer text-sm text-muted hover:text-ink">
                {t.scope.rewrite}
              </summary>
              <form action={rewriteScope} className="mt-2 flex flex-col gap-2">
                <input type="hidden" name="projectId" value={project.id} />
                <Textarea name="scope" placeholder={t.scope.placeholder} defaultValue={project.scope} />
                <div>
                  <Button quiet>{t.scope.rewrite}</Button>
                </div>
              </form>
            </details>
          )}
        </Card>
        <p className="text-xs text-muted">{t.scope.shortOnPurpose}</p>
      </Section>

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

      <Section title={t.nav.business}>
        <div className="grid gap-3 sm:grid-cols-2">
          <PartCard href={`${at}/business/sources`} title={t.nav.sources}>
            {t.overview.sourcesSummary(domain.sources.length, openQ.length)}
          </PartCard>
          <PartCard href={`${at}/business/subdomains`} title={t.nav.subdomains}>
            {t.overview.subdomainsSummary(
              domain.subdomains.length,
              domain.terms.length,
              agreed.length,
              domain.rules.length,
            )}
          </PartCard>
        </div>
      </Section>

      <Section title={t.nav.features}>
        <PartCard href={`${at}/features`} title={t.nav.features}>
          <p>{t.overview.featuresSummary(features.length, counts.done, counts.in_progress, counts.to_do)}</p>
          <p>{t.overview.prototypesSummary(prototypes.length - validated.length, validated.length)}</p>
        </PartCard>
      </Section>

      <Section title={t.nav.versions}>
        <PartCard href={`${at}/versions`} title={t.versions.title}>
          {live ? t.overview.inUse(live.name) : t.overview.nothingInUse}
        </PartCard>
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
