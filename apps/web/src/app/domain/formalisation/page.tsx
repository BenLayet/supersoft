import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { agreeRule, defineTerm, restateRule, writeRule } from '../../actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '../../ui'

export default async function FormalisationPage() {
  const { domain } = await inMemoryProjectStore.load()
  const agreed = domain.rules.filter((rule) => rule.state === 'agreed').length

  return (
    <Page title="The formal side">
      <Section title={`Lexicon — ${domain.terms.length}`}>
        {domain.terms.length === 0 && <Empty>No concept has been named yet.</Empty>}
        {domain.terms.map((term) => (
          <Card key={term.name}>
            <p className="text-sm font-medium">{term.name}</p>
            <p className="mt-1 text-sm text-muted">{term.definition}</p>
          </Card>
        ))}
        <Card>
          <form action={defineTerm} className="flex flex-col gap-2">
            <Input name="name" placeholder="One concept, one name" />
            <Input name="definition" placeholder="In the customer's own words" />
            <div>
              <Button quiet>Define</Button>
            </div>
          </form>
        </Card>
      </Section>

      <Section title={`Description — ${agreed} of ${domain.rules.length} agreed`}>
        {domain.rules.map((rule) => (
          <Card key={rule.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm">{rule.statement}</p>
              <Pill tone={rule.state === 'agreed' ? 'accent' : 'warn'}>{rule.state}</Pill>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              {rule.state === 'proposed' && (
                <form action={agreeRule}>
                  <input type="hidden" name="id" value={rule.id} />
                  <Button>Agree</Button>
                </form>
              )}
              <form action={restateRule} className="flex flex-1 flex-col gap-2 sm:flex-row">
                <input type="hidden" name="id" value={rule.id} />
                <Input name="statement" placeholder="Rewrite it" defaultValue={rule.statement} />
                <Button quiet>Rewrite</Button>
              </form>
            </div>
          </Card>
        ))}
        <Card>
          <form action={writeRule} className="flex flex-col gap-2 sm:flex-row">
            <Input name="statement" placeholder="One sentence the customer can confirm or deny" />
            <Button quiet>Write it down</Button>
          </form>
        </Card>
        <p className="text-xs text-muted">
          Rewriting an agreed rule makes it proposed again: agreement is given to a sentence, not to
          a subject.
        </p>
      </Section>
    </Page>
  )
}
