import Link from 'next/link'
import { openQuestions, questionsOf, rulesOf, termsOf } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { addDomain } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/app/ui'

export default async function FormalisationPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const { business } = project

  return (
    <Page title={t.formal.title}>
      <Section title={t.formal.domains(business.domains.length)}>
        {business.domains.length === 0 && <Empty>{t.formal.notCut}</Empty>}
        {business.domains.map((domain) => {
          const terms = termsOf(domain, business.terms)
          const rules = rulesOf(domain, business.rules)
          const agreed = rules.filter((rule) => rule.state === 'agreed').length
          const stillOpen = openQuestions(questionsOf(domain, business.questions)).length
          return (
            <Card key={domain.id}>
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/projects/${project.id}/business/domains/${domain.id}`}
                  className="text-sm font-medium hover:text-accent"
                  lang={project.language}
                >
                  {domain.name}
                </Link>
                <Pill tone={rules.length > 0 && agreed === rules.length ? 'accent' : 'plain'}>
                  {t.formal.agreedOf(agreed, rules.length)}
                </Pill>
              </div>
              <p className="mt-2 text-sm text-muted" lang={project.language}>
                {domain.description}
              </p>
              <p className="mt-2 text-sm text-muted">
                {t.formal.counts(terms.length, rules.length, stillOpen)}
              </p>
            </Card>
          )
        })}
        {writable && (
          <Card>
            <form action={addDomain} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.formal.domainName} />
              <Input name="description" placeholder={t.formal.domainDescription} />
              <div>
                <Button quiet>{t.formal.addDomain}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
