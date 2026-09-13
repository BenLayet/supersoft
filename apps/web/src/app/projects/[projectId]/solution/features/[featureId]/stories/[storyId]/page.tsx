import Link from 'next/link'
import { notFound } from 'next/navigation'
import { nextStory, versionCarrying } from '@supersoft/domain'
import { open } from '@/session'
import { finishStory, startStory } from '@/app/actions'
import { stateLabels } from '@/app/story-line'
import { Button, Card, Page, Pill, Section } from '@/app/ui'

export default async function StoryPage({
  params,
}: {
  params: Promise<{ projectId: string; featureId: string; storyId: string }>
}) {
  const { projectId, featureId, storyId } = await params
  const { project, writable } = await open(projectId)
  const { features, stories, versions } = project
  const story = stories.find((one) => one.id === storyId)
  const feature = features.find((one) => one.id === featureId)
  if (!story || !feature || story.featureId !== feature.id) notFound()

  const next = nextStory(stories)
  const carried = versionCarrying(versions, story.id)

  return (
    <Page
      title={story.intention}
      back={{
        href: `/projects/${project.id}/solution/features/${feature.id}`,
        label: feature.name,
      }}
    >
      <Section title="The story">
        <Card>
          <p className="text-sm">
            As a <strong>{story.role}</strong>, I want to {story.intention}, so that {story.reason}.
          </p>
          <dl className="mt-4 space-y-2 border-t border-rule pt-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">Person</dt>
              <dd>{story.role}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">Intention</dt>
              <dd>{story.intention}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">Reason</dt>
              <dd>{story.reason}</dd>
            </div>
          </dl>
        </Card>
      </Section>

      <Section title="Where it stands">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={story.state === 'done' ? 'plain' : 'warn'}>{stateLabels[story.state]}</Pill>
            <Pill tone={story.priority === 'essential' ? 'accent' : 'plain'}>{story.priority}</Pill>
            {story.id === next?.id && <Pill tone="accent">next</Pill>}
          </div>
          {writable && story.state !== 'done' && (
            <form action={story.state === 'to_do' ? startStory : finishStory} className="mt-3">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="id" value={story.id} />
              <Button>{story.state === 'to_do' ? 'Start it' : 'It is done'}</Button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted">
            Done means the customer could see it working, not that the code exists.
          </p>
        </Card>
      </Section>

      <Section title="Real people">
        <Card>
          {carried ? (
            <p className="text-sm">
              Carried by{' '}
              <Link
                href={`/projects/${project.id}/solution/versions`}
                className="hover:text-accent"
              >
                version {carried.name}
              </Link>
              ,{' '}
              {carried.deployment === 'live'
                ? 'which real people are using.'
                : `which is ${carried.deployment}.`}
            </p>
          ) : (
            <p className="text-sm italic text-muted">No version carries it yet.</p>
          )}
        </Card>
      </Section>
    </Page>
  )
}
