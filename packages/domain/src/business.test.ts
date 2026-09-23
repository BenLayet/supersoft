import { describe, expect, it } from 'vitest'
import {
  agree,
  answerQuestion,
  openQuestions,
  questionsOf,
  restate,
  rulesOf,
  termNamed,
  termsOf,
} from './business'
import type { Domain, Question, Rule, Term } from './business'

const question = (id: string, answer?: string, domainId = 'D1'): Question => ({
  id,
  asked: 'Can someone who is not a member watch a video?',
  answer,
  domainId,
})
const rule = (statement: string, state: Rule['state'] = 'proposed'): Rule => ({
  id: 'R1',
  statement,
  state,
  domainId: 'D1',
})

describe('questions', () => {
  it('counts the ones nobody has answered', () => {
    expect(openQuestions([question('Q1'), question('Q2', 'Only members can.')])).toHaveLength(1)
  })

  it('closes a question with an answer', () => {
    expect(answerQuestion(question('Q1'), ' Only members can. ').answer).toBe('Only members can.')
  })

  it('refuses an empty answer, which would close nothing', () => {
    expect(() => answerQuestion(question('Q1'), '   ')).toThrow()
  })
})

describe('the description', () => {
  it('is agreed once the customer has confirmed it', () => {
    expect(agree(rule('A membership runs for a year')).state).toBe('agreed')
  })

  it('is proposed again once rewritten, agreement being given to a sentence', () => {
    const agreed = agree(rule('A membership runs for a year'))
    expect(restate(agreed, 'A membership runs from September to August').state).toBe('proposed')
  })

  it('keeps its agreement when the rewriting changes nothing', () => {
    const agreed = agree(rule('A membership runs for a year'))
    expect(restate(agreed, 'A membership runs for a year')).toBe(agreed)
  })
})

describe('the lexicon', () => {
  it('finds a concept whatever the case it was typed in', () => {
    const terms: readonly Term[] = [
      { name: 'Member', definition: 'Someone who has paid', domainId: 'D1' },
    ]
    expect(termNamed(terms, 'member')?.definition).toBe('Someone who has paid')
  })
})

describe('a domain', () => {
  const membership: Domain = {
    id: 'D1',
    name: 'Membership',
    description: 'Belonging to the association, paid once a season.',
  }

  it('owns its own words and nobody owns them twice', () => {
    const terms: readonly Term[] = [
      { name: 'Member', definition: 'Someone who has paid', domainId: 'D1' },
      { name: 'Event', definition: 'A gathering on a date', domainId: 'D2' },
    ]
    expect(termsOf(membership, terms).map((term) => term.name)).toEqual(['Member'])
  })

  it('owns its own rules', () => {
    const rules: readonly Rule[] = [
      { id: 'R1', statement: 'A season runs from September', state: 'agreed', domainId: 'D1' },
      { id: 'R2', statement: 'A gathering has a limit', state: 'agreed', domainId: 'D2' },
    ]
    expect(rulesOf(membership, rules).map((rule) => rule.id)).toEqual(['R1'])
  })

  it('owns the questions still open about it', () => {
    const asked = [question('Q1'), question('Q2', undefined, 'D2'), question('Q3')]
    expect(openQuestions(questionsOf(membership, asked)).map((one) => one.id)).toEqual(['Q1', 'Q3'])
  })
})
