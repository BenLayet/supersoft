import { describe, expect, it } from 'vitest'
import { decidesVocabulary, mayAgree } from './project'
import type { Participant } from './project'

const participant = (role: Participant['role']): Participant => ({ name: 'Alex', role })

describe('who settles what', () => {
  it('leaves agreement to the customer', () => {
    expect(mayAgree(participant('customer'))).toBe(true)
    expect(mayAgree(participant('maker'))).toBe(false)
  })

  it('leaves a disputed word to the domain expert', () => {
    expect(decidesVocabulary(participant('domainExpert'))).toBe(true)
    expect(decidesVocabulary(participant('customer'))).toBe(false)
  })
})
