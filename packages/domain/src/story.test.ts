import { describe, expect, it } from 'vitest'
import { countByState, finish, isBlocked, nextStory, pointsOf, start } from './story'
import type { Size, Story, StoryState } from './story'

const story = (
  id: string,
  value: Size,
  effort: Size = 'M',
  state: StoryState = 'to_do',
): Story => ({
  id,
  featureId: 'F1',
  role: 'member',
  intention: 'take a place at an event',
  reason: 'I know I am expected',
  value,
  effort,
  state,
})

describe('tracking a story', () => {
  it('goes to do, in progress, done', () => {
    expect(finish(start(story('S1', 'L'))).state).toBe('done')
  })

  it('cannot be started twice', () => {
    expect(() => start(start(story('S1', 'L')))).toThrow()
  })

  it('cannot be finished before it is started', () => {
    expect(() => finish(story('S1', 'L'))).toThrow()
  })

  it('counts where the work stands', () => {
    const stories = [
      story('S1', 'L', 'M', 'done'),
      story('S2', 'M', 'M', 'in_progress'),
      story('S3', 'S'),
    ]
    expect(countByState(stories)).toEqual({ to_do: 1, in_progress: 1, done: 1 })
  })
})

describe('a size', () => {
  it('stands for a number, the gaps widening as it grows', () => {
    expect((['XXS', 'XS', 'S', 'M', 'L', 'XL'] as const).map(pointsOf)).toEqual([1, 2, 3, 5, 8, 13])
  })
})

describe('a blocked story', () => {
  it('stays blocked until every story it is blocked by is done', () => {
    const blocked = { ...story('S3', 'L'), blockedBy: ['S1', 'S2'] }
    expect(isBlocked(blocked, [story('S1', 'L', 'M', 'done'), story('S2', 'L', 'M', 'in_progress')])).toBe(true)
    expect(isBlocked(blocked, [story('S1', 'L', 'M', 'done'), story('S2', 'L', 'M', 'done')])).toBe(false)
  })

  it('is blocked by nothing when it names nothing', () => {
    expect(isBlocked(story('S1', 'L'), [])).toBe(false)
  })
})

describe('what comes next', () => {
  it('is the story still to do that brings the most value for its effort', () => {
    const stories = [story('S1', 'XL', 'XL'), story('S2', 'M', 'XS'), story('S3', 'L', 'M')]
    expect(nextStory(stories)?.id).toBe('S2')
  })

  it('is, between two that bring as much, the one worth more', () => {
    const stories = [story('S1', 'XS', 'XS'), story('S2', 'L', 'L')]
    expect(nextStory(stories)?.id).toBe('S2')
  })

  it('ignores what is already under way or finished', () => {
    const stories = [story('S1', 'XL', 'XXS', 'in_progress'), story('S2', 'XXS', 'XL')]
    expect(nextStory(stories)?.id).toBe('S2')
  })

  it('waits for what a story is blocked by', () => {
    const opening = story('A001', 'XL', 'M')
    const reading = { ...story('B001', 'L', 'XS'), blockedBy: ['A001'] }
    expect(nextStory([opening, reading])?.id).toBe('A001')
    expect(nextStory([{ ...opening, state: 'done' }, reading])?.id).toBe('B001')
  })

  it('is nothing at all when everything is under way', () => {
    expect(nextStory([story('S1', 'L', 'M', 'done')])).toBeUndefined()
  })
})
