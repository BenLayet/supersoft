import { notFound } from 'next/navigation'
import type { WorkshopDocument } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { keepDocument } from '@/app/actions'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

/** A recording is played where it is read; anything else is opened where it is kept. */
function Kept({ document, open }: { document: WorkshopDocument; open: string }) {
  if (!document.location) return null
  if (document.kind === 'video')
    return (
      <video
        controls
        preload="metadata"
        src={document.location}
        className="mt-3 w-full rounded"
      />
    )
  if (document.kind === 'audio')
    return <audio controls preload="metadata" src={document.location} className="mt-3 w-full" />
  return (
    <a href={document.location} className="mt-2 inline-block text-sm text-accent hover:underline">
      {open} →
    </a>
  )
}

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ projectId: string; workshopId: string }>
}) {
  const { projectId, workshopId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const workshop = project.business.workshops.find((one) => one.id === workshopId)
  if (!workshop) notFound()

  return (
    <Page
      title={workshop.title}
      back={{ href: `/projects/${project.id}/business/workshops`, label: t.informal.title }}
    >
      <p className="-mt-6 text-sm text-muted">{t.informal.heldOn(workshop.date)}</p>

      <Section title={t.informal.documents(workshop.documents.length)}>
        {workshop.documents.length === 0 && <Empty>{t.informal.noDocument}</Empty>}
        {workshop.documents.map((document) => (
          <Card key={document.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm" lang={project.language}>
                {document.title}
              </p>
              <Pill>{t.documentKinds[document.kind]}</Pill>
            </div>
            <Kept document={document} open={t.informal.open} />
          </Card>
        ))}
        {writable && (
          <Card>
            <form action={keepDocument} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="workshopId" value={workshop.id} />
              <Input name="title" placeholder={t.informal.documentTitle} />
              <Input name="location" placeholder={t.informal.documentLocation} required={false} />
              <div className="flex items-center gap-2">
                <Select name="kind" options={t.documentKinds} defaultValue="notes" />
                <Button quiet>{t.informal.addDocument}</Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Page>
  )
}
