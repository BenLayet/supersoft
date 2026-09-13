/** Set by the customer, once the maker has stated the cost. */
export type Priority = 'essential' | 'expected' | 'later'

export type StoryState = 'to_do' | 'in_progress' | 'done'

/** One thing a person wants to do with the application, and why. */
export interface Story {
  readonly id: string
  /** The person who wants it — a role of the domain, never "the user". */
  readonly role: string
  readonly intention: string
  /** Mandatory: without it nobody can tell, later, whether the story still serves anything. */
  readonly reason: string
  readonly priority: Priority
  readonly state: StoryState
}

const priorityOrder: Record<Priority, number> = { essential: 0, expected: 1, later: 2 }

export const start = (story: Story): Story => {
  if (story.state !== 'to_do') throw new Error(`Only a story to do can be started: ${story.id}`)
  return { ...story, state: 'in_progress' }
}

/** Done means the customer could see it working. */
export const finish = (story: Story): Story => {
  if (story.state !== 'in_progress')
    throw new Error(`Only a story in progress can be finished: ${story.id}`)
  return { ...story, state: 'done' }
}

/** What comes next is the most important story still to do — and it is one thing. */
export const nextStory = (stories: readonly Story[]): Story | undefined =>
  stories
    .filter((story) => story.state === 'to_do')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])[0]

export const countByState = (stories: readonly Story[]): Record<StoryState, number> => ({
  to_do: stories.filter((story) => story.state === 'to_do').length,
  in_progress: stories.filter((story) => story.state === 'in_progress').length,
  done: stories.filter((story) => story.state === 'done').length,
})
