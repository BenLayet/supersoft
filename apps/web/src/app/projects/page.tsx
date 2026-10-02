import { redirect } from 'next/navigation'
import { nameAndScope } from '@claree/domain'
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
  const { name, scope } = nameAndScope(project.address, await project.read('README.md'))

  return (
    <Page title={name}>
      {scope !== '' && (
        <Section title={t.overview.scope}>
          <p className="text-sm">{scope}</p>
        </Section>
      )}
      <Section title={t.overview.repository}>
        <Card>
          <p className="text-sm break-all">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {project.address}
              </a>
            ) : (
              project.address
            )}
          </p>
        </Card>
      </Section>
    </Page>
  )
}
