import Link from 'next/link'
import { releasableStories } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { cutVersion } from '@/app/actions'
import { StorySentence, storyHref } from '@/app/story-line'
import { Button, Card, Empty, Input, Page, Section } from '@/app/ui'

export default async function VersionsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()
  const { stories, versions } = project
  const releasable = releasableStories(stories, versions)
  const storyById = new Map(stories.map((story) => [story.id, story]))

  return (
    <Page title={t.versions.title}>
      <Section title={t.versions.readyToGoOut(releasable.length)}>
        {releasable.length === 0 && <Empty>{t.versions.noneReady}</Empty>}
        {releasable.map((story) => (
          <Card key={story.id}>
            <Link href={storyHref(project.id, story)} className="text-sm hover:text-accent">
              <StorySentence story={story} language={project.language} reason={false} />
            </Link>
          </Card>
        ))}
        {writable && releasable.length > 0 && (
          <Card>
            <form action={cutVersion} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder={t.versions.versionName} />
              <Button>{t.versions.cut}</Button>
            </form>
          </Card>
        )}
      </Section>

      <Section title={t.versions.all}>
        {[...versions].reverse().map((version) => (
          <Card key={version.name}>
            <p className="text-sm font-medium">{version.name}</p>
            <ul className="mt-1 space-y-0.5 text-sm text-muted" lang={project.language}>
              {version.storyIds.map((id) => {
                const story = storyById.get(id)
                return (
                  <li key={id}>
                    {story ? (
                      <Link href={storyHref(project.id, story)} className="hover:text-accent">
                        {story.intention}
                      </Link>
                    ) : (
                      id
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        ))}
      </Section>
    </Page>
  )
}
