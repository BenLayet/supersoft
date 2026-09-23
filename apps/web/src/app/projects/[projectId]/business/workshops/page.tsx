import { workshopsByDate } from '@supersoft/domain'
import type { Workshop } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { keepWorkshop } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

const marks: Record<Workshop['kind'], string> = { note: '✎', audio: '♪', video: '▶' }

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
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted">{t.informal.heldOn(workshop.date)}</p>
                <p className="mt-1 text-sm" lang={project.language}>
                  <span className="mr-2 text-muted">{marks[workshop.kind]}</span>
                  {workshop.location && workshop.kind === 'note' ? (
                    <a href={workshop.location} className="hover:text-accent">
                      {workshop.title}
                    </a>
                  ) : (
                    workshop.title
                  )}
                </p>
                <p className="mt-1 text-sm text-muted">{t.informal.heldWith(workshop.from)}</p>
              </div>
              <Pill>{t.workshopKinds[workshop.kind]}</Pill>
            </div>
            {workshop.location && workshop.kind === 'video' && (
              <video
                controls
                preload="metadata"
                src={workshop.location}
                className="mt-3 w-full rounded"
              />
            )}
            {workshop.location && workshop.kind === 'audio' && (
              <audio controls preload="metadata" src={workshop.location} className="mt-3 w-full" />
            )}
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={keepWorkshop} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="title" placeholder={t.informal.whatItIs} />
              <Input name="from" placeholder={t.informal.whoWith} />
              <div className="flex items-center gap-2">
                <Input type="date" name="date" placeholder={t.informal.whenHeld} />
                <Select name="kind" options={t.workshopKinds} defaultValue="note" />
                <Button quiet>{t.informal.keepIt}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
