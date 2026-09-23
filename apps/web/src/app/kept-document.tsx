import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { WorkshopDocument } from '@supersoft/domain'
import { MarkdownText } from './markdown'

const kept = path.join(process.cwd(), 'public')

const pathOf = (location: string): string => location.split(/[?#]/)[0] ?? ''

export const isMarkdown = (location: string): boolean => /\.md$/i.test(pathOf(location))
const isText = (location: string): boolean => /\.txt$/i.test(pathOf(location))

/**
 * Reads a document kept among the prototype's own files. Nothing is fetched
 * from an address someone typed: a document kept elsewhere is opened there.
 */
export async function readKept(location: string): Promise<string | undefined> {
  if (!location.startsWith('/')) return undefined
  const file = path.join(kept, decodeURIComponent(pathOf(location)))
  if (!file.startsWith(kept + path.sep)) return undefined
  return readFile(file, 'utf8').catch(() => undefined)
}

/**
 * A document that can be read where it is listed: its own text when it was
 * written in the project, Markdown shown as it reads, plain text shown exactly
 * as it was kept. Anything else is left to be opened where it is kept.
 */
export async function KeptDocument({ document }: { document: WorkshopDocument }) {
  const { location, text } = document
  if (text !== undefined)
    return (
      <div className="mt-3">
        <MarkdownText source={text} location={location} />
      </div>
    )
  if (!location || (!isMarkdown(location) && !isText(location))) return null
  const source = await readKept(location)
  if (source === undefined) return null
  if (isText(location))
    return (
      <pre className="mt-3 max-h-96 overflow-auto rounded-md border border-rule bg-paper px-4 py-3 font-sans text-sm whitespace-pre-wrap">
        {source}
      </pre>
    )
  return (
    <div className="mt-3">
      <MarkdownText source={source} location={location} />
    </div>
  )
}
