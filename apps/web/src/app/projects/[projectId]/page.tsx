import Link from 'next/link'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { rewriteScope } from '@/app/actions'
import { Button, Card, Empty, Page, Pill, Section, Textarea } from '@/app/ui'

function PartCard({ href, title }: { href: string; title: string }) {
  return (
    <Card>
      <Link href={href} className="text-sm font-medium hover:text-accent">
        {title}
      </Link>
    </Card>
  )
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, found, writable } = await open(projectId)
  const t = await dictionary()
  const at = `/projects/${project.id}`

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
            {found.isPublic ? t.publicProject : t.privateProject}
          </p>
        </Card>
      </Section>

      <Section title={t.nav.business}>
        <div className="grid gap-3 sm:grid-cols-2">
          <PartCard href={`${at}/business/sources`} title={t.nav.sources} />
          <PartCard href={`${at}/business/subdomains`} title={t.nav.subdomains} />
        </div>
      </Section>

      <Section title={t.nav.features}>
        <PartCard href={`${at}/features`} title={t.nav.features} />
      </Section>

      <Section title={t.nav.versions}>
        <PartCard href={`${at}/versions`} title={t.versions.title} />
      </Section>
    </Page>
  )
}
