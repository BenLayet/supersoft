import type { Story } from './story'

export type Deployment = 'planned' | 'deploying' | 'live' | 'failed'

/** Finished stories, gathered so they can be put in front of real people together. */
export interface Version {
  readonly name: string
  readonly storyIds: readonly string[]
  readonly deployment: Deployment
}

/** A version contains only done stories. Work in progress waits for the next one. */
export const planVersion = (name: string, stories: readonly Story[]): Version => {
  const unfinished = stories.find((story) => story.state !== 'done')
  if (unfinished) throw new Error(`A version carries done stories only: ${unfinished.id}`)
  return { name, storyIds: stories.map((story) => story.id), deployment: 'planned' }
}

/** Done, and not already carried by a version. */
export const releasableStories = (
  stories: readonly Story[],
  versions: readonly Version[],
): readonly Story[] => {
  const released = new Set(versions.flatMap((version) => version.storyIds))
  return stories.filter((story) => story.state === 'done' && !released.has(story.id))
}

export const deploy = (version: Version): Version => {
  if (version.deployment === 'deploying')
    throw new Error(`Already deploying: ${version.name}`)
  return { ...version, deployment: 'deploying' }
}

export const succeeded = (version: Version): Version => ({ ...version, deployment: 'live' })

/** A failure is a state like any other, and it is said out loud. */
export const failed = (version: Version): Version => ({ ...version, deployment: 'failed' })

/** A project always knows which version real people are using. */
export const versionInUse = (versions: readonly Version[]): Version | undefined =>
  [...versions].reverse().find((version) => version.deployment === 'live')
