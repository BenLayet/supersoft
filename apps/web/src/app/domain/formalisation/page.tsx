import Link from 'next/link'
import { rulesOf, termsOf } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { addSubdomain } from '../../actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '../../ui'

export default async function FormalisationPage() {
  const { domain } = await inMemoryProjectStore.load()

  return (
    <Page title="The formal side">
      <Section title={`Subdomains — ${domain.subdomains.length}`}>
        {domain.subdomains.length === 0 && <Empty>The business has not been cut up yet.</Empty>}
        {domain.subdomains.map((subdomain) => {
          const terms = termsOf(subdomain, domain.terms)
          const rules = rulesOf(subdomain, domain.rules)
          const agreed = rules.filter((rule) => rule.state === 'agreed').length
          return (
            <Card key={subdomain.id}>
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/domain/formalisation/${subdomain.id}`}
                  className="text-sm font-medium hover:text-accent"
                >
                  {subdomain.name}
                </Link>
                <Pill tone={rules.length > 0 && agreed === rules.length ? 'accent' : 'plain'}>
                  {agreed} of {rules.length} agreed
                </Pill>
              </div>
              <p className="mt-2 text-sm text-muted">{subdomain.description}</p>
              <p className="mt-2 text-sm text-muted">
                {terms.length} terms, {rules.length} rules.
              </p>
            </Card>
          )
        })}
        <Card>
          <form action={addSubdomain} className="flex flex-col gap-2">
            <Input name="name" placeholder="One part of the business, named as its people name it" />
            <Input name="description" placeholder="What it is, in business terms only" />
            <div>
              <Button quiet>Add a subdomain</Button>
            </div>
          </form>
        </Card>
        <p className="text-xs text-muted">
          A subdomain is described in business terms only. What the application does about it is the
          solution, and it is written elsewhere.
        </p>
      </Section>
    </Page>
  )
}
