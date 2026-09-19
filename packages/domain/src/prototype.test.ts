import { describe, expect, it } from 'vitest'
import { validate } from './prototype'
import type { Prototype } from './prototype'

const tried: Prototype = { id: 'P1', name: 'Taking a place', state: 'being_tried' }

describe('a prototype', () => {
  it('is validated once it has been tried', () => {
    expect(validate(tried).state).toBe('validated')
  })

  it('is not validated twice', () => {
    expect(() => validate(validate(tried))).toThrow()
  })
})
