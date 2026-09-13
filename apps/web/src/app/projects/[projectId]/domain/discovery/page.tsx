import { isOpen } from '@supersoft/domain'
import type { Source } from '@supersoft/domain'
import { open } from '@/session'
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
  const { domain } = project
  const openQuestions = domain.questions.filter(isOpen)
  const answered = domain.questions.filter((question) => !isOpen(question))

  return (
    <Page title="The informal side">
      <Section title={`Sources — ${domain.sources.length}`}>
        {domain.sources.length === 0 && <Empty>Nothing has been kept yet.</Empty>}
        {domain.sources.map((source) => (
          <Card key={source.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm">
                  <span className="mr-2 text-muted">{marks[source.kind]}</span>
                  {source.title}
                </p>
                <p className="mt-1 text-sm text-muted">from {source.from}</p>
              </div>
              <Pill>{source.kind}</Pill>
            </div>
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={keepSource} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="title" placeholder="What it is — a recording, a film, a page of notes" />
              <Input name="from" placeholder="Who it came from" />
              <div className="flex items-center gap-2">
                <Select name="kind" options={['note', 'audio', 'video']} defaultValue="note" />
                <Button quiet>Keep it</Button>
              </div>
            </form>
          </Card>
        )}
        <p className="text-xs text-muted">
          A source is kept as it was given. What the maker understood from it belongs to the formal
          side, where the customer can contradict it.
        </p>
      </Section>

      <Section title={`Open questions — ${openQuestions.length}`}>
        {openQuestions.length === 0 && (
          <Empty>Nothing open. Either the project is small, or nobody is asking.</Empty>
        )}
        {openQuestions.map((question) => (
          <Card key={question.id}>
            <p className="text-sm">{question.asked}</p>
            {writable && (
              <form action={answer} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="id" value={question.id} />
                <Input name="answer" placeholder="What was decided, and by whom" />
                <Button quiet>Answer</Button>
              </form>
            )}
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={askQuestion} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="asked" placeholder="What does nobody know yet?" />
              <Button>Ask</Button>
            </form>
          </Card>
        )}
      </Section>

      <Section title="Answered">
        {answered.length === 0 && <Empty>No question has been answered yet.</Empty>}
        {answered.map((question) => (
          <Card key={question.id}>
            <p className="text-sm text-muted">{question.asked}</p>
            <p className="mt-1 text-sm">{question.answer}</p>
          </Card>
        ))}
      </Section>
    </Page>
  )
}
