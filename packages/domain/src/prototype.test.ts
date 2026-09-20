import { describe, expect, it } from 'vitest'
import { prototypesOf, validate } from './prototype'
import type { Prototype } from './prototype'

const tried: Prototype = { id: 'P1', featureId: 'F2', name: 'Taking a place', state: 'being_tried' }

describe('a prototype', () => {
  it('is validated once it has been tried', () => {
    expect(validate(tried).state).toBe('validated')
  })

  it('is not validated twice', () => {
    expect(() => validate(validate(tried))).toThrow()
  })

  it('belongs to exactly one feature', () => {
    const other: Prototype = { ...tried, id: 'P2', featureId: 'F1' }
    expect(prototypesOf({ id: 'F2', name: 'Events', purpose: 'take a place' }, [tried, other])).toEqual([tried])
  })
})
