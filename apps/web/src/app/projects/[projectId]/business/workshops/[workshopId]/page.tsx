import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { WorkshopDocument } from '@supersoft/domain'
import { open } from '@/session'
import { dictionaryIn } from '@/i18n'
import { keepDocument, writeDocument } from '@/app/actions'
import { KeptDocument, isMarkdown, readKept } from '@/app/kept-document'
import { MarkdownEditor } from '@/app/markdown-editor'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

/** What can be written in the project, when it is kept nowhere yet. */
const written: readonly WorkshopDocument['kind'][] = ['notes', 'report', 'transcript']

/** A document whose text can be written or corrected here. */
const canWrite = (document: WorkshopDocument): boolean =>
  document.text !== undefined ||
  (document.location ? isMarkdown(document.location) : written.includes(document.kind))

/**
 * A recording is played where it is read, and a written document is shown
 * there when it can be; anything else is opened where it is kept.
 */
function Kept({ document, open }: { document: WorkshopDocument; open: string }) {
  if (document.location && document.text === undefined) {
    if (document.kind === 'video')
      return <video controls preload="none" src={document.location} className="mt-3 w-full rounded" />
    if (document.kind === 'audio')
      return <audio controls preload="none" src={document.location} className="mt-3 w-full" />
  }
  return (
    <>
      <KeptDocument document={document} />
      {document.location && document.text === undefined && (
        <a href={document.location} className="mt-2 inline-block text-sm text-accent hover:underline">
          {open} →
        </a>
      )}
    </>
  )
}

export default async function WorkshopPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; workshopId: string }>
  searchParams: Promise<{ correct?: string | string[] }>
}) {
  const { projectId, workshopId } = await params
  const { correct } = await searchParams
  const { project, writable } = await open(projectId)
  const t = await dictionaryIn(project.language)
  const workshop = project.business.workshops.find((one) => one.id === workshopId)
  if (!workshop) notFound()
  const here = `/projects/${project.id}/business/workshops/${workshop.id}`

  return (
    <Page
      title={workshop.title}
      back={{ href: `/projects/${project.id}/business/workshops`, label: t.informal.title }}
    >
      <p className="-mt-6 text-sm text-muted">{t.informal.heldOn(workshop.date)}</p>

      <Section title={t.informal.documents(workshop.documents.length)}>
        {workshop.documents.length === 0 && <Empty>{t.informal.noDocument}</Empty>}
        {await Promise.all(
          workshop.documents.map(async (document) => {
            const writing = writable && canWrite(document)
            const editing = writing && correct === document.id
            const title = (
              <span className="text-sm" lang={project.language}>
                {document.title}
              </span>
            )
            const kind = <Pill>{t.documentKinds[document.kind]}</Pill>
            // Correcting is possible, never pressed on anyone: a quiet link, once the document is open.
            const correctLink = writing && (
              <Link
                href={`${here}?correct=${document.id}#${document.id}`}
                className="text-xs text-muted hover:text-ink"
              >
                {document.text === undefined && !document.location
                  ? t.informal.writeIt
                  : t.informal.correct}
              </Link>
            )

            // A document kept nowhere, with nothing written, has nothing to unfold.
            if (!editing && !document.location && document.text === undefined)
              return (
                <Card key={document.id}>
                  <div id={document.id} className="flex items-start justify-between gap-3">
                    {title}
                    <span className="flex items-center gap-3">
                      {correctLink}
                      {kind}
                    </span>
                  </div>
                </Card>
              )

            return (
              <Card key={document.id}>
                <details id={document.id} className="group" open={editing}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="text-muted transition-transform group-open:rotate-90"
                      >
                        ›
                      </span>
                      {title}
                    </span>
                    {kind}
                  </summary>
                  {editing ? (
                    <form action={writeDocument} className="mt-3 flex flex-col gap-2">
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="workshopId" value={workshop.id} />
                      <input type="hidden" name="documentId" value={document.id} />
                      <MarkdownEditor
                        name="text"
                        defaultValue={
                          document.text ??
                          (document.location ? await readKept(document.location) : undefined) ??
                          ''
                        }
                        location={document.location}
                        labels={{
                          write: t.informal.write,
                          preview: t.informal.preview,
                          placeholder: t.informal.writtenIn,
                          empty: t.informal.nothingWritten,
                        }}
                      />
                      <div className="flex items-center gap-3">
                        <Button>{t.informal.save}</Button>
                        <Link
                          href={`${here}#${document.id}`}
                          className="text-sm text-muted hover:text-ink"
                        >
                          {t.informal.cancel}
                        </Link>
                      </div>
                    </form>
                  ) : (
                    <>
                      <Kept document={document} open={t.informal.open} />
                      {correctLink && <div className="mt-2 text-right">{correctLink}</div>}
                    </>
                  )}
                </details>
              </Card>
            )
          }),
        )}
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
