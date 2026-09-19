import type { Prototype } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import type { Dictionary } from '@/i18n'
import { addPrototype, validatePrototype } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/app/ui'

function PrototypeCard({
  prototype,
  projectId,
  language,
  writable,
  t,
}: {
  prototype: Prototype
  projectId: string
  language: string
  writable: boolean
  t: Dictionary
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium" lang={language}>
            {prototype.name}
          </p>
          {prototype.location && (
            <a href={prototype.location} className="mt-1 inline-block text-sm text-muted hover:text-accent">
              {t.prototypes.tryIt}
            </a>
          )}
        </div>
        <Pill tone={prototype.state === 'validated' ? 'accent' : 'warn'}>
          {t.prototypeStates[prototype.state]}
        </Pill>
      </div>
      {writable && prototype.state === 'being_tried' && (
        <form action={validatePrototype} className="mt-3">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="id" value={prototype.id} />
          <Button>{t.prototypes.validate}</Button>
        </form>
      )}
    </Card>
  )
}

export default async function PrototypesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()
  const beingTried = project.prototypes.filter((prototype) => prototype.state === 'being_tried')
  const validated = project.prototypes.filter((prototype) => prototype.state === 'validated')
  const card = (prototype: Prototype) => (
    <PrototypeCard
      key={prototype.id}
      prototype={prototype}
      projectId={project.id}
      language={project.language}
      writable={writable}
      t={t}
    />
  )

  return (
    <Page title={t.prototypes.title}>
      <Section title={t.prototypes.beingTried(beingTried.length)}>
        {beingTried.length === 0 && <Empty>{t.prototypes.nothingToTry}</Empty>}
        {beingTried.map(card)}
        {writable && (
          <Card>
            <form action={addPrototype} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.prototypes.name} />
              <Input name="location" placeholder={t.prototypes.location} required={false} />
              <div>
                <Button quiet>{t.prototypes.add}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>

      <Section title={t.prototypes.validated(validated.length)}>
        {validated.length === 0 && <Empty>{t.prototypes.noneValidated}</Empty>}
        {validated.map(card)}
        <p className="text-xs text-muted">{t.prototypes.appliesTheRules}</p>
      </Section>
    </Page>
  )
}
