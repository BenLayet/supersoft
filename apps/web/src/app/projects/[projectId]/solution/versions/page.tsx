import Link from 'next/link'
import { releasableStories, versionInUse } from '@supersoft/domain'
import type { Version } from '@supersoft/domain'
import { open } from '@/session'
import { cutVersion, deploymentFailed, deploymentSucceeded, startDeployment } from '@/app/actions'
import { storyHref } from '@/app/story-line'
import { Button, Card, Empty, Input, Page, Pill, Section } from '@/app/ui'

const tones: Record<Version['deployment'], 'plain' | 'accent' | 'warn'> = {
  planned: 'plain',
  deploying: 'warn',
  live: 'accent',
  failed: 'warn',
}

const labels: Record<Version['deployment'], string> = {
  planned: 'planned',
  deploying: 'deploying',
  live: 'in real use',
  failed: 'failed',
}

export default async function VersionsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const { project, writable } = await open(projectId)
  const { stories, versions } = project
  const releasable = releasableStories(stories, versions)
  const live = versionInUse(versions)
  const storyById = new Map(stories.map((story) => [story.id, story]))

  return (
    <Page title="Versions">
      <Section title="In real use">
        <Card>
          <p className="text-sm">
            {live ? `Real people are using ${live.name}.` : 'Nothing has reached real people yet.'}
          </p>
        </Card>
      </Section>

      <Section title={`Ready to go out — ${releasable.length}`}>
        {releasable.length === 0 && (
          <Empty>No finished story is waiting. Nothing to cut a version from.</Empty>
        )}
        {releasable.map((story) => (
          <Card key={story.id}>
            <Link href={storyHref(project.id, story)} className="text-sm hover:text-accent">
              As a <strong>{story.role}</strong>, I want to {story.intention}.
            </Link>
          </Card>
        ))}
        {writable && releasable.length > 0 && (
          <Card>
            <form action={cutVersion} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="projectId" value={project.id} />
              <Input name="name" placeholder="Name this version, e.g. 1.1" />
              <Button>Cut the version</Button>
            </form>
          </Card>
        )}
      </Section>

      <Section title="All versions">
        {[...versions].reverse().map((version) => (
          <Card key={version.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{version.name}</p>
                <ul className="mt-1 space-y-0.5 text-sm text-muted">
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
              <Pill tone={tones[version.deployment]}>{labels[version.deployment]}</Pill>
            </div>
            {writable && (
              <div className="mt-3 flex gap-2">
                {version.deployment !== 'deploying' && version.deployment !== 'live' && (
                  <form action={startDeployment}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="name" value={version.name} />
                    <Button>Deploy it</Button>
                  </form>
                )}
                {version.deployment === 'deploying' && (
                  <>
                    <form action={deploymentSucceeded}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="name" value={version.name} />
                      <Button>It is up</Button>
                    </form>
                    <form action={deploymentFailed}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <input type="hidden" name="name" value={version.name} />
                      <Button quiet>It failed</Button>
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
