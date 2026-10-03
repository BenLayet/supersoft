import { describe, expect, it } from 'vitest'
import {
  addDocument,
  agree,
  correctDocument,
  answerQuestion,
  openQuestions,
  questionsOf,
  restate,
  rulesOf,
  termNamed,
  termsOf,
  workshopsByDate,
} from './business'
import type { Domain, Question, Rule, Term, Workshop } from './business'

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

const workshop = (id: string, date: string): Workshop => ({
  id,
  date,
  title: 'What the office does on a Monday',
  documents: [],
})

describe('workshops', () => {
  it('are read by date, the most recent first', () => {
    const held = [
      workshop('W1', '2026-01-12'),
      workshop('W2', '2026-03-04'),
      workshop('W3', '2026-02-20'),
    ]
    expect(workshopsByDate(held).map((one) => one.id)).toEqual(['W2', 'W3', 'W1'])
  })

  it('are read in that order without being moved', () => {
    const held = [workshop('W1', '2026-01-12'), workshop('W2', '2026-03-04')]
    workshopsByDate(held)
    expect(held.map((one) => one.id)).toEqual(['W1', 'W2'])
  })
})

describe('the documents of a workshop', () => {
  const held = addDocument(workshop('W1', '2026-01-12'), { kind: 'video', title: 'The visit' })

  it('can be added after the day, leaving the ones already there as they were', () => {
    const later = addDocument(held, { kind: 'transcript', title: 'What was said', location: '/t.txt' })
    expect(later.documents.map((one) => one.kind)).toEqual(['video', 'transcript'])
    expect(later.documents[0]).toBe(held.documents[0])
    expect(later.date).toBe('2026-01-12')
  })

  it('leave the workshop they were added to untouched', () => {
    addDocument(held, { kind: 'report', title: 'Report' })
    expect(held.documents).toHaveLength(1)
  })

  it('each say what they are', () => {
    expect(() => addDocument(held, { kind: 'notes', title: '  ' })).toThrow()
  })

  it('can be corrected after the workshop, the others left as they were', () => {
    const both = addDocument(held, { kind: 'report', title: 'Report', text: 'Draft' })
    const corrected = correctDocument(both, 'W1-2', '# Report\n\nWhat was agreed.')
    expect(corrected.documents[1]?.text).toBe('# Report\n\nWhat was agreed.')
    expect(corrected.documents[0]).toBe(both.documents[0])
    expect(both.documents[1]?.text).toBe('Draft')
  })

  it('are corrected with something, and only when they belong to the workshop', () => {
    expect(() => correctDocument(held, 'W1-1', ' \n ')).toThrow()
    expect(() => correctDocument(held, 'W9-1', 'Text')).toThrow()
  })

  it('are not said to be kept somewhere when no place was given', () => {
    const noted = addDocument(held, { kind: 'notes', title: 'Notes', location: ' ' })
    expect(noted.documents[1]?.location).toBeUndefined()
  })
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
  it('is agreed once a domain expert has confirmed it', () => {
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
