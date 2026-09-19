import type { Prototype } from '@supersoft/domain'
import { validatePrototype } from '@/app/actions'
import { Button, Card, Pill } from '@/app/ui'
import type { Dictionary } from '@/i18n'

/** A prototype of a feature: where to try it, and whether the customer has validated it. */
export function PrototypeCard({
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
            <a
              href={prototype.location}
              className="mt-1 inline-block text-sm text-muted hover:text-accent"
            >
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
