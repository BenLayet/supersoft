import Link from 'next/link'
import { releasableStories, versionInUse } from '@supersoft/domain'
import type { Version } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { cutVersion, deploymentFailed, deploymentSucceeded, startDeployment } from '@/app/actions'
import { StorySentence, storyHref } from '@/app/story-line'
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/app/ui'

const tones: Record<Version['deployment'], 'plain' | 'accent' | 'warn'> = {
  planned: 'plain',
  deploying: 'warn',
  live: 'accent',
  failed: 'warn',
}

export default async function VersionsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()
  const { stories, versions } = project
  const releasable = releasableStories(stories, versions)
  const live = versionInUse(versions)
  const storyById = new Map(stories.map((story) => [story.id, story]))

  return (
    <Page title={t.versions.title}>
      <Section title={t.versions.inRealUse}>
        <Card>
          <p className="text-sm">
            {live ? t.project.inUse(live.name) : t.project.nothingInUse}
          </p>
        </Card>
      </Section>

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
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{version.name}</p>
                <ul className="mt-1 space-y-0.5 text-sm text-muted" lang={project.language}>
                  {version.storyIds.map((id) => {
                    const story = storyById.get(id)
                    return (
                      <li key={id}>
                        {story ? (
                          <Link
                            href={storyHref(project.id, story)}
                            className="hover:text-accent"
                          >
                            {story.intention}
                          </Link>
                        ) : (
                          id
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <Pill tone={tones[version.deployment]}>{t.deployments[version.deployment]}</Pill>
            </div>
            {writable && (
              <div className="mt-3 flex gap-2">
                {version.deployment !== 'deploying' && version.deployment !== 'live' && (
                  <form action={startDeployment}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="name" value={version.name} />
                    <Button>{t.versions.deploy}</Button>
                  </form>
                )}
                {version.deployment === 'deploying' && (
                  <>
                    <form action={deploymentSucceeded}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="name" value={version.name} />
                      <Button>{t.versions.itIsUp}</Button>
                    </form>
                    <form action={deploymentFailed}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="name" value={version.name} />
                      <Button quiet>{t.versions.itFailed}</Button>
                    </form>
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
      </Section>
    </Page>
  )
}
