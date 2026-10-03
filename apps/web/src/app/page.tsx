import { en as t } from '@/i18n/en'
import { productName } from '@/product'
import { Button, Card, Input, Page, Section } from './ui'

/** Arriving: the address of a project, which asks nothing of anyone. */
export default async function ArrivalPage({
  searchParams,
}: {
  searchParams: Promise<{ unreadable?: string }>
}) {
  const { unreadable } = await searchParams
  return (
    <Page title={productName}>
      <Section title={t.arrival.addProject}>
        <Card>
          <form action="/projects" className="flex flex-col gap-2 sm:flex-row">
            <Input
              name="address"
              placeholder="https://github.com/octocat/Hello-World"
              defaultValue={unreadable}
              label={t.arrival.projectAddress}
            />
            <Button>{t.arrival.openIt}</Button>
          </form>
          {unreadable && <p className="mt-2 text-sm text-warn">{t.arrival.unreadable(unreadable)}</p>}
        </Card>
      </Section>
    </Page>
  )
}
