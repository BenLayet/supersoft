import { open } from '@/session'
import { dictionary } from '@/i18n'
import { rewriteScope } from '@/app/actions'
import { Button, Card, Empty, Page, Section, Textarea } from '@/app/ui'

export default async function ScopePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()

  return (
    <Page title={t.scope.title}>
      <Section title={t.steps.understand}>
        <Card>
          {project.scope ? (
            <p className="text-sm whitespace-pre-line" lang={project.language}>
              {project.scope}
            </p>
          ) : (
            <Empty>{t.scope.noScope}</Empty>
          )}
        </Card>
        {writable && (
          <Card>
            <form action={rewriteScope} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Textarea name="scope" placeholder={t.scope.placeholder} defaultValue={project.scope} />
              <div>
                <Button quiet>{t.scope.rewrite}</Button>
              </div>
            </form>
          </Card>
        )}
        <p className="text-xs text-muted">{t.scope.shortOnPurpose}</p>
      </Section>
    </Page>
  )
}
