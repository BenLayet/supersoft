import type { Specification } from './specification'
import type { Story } from './story'
import type { Version } from './version'

/** Who someone is on a project — what they know, never what they may touch. */
export type Role = 'customer' | 'maker' | 'domainExpert'

export interface Participant {
  readonly name: string
  readonly role: Role
}

/** One application, built for one customer. */
export interface Project {
  readonly name: string
  readonly participants: readonly Participant[]
  readonly specification: Specification
  readonly stories: readonly Story[]
  readonly versions: readonly Version[]
}

/** Agreement is an act by the customer. Nobody else's yes settles a rule. */
export const mayAgree = (participant: Participant): boolean => participant.role === 'customer'

/** When a term is disputed, the domain expert's usage wins. */
export const decidesVocabulary = (participant: Participant): boolean =>
  participant.role === 'domainExpert'
