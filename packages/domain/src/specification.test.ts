import { describe, expect, it } from 'vitest'
import { agree, answerQuestion, openQuestions, restate, termNamed } from './specification'
import type { Question, Rule, Term } from './specification'

const question = (id: string, answer?: string): Question => ({ id, asked: 'Who pays?', answer })
const rule = (statement: string, state: Rule['state'] = 'proposed'): Rule => ({
  id: 'R1',
  statement,
  state,
})

describe('questions', () => {
  it('counts the ones nobody has answered', () => {
    expect(openQuestions([question('Q1'), question('Q2', 'The member does')])).toHaveLength(1)
  })

  it('closes a question with an answer', () => {
    expect(answerQuestion(question('Q1'), ' The member does ').answer).toBe('The member does')
  })

  it('refuses an empty answer, which would close nothing', () => {
    expect(() => answerQuestion(question('Q1'), '   ')).toThrow()
  })
})

describe('rules', () => {
  it('is agreed once the customer has confirmed it', () => {
    expect(agree(rule('A membership lasts a year')).state).toBe('agreed')
  })

  it('is proposed again once rewritten, agreement being given to a sentence', () => {
    const agreed = agree(rule('A membership lasts a year'))
    expect(restate(agreed, 'A membership lasts twelve months').state).toBe('proposed')
  })

  it('keeps its agreement when the rewriting changes nothing', () => {
    const agreed = agree(rule('A membership lasts a year'))
    expect(restate(agreed, 'A membership lasts a year')).toBe(agreed)
  })
})

describe('terms', () => {
  it('finds a concept whatever the case it was typed in', () => {
    const terms: readonly Term[] = [{ name: 'Member', definition: 'Someone who joined' }]
    expect(termNamed(terms, 'member')?.definition).toBe('Someone who joined')
  })
})
