import Link from 'next/link'
import type { Story } from '@supersoft/domain'
import { finishStory, startStory } from '../../actions'
import { Button, Pill } from '../../ui'

/** Where a story is read. It hangs under the one feature it belongs to. */
export const storyHref = (story: Story) =>
  `/solution/features/${story.featureId}/stories/${story.id}`

export const stateLabels: Record<Story['state'], string> = {
  to_do: 'to do',
  in_progress: 'in progress',
  done: 'done',
}

export function StoryLine({ story, next = false }: { story: Story; next?: boolean }) {
  return (
    <div className="border-t border-rule pt-3 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <Link href={storyHref(story)} className="text-sm hover:text-accent">
          As a <strong>{story.role}</strong>, I want to {story.intention}, so that {story.reason}.
        </Link>
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
