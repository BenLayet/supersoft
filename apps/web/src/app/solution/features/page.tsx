import { nextStory, stateOf, storiesOf } from '@supersoft/domain'
import type { Feature, Story } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { addFeature, addStory, finishStory, startStory } from '../../actions'
import { Button, Card, Empty, Input, Page, Pill, Section, Select } from '../../ui'

const stateLabels: Record<Story['state'], string> = {
  to_do: 'to do',
  in_progress: 'in progress',
  done: 'done',
}

function StoryLine({ story, next }: { story: Story; next: boolean }) {
  return (
    <div className="border-t border-rule pt-3 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm">
          As a <strong>{story.role}</strong>, I want to {story.intention}, so that {story.reason}.
        </p>
        <div className="flex shrink-0 gap-1">
          {next && <Pill tone="accent">next</Pill>}
          <Pill tone={story.state === 'done' ? 'plain' : 'warn'}>{stateLabels[story.state]}</Pill>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Pill>{story.priority}</Pill>
        {story.state !== 'done' && (
          <form action={story.state === 'to_do' ? startStory : finishStory}>
            <input type="hidden" name="id" value={story.id} />
            <Button quiet>{story.state === 'to_do' ? 'Start it' : 'It is done'}</Button>
          </form>
        )}
      </div>
    </div>
  )
}

function FeatureCard({ feature, stories, next }: { feature: Feature; stories: readonly Story[]; next?: Story }) {
  const own = storiesOf(feature, stories)
  const state = stateOf(feature, stories)

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{feature.name}</p>
          <p className="mt-1 text-sm text-muted">{feature.purpose}</p>
        </div>
        <Pill tone={state === 'done' ? 'accent' : 'plain'}>{stateLabels[state]}</Pill>
      </div>

      <div className="mt-4 space-y-3">
        {own.length === 0 && (
          <Empty>No story yet — this feature describes nothing until someone wants something.</Empty>
        )}
        {own.map((story) => (
          <StoryLine key={story.id} story={story} next={story.id === next?.id} />
        ))}
      </div>

      <form action={addStory} className="mt-4 flex flex-col gap-2 border-t border-rule pt-3">
        <input type="hidden" name="featureId" value={feature.id} />
        <Input name="role" placeholder="As a… (a role of the domain, never 'the user')" />
        <Input name="intention" placeholder="I want to…" />
        <Input name="reason" placeholder="So that…" />
        <div className="flex items-center gap-2">
          <Select name="priority" options={['essential', 'expected', 'later']} defaultValue="expected" />
          <Button quiet>Add a story</Button>
        </div>
      </form>
    </Card>
  )
}

export default async function FeaturesPage() {
  const { features, stories } = await inMemoryProjectStore.load()
  const next = nextStory(stories)

  return (
    <Page
      title="Features"
      lead="What the application offers, told as things people want to do. Priority is the customer's to set; the maker states the cost first."
    >
      <Section title="What comes next">
        <Card>
          {next ? (
            <p className="text-sm">
              As a <strong>{next.role}</strong>, I want to {next.intention}, so that {next.reason}.
            </p>
          ) : (
            <p className="text-sm italic text-muted">
              Nothing is waiting. Every story is under way or done.
            </p>
          )}
        </Card>
      </Section>

      <Section title={`Features — ${features.length}`}>
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} stories={stories} next={next} />
        ))}
        <Card>
          <form action={addFeature} className="flex flex-col gap-2">
            <Input name="name" placeholder="One thing the application offers" />
            <Input name="purpose" placeholder="What it is for, in one line" />
            <div>
              <Button quiet>Add a feature</Button>
            </div>
          </form>
        </Card>
      </Section>
    </Page>
  )
}
