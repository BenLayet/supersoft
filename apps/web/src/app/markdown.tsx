import { readFile } from 'node:fs/promises'
import path from 'node:path'
import Markdown, { defaultUrlTransform } from 'react-markdown'
import type { Components } from 'react-markdown'

const kept = path.join(process.cwd(), 'public')

const pathOf = (location: string): string => location.split(/[?#]/)[0] ?? ''

export const isMarkdown = (location: string): boolean => /\.md$/i.test(pathOf(location))

/**
 * Reads a document kept among the prototype's own files. Nothing is fetched
 * from an address someone typed: a document kept elsewhere is opened there.
 */
async function read(location: string): Promise<string | undefined> {
  if (!location.startsWith('/')) return undefined
  const file = path.join(kept, decodeURIComponent(pathOf(location)))
  if (!file.startsWith(kept + path.sep)) return undefined
  return readFile(file, 'utf8').catch(() => undefined)
}

/** A link inside a document points next to the document, wherever it is kept. */
const besides = (location: string) => (url: string) => {
  const safe = defaultUrlTransform(url)
  if (!safe || /^[a-z][a-z0-9+.-]*:/i.test(safe) || safe.startsWith('#')) return safe
  const resolved = new URL(safe, `http://kept${location}`)
  return `${resolved.pathname}${resolved.search}${resolved.hash}`
}

const components: Components = {
  h1: ({ children }) => <h1 className="mt-5 text-lg font-semibold tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-5 text-base font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-4 text-sm font-semibold">{children}</h3>,
  p: ({ children }) => <p className="mt-2">{children}</p>,
  ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="[&>ol]:mt-1 [&>ul]:mt-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-3 border-l-2 border-accent pl-3 text-muted">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-accent hover:underline">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  code: ({ children }) => <code className="rounded bg-paper px-1 text-xs">{children}</code>,
  hr: () => <hr className="mt-4 border-rule" />,
}

/** A document written in Markdown, shown as it reads rather than as it is typed. */
export async function MarkdownDocument({ location }: { location: string }) {
  const source = await read(location)
  if (source === undefined) return null
  return (
    <div className="mt-3 rounded-md border border-rule bg-paper px-4 py-3 text-sm [&>*:first-child]:mt-0">
      <Markdown components={components} urlTransform={besides(location)}>
        {source}
      </Markdown>
    </div>
  )
}
