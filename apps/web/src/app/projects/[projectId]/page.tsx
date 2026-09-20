import { open } from '@/session'
import { dictionary } from '@/i18n'
import { rewriteScope } from '@/app/actions'
import { Button, Card, Empty, Page, Pill, Section, Textarea } from '@/app/ui'

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, found, writable } = await open(projectId)
  const t = await dictionary()

  return (
    <Page>
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
        </Card>
      </Section>

      <Section title={t.overview.address}>
        <Card>
          <a
            href={found.address}
            target="_blank"
            rel="noreferrer"
            className="block text-sm hover:text-accent"
          >
            {found.address}
          </a>
          <p className="mt-1 text-sm text-muted">
            {found.isPublic ? t.publicProject : t.privateProject}
          </p>
        </Card>
      </Section>
    </Page>
  )
}
