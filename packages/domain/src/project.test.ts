import { describe, expect, it } from 'vitest'
import { mayAgree } from './project'
import type { Participant } from './project'

const participant = (role: Participant['role']): Participant => ({ name: 'Alex', role })

describe('who settles what', () => {
  it('leaves agreement to the customer', () => {
    expect(mayAgree(participant('customer'))).toBe(true)
    expect(mayAgree(participant('maker'))).toBe(false)
  })
})
