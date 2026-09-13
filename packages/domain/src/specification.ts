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

/** One thing that is true of the business, as one sentence a customer can confirm or deny. */
export interface Rule {
  readonly id: string
  readonly statement: string
  readonly state: RuleState
}

export interface Specification {
  readonly questions: readonly Question[]
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
