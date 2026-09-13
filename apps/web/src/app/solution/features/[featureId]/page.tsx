import { notFound } from 'next/navigation'
import { nextStory, stateOf, storiesOf } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { addStory } from '../../../actions'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '../../../ui'
import { StoryLine, stateLabels } from '../story-line'

export default async function FeaturePage({ params }: { params: Promise<{ featureId: string }> }) {
  const { featureId } = await params
  const { features, stories } = await inMemoryProjectStore.load()
  const feature = features.find((one) => one.id === featureId)
  if (!feature) notFound()

  const own = storiesOf(feature, stories)
  const next = nextStory(stories)

  return (
    <Page title={feature.name} back={{ href: '/solution/features', label: 'Features' }}>
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
                <StoryLine key={story.id} story={story} next={story.id === next?.id} />
              ))}
            </div>
          )}
        </Card>
      </Section>

      <Section title="Add a story">
        <Card>
          <form action={addStory} className="flex flex-col gap-2">
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
    </Page>
  )
}
