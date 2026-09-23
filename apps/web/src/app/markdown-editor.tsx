'use client'

import { useState } from 'react'
import { MarkdownText } from './markdown'

/**
 * A text written in Markdown, and how it will read. The text stays in the form
 * while it is previewed, so saving from either side sends what was written.
 */
export function MarkdownEditor({
  name,
  defaultValue,
  location,
  labels,
}: {
  name: string
  defaultValue: string
  /** Where the document is kept, so its links preview as they will read. */
  location?: string
  labels: { write: string; preview: string; placeholder: string; empty: string }
}) {
  const [text, setText] = useState(defaultValue)
  const [previewing, setPreviewing] = useState(false)

  const tab = (active: boolean) =>
    `rounded-full px-3 py-1 text-sm ${active ? 'bg-accent-soft text-accent' : 'text-muted hover:text-ink'}`

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!previewing}
          onClick={() => setPreviewing(false)}
          className={tab(!previewing)}
        >
          {labels.write}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={previewing}
          onClick={() => setPreviewing(true)}
          className={tab(previewing)}
        >
          {labels.preview}
        </button>
      </div>
      <textarea
        name={name}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={labels.placeholder}
        aria-label={labels.placeholder}
        required
        rows={16}
        hidden={previewing}
        className="w-full rounded-md border border-rule bg-card px-3 py-2 font-mono text-sm outline-none placeholder:text-muted/60 focus:border-accent"
      />
      {previewing &&
        (text.trim() === '' ? (
          <p className="text-sm text-muted italic">{labels.empty}</p>
        ) : (
          <MarkdownText source={text} location={location} />
        ))}
    </div>
  )
}
