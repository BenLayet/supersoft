import type { Source } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { keepSource } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

const marks: Record<Source['kind'], string> = { note: '✎', audio: '♪', video: '▶' }

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const { business } = project

  return (
    <Page title={t.informal.title}>
      <Section title={t.informal.sources(business.sources.length)}>
        {business.sources.length === 0 && <Empty>{t.informal.nothingKept}</Empty>}
        {business.sources.map((source) => (
          <Card key={source.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm" lang={project.language}>
                  <span className="mr-2 text-muted">{marks[source.kind]}</span>
                  {source.location && source.kind === 'note' ? (
                    <a href={source.location} className="hover:text-accent">
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                </p>
                <p className="mt-1 text-sm text-muted">{t.informal.from(source.from)}</p>
              </div>
              <Pill>{t.sourceKinds[source.kind]}</Pill>
            </div>
            {source.location && source.kind === 'video' && (
              <video controls preload="metadata" src={source.location} className="mt-3 w-full rounded" />
            )}
            {source.location && source.kind === 'audio' && (
              <audio controls preload="metadata" src={source.location} className="mt-3 w-full" />
            )}
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={keepSource} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="title" placeholder={t.informal.whatItIs} />
              <Input name="from" placeholder={t.informal.whoFrom} />
              <div className="flex items-center gap-2">
                <Select name="kind" options={t.sourceKinds} defaultValue="note" />
                <Button quiet>{t.informal.keepIt}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
