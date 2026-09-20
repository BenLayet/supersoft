import Link from 'next/link'
import type { Story } from '@supersoft/domain'
import { finishStory, startStory } from '@/app/actions'
import { Button, Pill } from '@/app/ui'
import type { Dictionary } from '@/i18n'
import { storyWordsIn } from '@/i18n'

/** Where a story is read. It hangs under the one feature it belongs to. */
export const storyHref = (projectId: string, story: Story) =>
  `/projects/${projectId}/features/${story.featureId}/stories/${story.id}`

/** A story, told in the language of the project it belongs to — never translated. */
export function StorySentence({
  story,
  language,
  reason = true,
}: {
  story: Story
  language: string
  reason?: boolean
}) {
  const words = storyWordsIn(language)
  return (
    <span lang={language}>
      {words.asA(story.role)}
      <strong>{story.role}</strong>, {words.iWant} {story.intention}
      {reason && `, ${words.soThat} ${story.reason}`}.
    </span>
  )
}

export function StoryLine({
  projectId,
  language,
  story,
  next = false,
  writable,
  t,
}: {
  projectId: string
  language: string
  story: Story
  next?: boolean
  writable: boolean
  t: Dictionary
}) {
  return (
    <div className="border-t border-rule pt-3 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <Link href={storyHref(projectId, story)} className="text-sm hover:text-accent">
          <StorySentence story={story} language={language} />
        </Link>
        <div className="flex shrink-0 gap-1">
          {next && <Pill tone="accent">{t.story.next}</Pill>}
          <Pill tone={story.state === 'done' ? 'plain' : 'warn'}>{t.storyStates[story.state]}</Pill>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Pill>{t.priorities[story.priority]}</Pill>
        {writable && story.state !== 'done' && (
          <form action={story.state === 'to_do' ? startStory : finishStory}>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="id" value={story.id} />
            <Button quiet>{story.state === 'to_do' ? t.story.startIt : t.story.itIsDone}</Button>
          </form>
        )}
      </div>
    </div>
  )
}
