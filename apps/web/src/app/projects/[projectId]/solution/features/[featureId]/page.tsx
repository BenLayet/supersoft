import { notFound } from 'next/navigation'
import { nextStory, stateOf, storiesOf } from '@supersoft/domain'
import { open } from '@/session'
import { addStory } from '@/app/actions'
import { StoryLine, stateLabels } from '@/app/story-line'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '@/app/ui'

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ projectId: string; featureId: string }>
}) {
  const { projectId, featureId } = await params
  const { project, writable } = await open(projectId)
  const { features, stories } = project
  const feature = features.find((one) => one.id === featureId)
  if (!feature) notFound()

  const own = storiesOf(feature, stories)
  const next = nextStory(stories)

  return (
    <Page
      title={feature.name}
      back={{ href: `/projects/${project.id}/solution/features`, label: 'Features' }}
    >
      <Section title="What it is for">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm">{feature.purpose}</p>
            <Pill tone={stateOf(feature, stories) === 'done' ? 'accent' : 'plain'}>
              {stateLabels[stateOf(feature, stories)]}
            </Pill>
          </div>
        </Card>
      </Section>

      <Section title={`Stories — ${own.length}`}>
        <Card>
          {own.length === 0 ? (
            <Empty>
              No story yet — this feature describes nothing until someone wants something.
            </Empty>
          ) : (
            <div className="space-y-3">
              {own.map((story) => (
                <StoryLine
                  key={story.id}
                  projectId={project.id}
                  story={story}
                  next={story.id === next?.id}
                  writable={writable}
                />
              ))}
            </div>
          )}
        </Card>
      </Section>

      {writable && (
        <Section title="Add a story">
          <Card>
            <form action={addStory} className="flex flex-col gap-2">
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="featureId" value={feature.id} />
              <Input name="role" placeholder="As a… (a role of the domain, never 'the user')" />
              <Input name="intention" placeholder="I want to…" />
              <Input name="reason" placeholder="So that…" />
              <div className="flex items-center gap-2">
                <Select
                  name="priority"
                  options={['essential', 'expected', 'later']}
                  defaultValue="expected"
                />
                <Button quiet>Add</Button>
              </div>
            </form>
          </Card>
          <p className="text-xs text-muted">
            Priority is the customer&apos;s to set. The maker&apos;s contribution is the cost, stated
            before the priority is chosen.
          </p>
        </Section>
      )}
    </Page>
  )
}
