import { isOpen } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { answer, askQuestion } from '../actions'
import { Button, Card, Empty, Input, Page, Section } from '../ui'

export default async function DiscoveryPage() {
  const { specification } = await inMemoryProjectStore.load()
  const open = specification.questions.filter(isOpen)
  const answered = specification.questions.filter((question) => !isOpen(question))

  return (
    <Page
      title="Discovery"
      lead="What the project knows it does not know. Building with open questions is normal; not knowing what they are is not."
    >
      <Section title="Ask">
        <Card>
          <form action={askQuestion} className="flex flex-col gap-2 sm:flex-row">
            <Input name="asked" placeholder="What does nobody know yet?" />
            <Button>Write it down</Button>
          </form>
        </Card>
      </Section>

      <Section title={`Open — ${open.length}`}>
        {open.length === 0 && (
          <Empty>Nothing open. Either the project is small, or nobody is asking.</Empty>
        )}
        {open.map((question) => (
          <Card key={question.id}>
            <p className="text-sm">{question.asked}</p>
            <form action={answer} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="id" value={question.id} />
              <Input name="answer" placeholder="What was decided, and by whom" />
              <Button quiet>Answer</Button>
            </form>
          </Card>
        ))}
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
