import { describe, expect, it } from 'vitest'
import { countByState, finish, nextStory, start } from './story'
import type { Priority, Story, StoryState } from './story'

const story = (id: string, priority: Priority, state: StoryState = 'to_do'): Story => ({
  id,
  featureId: 'F1',
  role: 'member',
  intention: 'take a place at an event',
  reason: 'I know I am expected',
  priority,
  state,
})

describe('tracking a story', () => {
  it('goes to do, in progress, done', () => {
    expect(finish(start(story('S1', 'essential'))).state).toBe('done')
  })

  it('cannot be started twice', () => {
    expect(() => start(start(story('S1', 'essential')))).toThrow()
  })

  it('cannot be finished before it is started', () => {
    expect(() => finish(story('S1', 'essential'))).toThrow()
  })

  it('counts where the work stands', () => {
    const stories = [
      story('S1', 'essential', 'done'),
      story('S2', 'expected', 'in_progress'),
      story('S3', 'later'),
    ]
    expect(countByState(stories)).toEqual({ to_do: 1, in_progress: 1, done: 1 })
  })
})

describe('what comes next', () => {
  it('is the most important story still to do', () => {
    const stories = [story('S1', 'later'), story('S2', 'essential'), story('S3', 'expected')]
    expect(nextStory(stories)?.id).toBe('S2')
  })

  it('ignores what is already under way or finished', () => {
    const stories = [story('S1', 'essential', 'in_progress'), story('S2', 'later')]
    expect(nextStory(stories)?.id).toBe('S2')
  })

  it('is nothing at all when everything is under way', () => {
    expect(nextStory([story('S1', 'essential', 'done')])).toBeUndefined()
  })
})
