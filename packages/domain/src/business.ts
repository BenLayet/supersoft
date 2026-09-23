export type DocumentKind = 'slides' | 'video' | 'audio' | 'notes' | 'report' | 'transcript'

/** One thing a workshop left behind. */
export interface WorkshopDocument {
  readonly id: string
  readonly kind: DocumentKind
  readonly title: string
  /** Where it is kept, to go back to it as it was that day. */
  readonly location?: string
}

/** One working session: the day it was held, what it was about, and what it left behind. */
export interface Workshop {
  readonly id: string
  /** The day it was held, as `YYYY-MM-DD`. A workshop is dated, and never rewritten. */
  readonly date: string
  readonly title: string
  readonly documents: readonly WorkshopDocument[]
}

/** Something the project knows it does not know about one part of the business. */
export interface Question {
  readonly id: string
  readonly asked: string
  readonly answer?: string
  /** The part of the business the question is about. */
  readonly domainId: string
}

/** One part of the business, with its own words. */
export interface Domain {
  readonly id: string
  readonly name: string
  /**
   * What this part of the business is, in business terms only. What the
   * application does about it belongs to the solution.
   */
  readonly description: string
}

/** One concept of the business: one name, one definition, in the customer's words. */
export interface Term {
  readonly name: string
  readonly definition: string
  /** The part of the business that owns the word. */
  readonly domainId: string
}

export type RuleState = 'proposed' | 'agreed'

/** One sentence of the description: something true of the business. */
export interface Rule {
  readonly id: string
  readonly statement: string
  readonly state: RuleState
  readonly domainId: string
}

/** The business the application serves: what was said, and what was written from it. */
export interface Business {
  /** The informal side. */
  readonly workshops: readonly Workshop[]
  /** The formal side: the parts of the business, and what is written under each. */
  readonly domains: readonly Domain[]
  readonly terms: readonly Term[]
  readonly rules: readonly Rule[]
  readonly questions: readonly Question[]
}

/** A workshop is what was said on one day, not a document kept up to date. */
export const workshopsByDate = (workshops: readonly Workshop[]): readonly Workshop[] =>
  [...workshops].sort((one, other) => other.date.localeCompare(one.date))

/**
 * A report or a transcript often comes after the day. Adding one leaves every
 * document already there as it was.
 */
export const addDocument = (
  workshop: Workshop,
  document: Omit<WorkshopDocument, 'id'>,
): Workshop => {
  const title = document.title.trim()
  if (title === '') throw new Error('A document says what it is.')
  const location = document.location?.trim() || undefined
  const id = `${workshop.id}-${workshop.documents.length + 1}`
  return { ...workshop, documents: [...workshop.documents, { ...document, id, title, location }] }
}

export const answerQuestion = (question: Question, answer: string): Question => {
  const answered = answer.trim()
  if (answered === '') throw new Error('A question is answered with something, or left open.')
  return { ...question, answer: answered }
}

export const isOpen = (question: Question): boolean => question.answer === undefined

/** The open questions of a domain are always countable. */
export const openQuestions = (questions: readonly Question[]): readonly Question[] =>
  questions.filter(isOpen)

export const agree = (rule: Rule): Rule => ({ ...rule, state: 'agreed' })

/** Agreement is given to a sentence, not to a subject: rewriting undoes it. */
export const restate = (rule: Rule, statement: string): Rule =>
  statement === rule.statement ? rule : { ...rule, statement, state: 'proposed' }

/** A concept has exactly one name. */
export const termNamed = (terms: readonly Term[], name: string): Term | undefined =>
  terms.find((term) => term.name.toLowerCase() === name.toLowerCase())

/** Every term belongs to exactly one domain. */
export const termsOf = (domain: Domain, terms: readonly Term[]): readonly Term[] =>
  terms.filter((term) => term.domainId === domain.id)

/** Every rule belongs to exactly one domain. */
export const rulesOf = (domain: Domain, rules: readonly Rule[]): readonly Rule[] =>
  rules.filter((rule) => rule.domainId === domain.id)

/** Every question belongs to exactly one domain. */
export const questionsOf = (domain: Domain, questions: readonly Question[]): readonly Question[] =>
  questions.filter((question) => question.domainId === domain.id)
