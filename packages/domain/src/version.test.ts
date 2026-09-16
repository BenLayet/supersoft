import { describe, expect, it } from 'vitest'
import {
  deploy,
  failed,
  planVersion,
  releasableStories,
  succeeded,
  versionCarrying,
  versionInUse,
} from './version'
import type { Version } from './version'
import type { Story, StoryState } from './story'

const story = (id: string, state: StoryState): Story => ({
  id,
  featureId: 'F1',
  role: 'member',
  intention: 'take a place at an event',
  reason: 'I know I am expected',
  priority: 'essential',
  state,
})

const version = (name: string, deployment: Version['deployment'], storyIds: string[] = []): Version => ({
  name,
  storyIds,
  deployment,
})

describe('planning a version', () => {
  it('gathers the stories it is given', () => {
    expect(planVersion('1.0', [story('S1', 'done'), story('S2', 'done')])).toEqual({
      name: '1.0',
      storyIds: ['S1', 'S2'],
      deployment: 'planned',
    })
  })

  it('refuses a story that is not done', () => {
    expect(() => planVersion('1.0', [story('S1', 'in_progress')])).toThrow()
  })

  it('offers the done stories no version carries yet', () => {
    const stories = [story('S1', 'done'), story('S2', 'done'), story('S3', 'to_do')]
    const shipped = [version('1.0', 'live', ['S1'])]
    expect(releasableStories(stories, shipped).map((s) => s.id)).toEqual(['S2'])
  })
})

describe('following a deployment', () => {
  it('goes planned, deploying, live', () => {
    expect(succeeded(deploy(version('1.0', 'planned'))).deployment).toBe('live')
  })

  it('says a failure out loud', () => {
    expect(failed(deploy(version('1.0', 'planned'))).deployment).toBe('failed')
  })

  it('can be deployed again after a failure', () => {
    expect(deploy(failed(version('1.0', 'deploying'))).deployment).toBe('deploying')
  })

  it('names the version real people are using', () => {
    const versions = [version('1.0', 'live'), version('1.1', 'live'), version('1.2', 'deploying')]
    expect(versionInUse(versions)?.name).toBe('1.1')
  })

  it('names none when nothing has reached real people', () => {
    expect(versionInUse([version('1.0', 'planned')])).toBeUndefined()
  })
})

describe('which version carried a story', () => {
  it('names it', () => {
    const versions = [version('1.0', 'live', ['S1']), version('1.1', 'planned', ['S2'])]
    expect(versionCarrying(versions, 'S2')?.name).toBe('1.1')
  })

  it('names none for a story that has never gone out', () => {
    expect(versionCarrying([version('1.0', 'live', ['S1'])], 'S9')).toBeUndefined()
  })
})
