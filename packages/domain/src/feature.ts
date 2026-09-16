import type { Story, StoryState } from './story'

/** One thing the application offers, named as the customer would say it. */
export interface Feature {
  readonly id: string
  readonly name: string
  /** What it is for, in one line. */
  readonly purpose: string
}

export const storiesOf = (feature: Feature, stories: readonly Story[]): readonly Story[] =>
  stories.filter((story) => story.featureId === feature.id)

/**
 * A feature is in progress as soon as one of its stories is, and done when all
 * of them are. It is never set by hand: a feature with no story describes
 * nothing, and says so by having nothing under way.
 */
export const stateOf = (feature: Feature, stories: readonly Story[]): StoryState => {
  const own = storiesOf(feature, stories)
  if (own.length === 0) return 'to_do'
  if (own.every((story) => story.state === 'done')) return 'done'
  if (own.some((story) => story.state !== 'to_do')) return 'in_progress'
  return 'to_do'
}

/** A feature with no story describes nothing. */
export const describesNothing = (feature: Feature, stories: readonly Story[]): boolean =>
  storiesOf(feature, stories).length === 0
