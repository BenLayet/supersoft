import { redirect } from 'next/navigation'
import { projectFiles } from '@/adapters'
import { en as t } from '@/i18n/en'
import { Card, Page, Section } from '../ui'

/** A project, opened at its address and read as it is there now. Nothing here changes it. */
export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string }>
}) {
  const address = (await searchParams).address?.trim() ?? ''
  if (address === '') redirect('/')
  const project = await projectFiles.open(address)
  if (project === undefined) redirect(`/?unreadable=${encodeURIComponent(address)}`)

  return (
    <Page>
      <Section title={t.overview.address}>
        <Card>
          <p className="text-sm break-all">{project.address}</p>
        </Card>
      </Section>
    </Page>
  )
}
