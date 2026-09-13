import { countByState, nextStory } from '@supersoft/domain'
import type { Story } from '@supersoft/domain'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'
import { addStory, finishStory, startStory } from '../actions'
import { Button, Card, Empty, Input, Page, Pill, Section } from '../ui'

const priorities: Story['priority'][] = ['essential', 'expected', 'later']

function StoryLine({ story }: { story: Story }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm">
          As a <strong>{story.role}</strong>, I want to {story.intention}, so that {story.reason}.
        </p>
        <Pill tone={story.priority === 'essential' ? 'accent' : 'plain'}>{story.priority}</Pill>
      </div>
      {story.state !== 'done' && (
        <form action={story.state === 'to_do' ? startStory : finishStory} className="mt-3">
          <input type="hidden" name="id" value={story.id} />
          <Button quiet>{story.state === 'to_do' ? 'Start it' : 'It is done'}</Button>
        </form>
      )}
    </Card>
  )
}

export default async function StoriesPage() {
  const { stories } = await inMemoryProjectStore.load()
  const counts = countByState(stories)
  const next = nextStory(stories)
  const byState = (state: Story['state']) => stories.filter((story) => story.state === state)

  return (
    <Page
      title="Stories"
      lead="What one person wants to do with the application, and why. A story is done when the customer could see it working."
    >
      <Section title="What comes next">
        {next ? (
          <StoryLine story={next} />
        ) : (
          <Empty>Nothing is waiting. Every story is under way or done.</Empty>
        )}
      </Section>

      <Section title={`In progress — ${counts.in_progress}`}>
        {byState('in_progress').length === 0 && <Empty>Nothing is being built right now.</Empty>}
        {byState('in_progress').map((story) => (
          <StoryLine key={story.id} story={story} />
        ))}
      </Section>

      <Section title={`To do — ${counts.to_do}`}>
        {byState('to_do').map((story) => (
          <StoryLine key={story.id} story={story} />
        ))}
      </Section>

      <Section title={`Done — ${counts.done}`}>
        {byState('done').map((story) => (
          <StoryLine key={story.id} story={story} />
        ))}
      </Section>

      <Section title="Add a story">
        <Card>
          <form action={addStory} className="flex flex-col gap-2">
            <Input name="role" placeholder="As a… (a role of the domain, never 'the user')" />
            <Input name="intention" placeholder="I want to…" />
            <Input name="reason" placeholder="So that…" />
            <select
              name="priority"
              defaultValue="expected"
              className="w-full rounded-md border border-rule bg-card px-3 py-1.5 text-sm"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <div>
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
