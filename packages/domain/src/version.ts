import type { Story } from './story'

/** Finished stories, gathered so they can be put in front of real people together. */
export interface Version {
  readonly name: string
  readonly storyIds: readonly string[]
}

/** A version contains only done stories. Work in progress waits for the next one. */
export const planVersion = (name: string, stories: readonly Story[]): Version => {
  const unfinished = stories.find((story) => story.state !== 'done')
  if (unfinished) throw new Error(`A version carries done stories only: ${unfinished.id}`)
  return { name, storyIds: stories.map((story) => story.id) }
}

/** Done, and not already carried by a version. */
export const releasableStories = (
  stories: readonly Story[],
  versions: readonly Version[],
): readonly Story[] => {
  const released = new Set(versions.flatMap((version) => version.storyIds))
  return stories.filter((story) => story.state === 'done' && !released.has(story.id))
}

/** A story that has gone out names the version that carried it. */
export const versionCarrying = (
  versions: readonly Version[],
  storyId: string,
): Version | undefined => versions.find((version) => version.storyIds.includes(storyId))
