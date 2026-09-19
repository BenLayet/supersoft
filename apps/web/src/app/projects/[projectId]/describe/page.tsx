import Link from 'next/link'
import { rulesOf, termsOf } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { addSubdomain } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/app/ui'

export default async function FormalisationPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()
  const { domain } = project

  return (
    <Page title={t.formal.title}>
      <Section title={t.formal.subdomains(domain.subdomains.length)}>
        {domain.subdomains.length === 0 && <Empty>{t.formal.notCut}</Empty>}
        {domain.subdomains.map((subdomain) => {
          const terms = termsOf(subdomain, domain.terms)
          const rules = rulesOf(subdomain, domain.rules)
          const agreed = rules.filter((rule) => rule.state === 'agreed').length
          return (
            <Card key={subdomain.id}>
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/projects/${project.id}/describe/${subdomain.id}`}
                  className="text-sm font-medium hover:text-accent"
                  lang={project.language}
                >
                  {subdomain.name}
                </Link>
                <Pill tone={rules.length > 0 && agreed === rules.length ? 'accent' : 'plain'}>
                  {t.formal.agreedOf(agreed, rules.length)}
                </Pill>
              </div>
              <p className="mt-2 text-sm text-muted" lang={project.language}>
                {subdomain.description}
              </p>
              <p className="mt-2 text-sm text-muted">
                {t.formal.counts(terms.length, rules.length)}
              </p>
            </Card>
          )
        })}
        {writable && (
          <Card>
            <form action={addSubdomain} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.formal.subdomainName} />
              <Input name="description" placeholder={t.formal.subdomainDescription} />
              <div>
                <Button quiet>{t.formal.addSubdomain}</Button>
              </div>
            </form>
          </Card>
        )}
        <p className="text-xs text-muted">
          {t.formal.businessTermsOnly}
        </p>
      </Section>
    </Page>
  )
}
