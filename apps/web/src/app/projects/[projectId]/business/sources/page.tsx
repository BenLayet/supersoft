import { isOpen } from '@supersoft/domain'
import type { Source } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { answer, askQuestion, keepSource } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

const marks: Record<Source['kind'], string> = { note: '✎', audio: '♪', video: '▶' }

export default async function DiscoveryPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const { domain } = project
  const openQuestions = domain.questions.filter(isOpen)
  const answered = domain.questions.filter((question) => !isOpen(question))

  return (
    <Page title={t.informal.title}>
      <Section title={t.informal.sources(domain.sources.length)}>
        {domain.sources.length === 0 && <Empty>{t.informal.nothingKept}</Empty>}
        {domain.sources.map((source) => (
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

      <Section title={t.informal.openQuestions(openQuestions.length)}>
        {openQuestions.length === 0 && (
          <Empty>{t.informal.nothingOpen}</Empty>
        )}
        {openQuestions.map((question) => (
          <Card key={question.id}>
            <p className="text-sm" lang={project.language}>
              {question.asked}
            </p>
            {writable && (
              <form action={answer} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="id" value={question.id} />
                <Input name="answer" placeholder={t.informal.whatWasDecided} />
                <Button quiet>{t.informal.answer}</Button>
              </form>
            )}
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={askQuestion} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="asked" placeholder={t.informal.whatNobodyKnows} />
              <Button>{t.informal.ask}</Button>
            </form>
          </Card>
        )}
      </Section>

      <Section title={t.informal.answered}>
        {answered.length === 0 && <Empty>{t.informal.noneAnswered}</Empty>}
        {answered.map((question) => (
          <Card key={question.id}>
            <p className="text-sm text-muted" lang={project.language}>{question.asked}</p>
            <p className="mt-1 text-sm" lang={project.language}>
              {question.answer}
            </p>
          </Card>
        ))}
      </Section>
    </Page>
  )
}
