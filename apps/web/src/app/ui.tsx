import type { ReactNode } from 'react'

export function Page({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {title && <h1 className="text-2xl font-semibold tracking-tight break-words">{title}</h1>}
      <div className={`space-y-8 ${title ? 'mt-8' : ''}`}>{children}</div>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-rule bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {children}
    </div>
  )
}

export function Button({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-md border border-rule px-3 py-1.5 text-sm text-ink hover:bg-paper"
    >
      {children}
    </button>
  )
}

export function Input({
  name,
  placeholder,
  defaultValue,
  label,
}: {
  name: string
  placeholder: string
  defaultValue?: string
  /** What this field is, when no heading says it. */
  label?: string
}) {
  return (
    <input
      type="text"
      name={name}
      aria-label={label ?? placeholder}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required
      className="w-full rounded-md border border-rule bg-card px-3 py-1.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
    />
  )
}
