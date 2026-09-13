/** Informal material, kept as it was given: a page of notes, a recording, a film. */
export interface Source {
  readonly id: string
  readonly kind: 'note' | 'audio' | 'video'
  readonly title: string
  /** Who it came from, in their own words where possible. */
  readonly from: string
}

/** Something the project knows it does not know. */
export interface Question {
  readonly id: string
  readonly asked: string
  readonly answer?: string
}

/** One concept of the business: one name, one definition, in the customer's words. */
export interface Term {
  readonly name: string
  readonly definition: string
}

export type RuleState = 'proposed' | 'agreed'

/** One sentence of the description: something true of the business. */
export interface Rule {
  readonly id: string
  readonly statement: string
  readonly state: RuleState
}

/** The business the application serves: what was said, and what was written from it. */
export interface Domain {
  /** The informal side. */
  readonly sources: readonly Source[]
  readonly questions: readonly Question[]
  /** The formal side: the lexicon, and the description. */
  readonly terms: readonly Term[]
  readonly rules: readonly Rule[]
}

export const answerQuestion = (question: Question, answer: string): Question => {
  const answered = answer.trim()
  if (answered === '') throw new Error('A question is answered with something, or left open.')
  return { ...question, answer: answered }
}

export const isOpen = (question: Question): boolean => question.answer === undefined

/** The open questions of a project are always countable. */
export const openQuestions = (questions: readonly Question[]): readonly Question[] =>
  questions.filter(isOpen)

export const agree = (rule: Rule): Rule => ({ ...rule, state: 'agreed' })

/** Agreement is given to a sentence, not to a subject: rewriting undoes it. */
export const restate = (rule: Rule, statement: string): Rule =>
  statement === rule.statement ? rule : { ...rule, statement, state: 'proposed' }

/** A concept has exactly one name. */
export const termNamed = (terms: readonly Term[], name: string): Term | undefined =>
  terms.find((term) => term.name.toLowerCase() === name.toLowerCase())
