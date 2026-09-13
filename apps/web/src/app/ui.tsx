import type { ReactNode } from 'react'

export function Page({
  title,
  lead,
  children,
}: {
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{lead}</p>
      <div className="mt-8 space-y-8">{children}</div>
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

export function Pill({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'accent' | 'warn' }) {
  const tones = {
    plain: 'bg-paper text-muted border-rule',
    accent: 'bg-accent-soft text-accent border-accent/20',
    warn: 'bg-warn-soft text-warn border-warn/20',
  }
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function Button({ children, quiet = false }: { children: ReactNode; quiet?: boolean }) {
  return (
    <button
      type="submit"
      className={
        quiet
          ? 'rounded-md border border-rule px-3 py-1.5 text-sm text-ink hover:bg-paper'
          : 'rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90'
      }
    >
      {children}
    </button>
  )
}

export function Input({
  name,
  placeholder,
  defaultValue,
}: {
  name: string
  placeholder: string
  defaultValue?: string
}) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required
      className="w-full rounded-md border border-rule bg-card px-3 py-1.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
    />
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm italic text-muted">{children}</p>
}
