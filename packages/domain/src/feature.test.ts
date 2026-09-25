import { describe, expect, it } from 'vitest'
import { describesNothing, stateOf, storiesOf } from './feature'
import type { Feature } from './feature'
import type { Story, StoryState } from './story'

const library: Feature = {
  id: 'F1',
  name: 'The video library',
  purpose: 'members find and watch what the teachers have recorded',
}

const story = (id: string, featureId: string, state: StoryState): Story => ({
  id,
  featureId,
  role: 'member',
  intention: 'watch a guided meditation',
  reason: 'I can practise wherever I am',
  value: 'L',
  effort: 'M',
  state,
})

describe('a feature', () => {
  it('gathers its own stories and no others', () => {
    const stories = [story('S1', 'F1', 'to_do'), story('S2', 'F2', 'done')]
    expect(storiesOf(library, stories).map((s) => s.id)).toEqual(['S1'])
  })

  it('describes nothing while it has no story', () => {
    expect(describesNothing(library, [])).toBe(true)
    expect(describesNothing(library, [story('S1', 'F1', 'to_do')])).toBe(false)
  })
})

describe('the state of a feature', () => {
  it('is in progress as soon as one story is', () => {
    const stories = [story('S1', 'F1', 'in_progress'), story('S2', 'F1', 'to_do')]
    expect(stateOf(library, stories)).toBe('in_progress')
  })

  it('is in progress once part of it is done', () => {
    const stories = [story('S1', 'F1', 'done'), story('S2', 'F1', 'to_do')]
    expect(stateOf(library, stories)).toBe('in_progress')
  })

  it('is done when all of its stories are', () => {
    const stories = [story('S1', 'F1', 'done'), story('S2', 'F1', 'done')]
    expect(stateOf(library, stories)).toBe('done')
  })

  it('is to do when nothing has started, and when there is nothing at all', () => {
    expect(stateOf(library, [story('S1', 'F1', 'to_do')])).toBe('to_do')
    expect(stateOf(library, [])).toBe('to_do')
  })
})
