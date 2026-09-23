import { notFound } from 'next/navigation'
import { rulesOf, termsOf } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { agreeRule, defineTerm, restateRule, writeRule } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/app/ui'

export default async function DomainPage({
  params,
}: {
  params: Promise<{ projectId: string; domainId: string }>
}) {
  const { projectId, domainId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const { business } = project
  const domain = business.domains.find((one) => one.id === domainId)
  if (!domain) notFound()

  const terms = termsOf(domain, business.terms)
  const rules = rulesOf(domain, business.rules)
  const agreed = rules.filter((rule) => rule.state === 'agreed').length

  return (
    <Page
      title={domain.name}
      back={{ href: `/projects/${project.id}/business/domains`, label: t.formal.title }}
    >
      <Section title={t.formal.whatThisPartIs}>
        <Card>
          <p className="text-sm" lang={project.language}>
            {domain.description}
          </p>
        </Card>
      </Section>

      <Section title={t.formal.lexicon(terms.length)}>
        {terms.length === 0 && <Empty>{t.formal.noTerm}</Empty>}
        {terms.map((term) => (
          <Card key={term.name}>
            <div lang={project.language}>
              <p className="text-sm font-medium">{term.name}</p>
              <p className="mt-1 text-sm text-muted">{term.definition}</p>
            </div>
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={defineTerm} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="domainId" value={domain.id} />
              <Input name="name" placeholder={t.formal.termName} />
              <Input name="definition" placeholder={t.formal.termDefinition} />
              <div>
                <Button quiet>{t.formal.define}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>

      <Section title={t.formal.description(agreed, rules.length)}>
        {rules.length === 0 && <Empty>{t.formal.noRule}</Empty>}
        {rules.map((rule) => (
          <Card key={rule.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm" lang={project.language}>
                {rule.statement}
              </p>
              <Pill tone={rule.state === 'agreed' ? 'accent' : 'warn'}>{t.ruleStates[rule.state]}</Pill>
            </div>
            {writable && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                {rule.state === 'proposed' && (
                  <form action={agreeRule}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="id" value={rule.id} />
                    <Button>{t.formal.agree}</Button>
                  </form>
                )}
                <form action={restateRule} className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="id" value={rule.id} />
                  <Input name="statement" placeholder={t.formal.rewriteIt} defaultValue={rule.statement} />
                  <Button quiet>{t.formal.rewrite}</Button>
                </form>
              </div>
            )}
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={writeRule} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="domainId" value={domain.id} />
              <Input name="statement" placeholder={t.formal.ruleStatement} />
              <Button quiet>{t.formal.writeItDown}</Button>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
