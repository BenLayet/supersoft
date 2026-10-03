/** How big something is. The larger it is, the less precisely it is known. */
export type Size = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL'

/** Every size, smallest first. */
export const sizes: readonly Size[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL']

const points: Record<Size, number> = { XXS: 1, XS: 2, S: 3, M: 5, L: 8, XL: 13 }

/** What a size stands for, so that value and effort can be weighed against each other. */
export const pointsOf = (size: Size): number => points[size]

export type StoryState = 'to_do' | 'in_progress' | 'done'

/** One thing a person wants to do with the application, and why. */
export interface Story {
  readonly id: string
  /** Every story belongs to exactly one feature. */
  readonly featureId: string
  /** The person who wants it — a role of the domain, never "the user". */
  readonly role: string
  readonly intention: string
  /** Mandatory: without it nobody can tell, later, whether the story still serves anything. */
  readonly reason: string
  /** What it is worth to the business. Set by the domain expert. */
  readonly value: Size
  /** What it costs to build. Stated by the maker, before the value is chosen. */
  readonly effort: Size
  readonly state: StoryState
  /** The stories it needs done before it can be done itself. */
  readonly blockedBy?: readonly string[]
}

export const start = (story: Story): Story => {
  if (story.state !== 'to_do') throw new Error(`Only a story to do can be started: ${story.id}`)
  return { ...story, state: 'in_progress' }
}

/** Done means the domain expert could see it working. */
export const finish = (story: Story): Story => {
  if (story.state !== 'in_progress')
    throw new Error(`Only a story in progress can be finished: ${story.id}`)
  return { ...story, state: 'done' }
}

/** A story stays blocked until every story it is blocked by is done. */
export const isBlocked = (story: Story, stories: readonly Story[]): boolean =>
  (story.blockedBy ?? []).some((id) => stories.find((other) => other.id === id)?.state !== 'done')

const valueForEffort = (story: Story): number => pointsOf(story.value) / pointsOf(story.effort)

/**
 * What comes next is the story still to do, and blocked by nothing, that brings
 * the most value for its effort; between two that bring as much, the one worth
 * more. It is one thing.
 */
export const nextStory = (stories: readonly Story[]): Story | undefined =>
  stories
    .filter((story) => story.state === 'to_do' && !isBlocked(story, stories))
    .sort(
      (a, b) =>
        valueForEffort(b) - valueForEffort(a) || pointsOf(b.value) - pointsOf(a.value),
    )[0]

export const countByState = (stories: readonly Story[]): Record<StoryState, number> => ({
  to_do: stories.filter((story) => story.state === 'to_do').length,
  in_progress: stories.filter((story) => story.state === 'in_progress').length,
  done: stories.filter((story) => story.state === 'done').length,
})
