import Link from 'next/link'
import { workshopsByDate } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { keepWorkshop } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/app/ui'

export default async function WorkshopsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const held = workshopsByDate(project.business.workshops)

  return (
    <Page title={t.informal.title}>
      <Section title={t.informal.workshops(held.length)}>
        {held.length === 0 && <Empty>{t.informal.nothingKept}</Empty>}
        {held.map((workshop) => (
          <Card key={workshop.id}>
            <p className="text-sm text-muted">{t.informal.heldOn(workshop.date)}</p>
            <Link
              href={`/projects/${project.id}/business/workshops/${workshop.id}`}
              className="mt-1 block text-sm font-medium hover:text-accent"
              lang={project.language}
            >
              {workshop.title}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">
                {t.informal.documentCount(workshop.documents.length)}
              </span>
              {[...new Set(workshop.documents.map((document) => document.kind))].map((kind) => (
                <Pill key={kind}>{t.documentKinds[kind]}</Pill>
              ))}
            </div>
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={keepWorkshop} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input type="date" name="date" placeholder={t.informal.whenHeld} />
              <Input name="title" placeholder={t.informal.workshopName} />
              <Button quiet>{t.informal.addWorkshop}</Button>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
