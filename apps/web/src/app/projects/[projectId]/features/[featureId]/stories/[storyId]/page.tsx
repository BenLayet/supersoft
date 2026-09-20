import Link from 'next/link'
import { notFound } from 'next/navigation'
import { nextStory, versionCarrying } from '@supersoft/domain'
import { open } from '@/session'
import { dictionary } from '@/i18n'
import { finishStory, startStory } from '@/app/actions'
import { StorySentence } from '@/app/story-line'
import { Button, Card, Page, Pill, Section } from '@/app/ui'

export default async function StoryPage({
  params,
}: {
  params: Promise<{ projectId: string; featureId: string; storyId: string }>
}) {
  const { projectId, featureId, storyId } = await params
  const { project, writable } = await open(projectId)
  const t = await dictionary()
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
        href: `/projects/${project.id}/features/${feature.id}`,
        label: feature.name,
      }}
    >
      <Section title={t.story.theStory}>
        <Card>
          <p className="text-sm">
            <StorySentence story={story} language={project.language} />
          </p>
          <dl className="mt-4 space-y-2 border-t border-rule pt-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">{t.story.person}</dt>
              <dd lang={project.language}>{story.role}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">{t.story.intention}</dt>
              <dd lang={project.language}>{story.intention}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">{t.story.reason}</dt>
              <dd lang={project.language}>{story.reason}</dd>
            </div>
          </dl>
        </Card>
      </Section>

      <Section title={t.story.whereItStands}>
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={story.state === 'done' ? 'plain' : 'warn'}>{t.storyStates[story.state]}</Pill>
            <Pill tone={story.priority === 'essential' ? 'accent' : 'plain'}>{t.priorities[story.priority]}</Pill>
            {story.id === next?.id && <Pill tone="accent">{t.story.next}</Pill>}
          </div>
          {writable && story.state !== 'done' && (
            <form action={story.state === 'to_do' ? startStory : finishStory} className="mt-3">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="id" value={story.id} />
              <Button>{story.state === 'to_do' ? t.story.startIt : t.story.itIsDone}</Button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted">
            {t.story.doneMeans}
          </p>
        </Card>
      </Section>

      <Section title={t.story.realPeople}>
        <Card>
          {carried ? (
            <p className="text-sm">
              {t.story.carriedBy}{' '}
              <Link
                href={`/projects/${project.id}/versions`}
                className="hover:text-accent"
              >
                {t.story.version(carried.name)}
              </Link>
              ,{' '}
              {carried.deployment === 'live'
                ? t.story.whichIsInUse
                : t.story.whichIs(t.deployments[carried.deployment])}
            </p>
          ) : (
            <p className="text-sm italic text-muted">{t.story.noVersion}</p>
          )}
        </Card>
      </Section>
    </Page>
  )
}
